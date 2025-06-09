import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Clock, TrendingUp, RefreshCw } from 'lucide-react';

const History = () => {
  const { userData } = useAuth();

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  const transactions = userData.transactions || [];
  
  // Calcular corretamente todos os depósitos (incluindo manuais)
  const totalDeposits = transactions.filter(t => 
    t.type === 'deposit' && 
    (t.status === 'success' || t.status === 'completed' || t.status === 'pago')
  ).reduce((sum, t) => sum + t.amount, 0);
  
  // Calcular saques pendentes (status pending ou pendente)
  const pendingWithdraws = transactions.filter(t => 
    (t.type === 'withdraw' || t.type === 'withdrawal') && 
    (t.status === 'pending' || t.status === 'pendente')
  ).reduce((sum, t) => sum + t.amount, 0);
  
  // Calcular total sacado (apenas os aprovados/pagos)
  const totalWithdraws = transactions.filter(t => 
    (t.type === 'withdraw' || t.type === 'withdrawal') && 
    (t.status === 'success' || t.status === 'completed' || t.status === 'pago')
  ).reduce((sum, t) => sum + t.amount, 0);
  
  // Calcular ganhos de mineração e tarefas
  const totalEarnings = transactions.filter(t => 
    (t.type === 'task' || t.type === 'mining' || t.type === 'earnings') && 
    (t.status === 'success' || t.status === 'completed')
  ).reduce((sum, t) => sum + t.amount, 0);
  
  // Calcular saldo disponível corretamente
  const availableBalance = totalDeposits + totalEarnings - totalWithdraws - pendingWithdraws;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
      case 'pago':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
      case 'rejected':
      case 'rejeitado':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'pending':
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-600 text-white',
      completed: 'bg-green-600 text-white',
      pago: 'bg-green-600 text-white',
      failed: 'bg-red-600 text-white',
      rejected: 'bg-red-600 text-white',
      rejeitado: 'bg-red-600 text-white',
      pending: 'bg-yellow-600 text-white',
      pendente: 'bg-yellow-600 text-white'
    };
    
    const labels = {
      success: 'Sucesso',
      completed: 'Pago',
      pago: 'Pago',
      failed: 'Falhou',
      rejected: 'Rejeitado',
      rejeitado: 'Rejeitado',
      pending: 'Pendente',
      pendente: 'Pendente'
    };

    return (
      <Badge className={variants[status] || 'bg-gray-600 text-white'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown className="h-4 w-4 text-green-400" />;
      case 'withdraw':
      case 'withdrawal':
        return <ArrowUp className="h-4 w-4 text-red-400" />;
      case 'task':
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Histórico de Transações
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Acompanhe todas as suas atividades financeiras no Mine Wealth
          </p>
        </div>

        {/* Summary Cards - Corrigidos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-medium text-xs sm:text-sm">Total Depositado</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{totalDeposits.toFixed(2)} MT</p>
                  <p className="text-green-300 text-xs">Incluindo depósitos manuais</p>
                </div>
                <ArrowDown className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-700">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-400 font-medium text-xs sm:text-sm">Total Sacado</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{totalWithdraws.toFixed(2)} MT</p>
                  <p className="text-red-300 text-xs">Apenas saques processados</p>
                </div>
                <ArrowUp className="h-6 w-6 sm:h-8 sm:w-8 text-red-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-700">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 font-medium text-xs sm:text-sm">Saques Pendentes</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{pendingWithdraws.toFixed(2)} MT</p>
                  <p className="text-yellow-300 text-xs">Aguardando processamento</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold-900/50 to-gold-800/50 border-gold-700">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold-400 font-medium text-xs sm:text-sm">Saldo Disponível</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{availableBalance.toFixed(2)} MT</p>
                  <p className="text-gold-300 text-xs">Saldo atual calculado</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-gold-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Detalhado */}
        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50 backdrop-blur-sm mb-6">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-blue-400 font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              📊 Resumo Financeiro Detalhado
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-blue-900/20 p-3 rounded-lg">
                <p className="text-blue-300">Ganhos de Mineração:</p>
                <p className="text-white font-bold text-lg">{totalEarnings.toFixed(2)} MT</p>
              </div>
              <div className="bg-green-900/20 p-3 rounded-lg">
                <p className="text-green-300">Total de Entradas:</p>
                <p className="text-white font-bold text-lg">{(totalDeposits + totalEarnings).toFixed(2)} MT</p>
              </div>
              <div className="bg-red-900/20 p-3 rounded-lg">
                <p className="text-red-300">Total de Saídas:</p>
                <p className="text-white font-bold text-lg">{(totalWithdraws + pendingWithdraws).toFixed(2)} MT</p>
              </div>
              <div className="bg-gold-900/20 p-3 rounded-lg">
                <p className="text-gold-300">Lucro Líquido:</p>
                <p className="text-white font-bold text-lg">{(totalEarnings - totalWithdraws).toFixed(2)} MT</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerta de saques pendentes */}
        {pendingWithdraws > 0 && (
          <Card className="bg-gradient-to-r from-orange-900/30 to-orange-800/30 border-orange-700/50 backdrop-blur-sm mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-orange-400 font-semibold text-sm">⏳ Saques em Processamento</h3>
                  <p className="text-orange-300 text-xs mt-1">
                    Você tem {pendingWithdraws.toFixed(2)} MT em saques aguardando aprovação. O processamento pode levar até 24 horas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Todas as Transações</CardTitle>
            <CardDescription className="text-gray-400">
              Histórico completo das suas atividades no Mine Wealth
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <TrendingUp className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">Nenhuma transação ainda</h3>
                <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Comece fazendo um depósito ou completando tarefas diárias</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a href="/deposit" className="bg-gradient-gold text-gray-900 px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-gold-500 text-sm sm:text-base">
                    Fazer Depósito
                  </a>
                  <a href="/dashboard" className="bg-gray-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 text-sm sm:text-base">
                    Ver Dashboard
                  </a>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Tipo</TableHead>
                      <TableHead className="text-gray-300">Descrição</TableHead>
                      <TableHead className="text-gray-300">Valor</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300 hidden sm:table-cell">Data</TableHead>
                      <TableHead className="text-gray-300 hidden lg:table-cell">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice().reverse().map((transaction, index) => (
                      <TableRow key={transaction.id || index} className="border-gray-700 hover:bg-gray-700/50">
                        <TableCell className="flex items-center gap-2">
                          {getTypeIcon(transaction.type)}
                          <span className="text-gray-300 capitalize text-sm">
                            {transaction.type === 'deposit' ? 'Depósito' :
                             (transaction.type === 'withdraw' || transaction.type === 'withdrawal') ? 'Saque' :
                             transaction.type === 'task' ? 'Tarefa' : transaction.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm">
                          <div className="max-w-[150px] sm:max-w-none truncate">
                            {transaction.description}
                          </div>
                        </TableCell>
                        <TableCell className={`font-semibold text-sm ${
                          transaction.type === 'deposit' ? 'text-green-400' :
                          (transaction.type === 'withdraw' || transaction.type === 'withdrawal') ? 'text-red-400' :
                          'text-blue-400'
                        }`}>
                          {(transaction.type === 'withdraw' || transaction.type === 'withdrawal') ? '-' : '+'}
                          {transaction.amount.toFixed(2)} MT
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(transaction.status)}
                            {getStatusBadge(transaction.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm hidden sm:table-cell">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell className="text-gray-400 text-xs hidden lg:table-cell">
                          <div className="max-w-[200px]">
                            {transaction.phoneNumber && `Tel: ${transaction.phoneNumber}`}
                            {transaction.phone && `Tel: ${transaction.phone}`}
                            {transaction.paymentMethod && ` | ${transaction.paymentMethod.toUpperCase()}`}
                            {transaction.method && ` | ${transaction.method.toUpperCase()}`}
                            {transaction.transactionId && ` | ID: ${transaction.transactionId}`}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
