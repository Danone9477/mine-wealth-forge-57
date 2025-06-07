
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search, Filter, CreditCard, Star, User, AlertCircle } from "lucide-react";
import ProcessWithdrawalModal from './ProcessWithdrawalModal';

interface WithdrawalsManagementProps {
  transactions: any[];
  onUpdateTransaction: (transactionId: string, status: string, notes?: string) => void;
}

const WithdrawalsManagement = ({ transactions, onUpdateTransaction }: WithdrawalsManagementProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Filtrar apenas transações de saque
  const withdrawalTransactions = transactions.filter(t => t.type === 'withdrawal' || t.type === 'withdraw');

  console.log('🔍 Total de saques encontrados:', withdrawalTransactions.length);

  // Aplicar filtros
  const filteredTransactions = withdrawalTransactions.filter(transaction => {
    const matchesSearch = transaction.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         transaction.status === statusFilter ||
                         (statusFilter === 'pending' && (transaction.status === 'pending' || transaction.status === 'pendente')) ||
                         (statusFilter === 'completed' && (transaction.status === 'completed' || transaction.status === 'pago')) ||
                         (statusFilter === 'rejected' && (transaction.status === 'rejected' || transaction.status === 'rejeitado'));
    
    const matchesSource = sourceFilter === 'all' || transaction.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'pendente':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-xs">⏳ Pendente</Badge>;
      case 'completed':
      case 'pago':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">✅ Pago</Badge>;
      case 'rejected':
      case 'rejeitado':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">❌ Rejeitado</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50 text-xs">{status}</Badge>;
    }
  };

  const getSourceIcon = (source: string) => {
    return source === 'affiliate' ? (
      <Star className="h-3 w-3 text-gold-400" />
    ) : (
      <User className="h-3 w-3 text-blue-400" />
    );
  };

  // Calcular estatísticas
  const stats = {
    pending: withdrawalTransactions.filter(t => 
      t.status === 'pending' || t.status === 'pendente'
    ).length,
    completed: withdrawalTransactions.filter(t => 
      t.status === 'completed' || t.status === 'pago'
    ).length,
    rejected: withdrawalTransactions.filter(t => 
      t.status === 'rejected' || t.status === 'rejeitado'
    ).length,
    total: withdrawalTransactions.length,
    pendingAmount: withdrawalTransactions.filter(t => 
      t.status === 'pending' || t.status === 'pendente'
    ).reduce((sum, t) => sum + t.amount, 0),
    completedAmount: withdrawalTransactions.filter(t => 
      t.status === 'completed' || t.status === 'pago'
    ).reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="space-y-4">
      {/* Estatísticas Mobile-First */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-yellow-900/20 border-yellow-700/50">
          <CardContent className="p-3">
            <div className="text-center">
              <AlertCircle className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-yellow-400 text-xs">Pendentes</p>
              <p className="text-lg font-bold text-white">{stats.pending}</p>
              <p className="text-xs text-yellow-300">{stats.pendingAmount.toFixed(0)} MT</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-900/20 border-green-700/50">
          <CardContent className="p-3">
            <div className="text-center">
              <CreditCard className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <p className="text-green-400 text-xs">Pagos</p>
              <p className="text-lg font-bold text-white">{stats.completed}</p>
              <p className="text-xs text-green-300">{stats.completedAmount.toFixed(0)} MT</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-900/20 border-red-700/50">
          <CardContent className="p-3">
            <div className="text-center">
              <CreditCard className="h-5 w-5 text-red-400 mx-auto mb-1" />
              <p className="text-red-400 text-xs">Rejeitados</p>
              <p className="text-lg font-bold text-white">{stats.rejected}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/20 border-blue-700/50">
          <CardContent className="p-3">
            <div className="text-center">
              <CreditCard className="h-5 w-5 text-blue-400 mx-auto mb-1" />
              <p className="text-blue-400 text-xs">Total</p>
              <p className="text-lg font-bold text-white">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de saques pendentes */}
      {stats.pending > 0 && (
        <Card className="bg-orange-900/20 border-orange-700/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-orange-400 font-bold text-sm">🚨 {stats.pending} Saques Aguardando!</h3>
                <p className="text-orange-300 text-xs mt-1">
                  Total de {stats.pendingAmount.toFixed(2)} MT em saques aguardando processamento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros Mobile-First */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Buscar:</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Nome, email ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="completed">Pagos</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Tipo:</label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="user">Usuários</SelectItem>
                  <SelectItem value="affiliate">Afiliados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Saques Mobile-First */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            Saques ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Nenhum saque encontrado</p>
              {searchTerm && (
                <p className="text-xs mt-2">Tente ajustar os filtros</p>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-0">
              {/* Mobile: Cards */}
              <div className="sm:hidden space-y-3">
                {filteredTransactions.map((transaction) => (
                  <Card key={transaction.id} className="bg-gray-700/50 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            transaction.source === 'affiliate' 
                              ? 'bg-gradient-to-br from-gold-400 to-gold-600' 
                              : 'bg-gradient-to-br from-blue-400 to-blue-600'
                          }`}>
                            {transaction.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{transaction.username}</div>
                            <div className="text-gray-400 text-xs">{transaction.email}</div>
                          </div>
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">Valor:</span>
                          <span className="text-gold-400 font-bold">{transaction.amount} MT</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">Tipo:</span>
                          <div className="flex items-center gap-1">
                            {getSourceIcon(transaction.source)}
                            <span className={`text-xs ${transaction.source === 'affiliate' ? 'text-gold-400' : 'text-blue-400'}`}>
                              {transaction.source === 'affiliate' ? 'Afiliado' : 'Usuário'}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">Data:</span>
                          <span className="text-gray-300 text-xs">{new Date(transaction.date).toLocaleString('pt-PT')}</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => setSelectedTransaction(transaction)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 w-full mt-3 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Processar Saque
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop: Table */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300 text-xs">Usuário</TableHead>
                      <TableHead className="text-gray-300 text-xs">Tipo</TableHead>
                      <TableHead className="text-gray-300 text-xs">Valor</TableHead>
                      <TableHead className="text-gray-300 text-xs">Status</TableHead>
                      <TableHead className="text-gray-300 text-xs">Data</TableHead>
                      <TableHead className="text-gray-300 text-xs">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-gray-700 hover:bg-gray-700/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              transaction.source === 'affiliate' 
                                ? 'bg-gradient-to-br from-gold-400 to-gold-600' 
                                : 'bg-gradient-to-br from-blue-400 to-blue-600'
                            }`}>
                              {transaction.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="text-white font-medium text-sm">{transaction.username}</div>
                              <div className="text-gray-400 text-xs">{transaction.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getSourceIcon(transaction.source)}
                            <span className={`text-xs ${transaction.source === 'affiliate' ? 'text-gold-400' : 'text-blue-400'}`}>
                              {transaction.source === 'affiliate' ? 'Afiliado' : 'Usuário'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gold-400 font-bold">{transaction.amount} MT</span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm">
                          {new Date(transaction.date).toLocaleString('pt-PT')}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => setSelectedTransaction(transaction)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Processar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Processamento */}
      {selectedTransaction && (
        <ProcessWithdrawalModal
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onUpdate={onUpdateTransaction}
        />
      )}
    </div>
  );
};

export default WithdrawalsManagement;
