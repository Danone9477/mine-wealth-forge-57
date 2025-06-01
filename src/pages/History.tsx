
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

const History = () => {
  const { userData } = useAuth();

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  const transactions = userData.transactions || [];
  const totalDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdraws = transactions.filter(t => t.type === 'withdraw' && t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const totalTasks = transactions.filter(t => t.type === 'task').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-600 text-white',
      failed: 'bg-red-600 text-white',
      pending: 'bg-yellow-600 text-white'
    };
    
    const labels = {
      success: 'Sucesso',
      failed: 'Falhou',
      pending: 'Pendente'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Histórico de Transações
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Acompanhe todas as suas atividades financeiras
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-medium">Total Depositado</p>
                  <p className="text-2xl font-bold text-white">{totalDeposits} MT</p>
                </div>
                <ArrowDown className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-400 font-medium">Total Sacado</p>
                  <p className="text-2xl font-bold text-white">{totalWithdraws} MT</p>
                </div>
                <ArrowUp className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 font-medium">Tarefas Concluídas</p>
                  <p className="text-2xl font-bold text-white">{totalTasks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold-900/50 to-gold-800/50 border-gold-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold-400 font-medium">Saldo Atual</p>
                  <p className="text-2xl font-bold text-white">{userData.balance} MT</p>
                </div>
                <TrendingUp className="h-8 w-8 text-gold-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Todas as Transações</CardTitle>
            <CardDescription className="text-gray-400">
              Histórico completo das suas atividades
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma transação ainda</h3>
                <p className="text-gray-500 mb-6">Comece fazendo um depósito ou completando tarefas diárias</p>
                <div className="flex gap-4 justify-center">
                  <a href="/deposit" className="bg-gradient-gold text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gold-500">
                    Fazer Depósito
                  </a>
                  <a href="/dashboard" className="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600">
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
                      <TableHead className="text-gray-300">Data</TableHead>
                      <TableHead className="text-gray-300">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice().reverse().map((transaction, index) => (
                      <TableRow key={transaction.id || index} className="border-gray-700 hover:bg-gray-700/50">
                        <TableCell className="flex items-center gap-2">
                          {getTypeIcon(transaction.type)}
                          <span className="text-gray-300 capitalize">
                            {transaction.type === 'deposit' ? 'Depósito' :
                             transaction.type === 'withdraw' ? 'Saque' :
                             transaction.type === 'task' ? 'Tarefa' : transaction.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {transaction.description}
                        </TableCell>
                        <TableCell className={`font-semibold ${
                          transaction.type === 'deposit' ? 'text-green-400' :
                          transaction.type === 'withdraw' ? 'text-red-400' :
                          'text-blue-400'
                        }`}>
                          {transaction.type === 'withdraw' ? '-' : '+'}
                          {transaction.amount} MT
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(transaction.status)}
                            {getStatusBadge(transaction.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {transaction.phone && `Tel: ${transaction.phone}`}
                          {transaction.name && ` | ${transaction.name}`}
                          {transaction.method && ` | ${transaction.method.toUpperCase()}`}
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
