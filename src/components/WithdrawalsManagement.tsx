
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search, Filter, CreditCard, Star, User } from "lucide-react";
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
  const withdrawalTransactions = transactions.filter(t => t.type === 'withdrawal');

  console.log('🔍 Total de saques encontrados:', withdrawalTransactions.length);
  console.log('📊 Detalhes dos saques:', withdrawalTransactions.map(t => ({
    id: t.id,
    username: t.username,
    amount: t.amount,
    status: t.status,
    source: t.source,
    date: t.date
  })));

  // Aplicar filtros
  const filteredTransactions = withdrawalTransactions.filter(transaction => {
    const matchesSearch = transaction.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || transaction.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'pendente':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">⏳ Pendente</Badge>;
      case 'completed':
      case 'pago':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">✅ Pago</Badge>;
      case 'rejected':
      case 'rejeitado':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">❌ Rejeitado</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">{status}</Badge>;
    }
  };

  const getSourceIcon = (source: string) => {
    return source === 'affiliate' ? (
      <Star className="h-4 w-4 text-gold-400" />
    ) : (
      <User className="h-4 w-4 text-blue-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-yellow-900/20 border-yellow-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm">Pendentes</p>
                <p className="text-2xl font-bold text-white">
                  {withdrawalTransactions.filter(t => t.status === 'pending' || t.status === 'pendente').length}
                </p>
              </div>
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <CreditCard className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-900/20 border-green-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm">Pagos</p>
                <p className="text-2xl font-bold text-white">
                  {withdrawalTransactions.filter(t => t.status === 'completed' || t.status === 'pago').length}
                </p>
              </div>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-900/20 border-red-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm">Rejeitados</p>
                <p className="text-2xl font-bold text-white">
                  {withdrawalTransactions.filter(t => t.status === 'rejected' || t.status === 'rejeitado').length}
                </p>
              </div>
              <div className="bg-red-500/20 p-2 rounded-lg">
                <CreditCard className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/20 border-blue-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{withdrawalTransactions.length}</p>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Buscar por usuário/ID:</label>
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

            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">Todos os Status</SelectItem>
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
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="user">Saques de Usuários</SelectItem>
                  <SelectItem value="affiliate">Saques de Afiliados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Saques */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Todos os Saques da Plataforma ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum saque encontrado com os filtros aplicados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Usuário</TableHead>
                    <TableHead className="text-gray-300">Tipo</TableHead>
                    <TableHead className="text-gray-300">Valor</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
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
                            <div className="text-white font-medium">{transaction.username}</div>
                            <div className="text-gray-400 text-xs">{transaction.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSourceIcon(transaction.source)}
                          <span className={transaction.source === 'affiliate' ? 'text-gold-400' : 'text-blue-400'}>
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
                      <TableCell className="text-gray-300">
                        {transaction.date}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => setSelectedTransaction(transaction)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
