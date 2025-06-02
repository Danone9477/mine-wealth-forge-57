
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, User, Mail, Copy, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import WithdrawalsManagement from './WithdrawalsManagement';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchRealData();
  }, [user, navigate]);

  const fetchRealData = async () => {
    try {
      setLoading(true);
      console.log('🔥 Buscando dados reais do Firebase...');

      // Buscar todos os usuários
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const usersData = [];
      const allTransactions = [];

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        const userInfo = {
          id: doc.id,
          username: userData.username || 'N/A',
          email: userData.email || 'N/A',
          createdAt: userData.createdAt || new Date().toISOString().split('T')[0],
          balance: userData.balance || 0,
          totalEarnings: userData.totalEarnings || 0,
          affiliateBalance: userData.affiliateBalance || 0
        };
        
        usersData.push(userInfo);

        // Extrair transações do usuário
        if (userData.transactions && Array.isArray(userData.transactions)) {
          userData.transactions.forEach(transaction => {
            allTransactions.push({
              ...transaction,
              userId: doc.id,
              username: userData.username,
              email: userData.email,
              // Garantir que saques tenham as propriedades necessárias
              phone: transaction.phone || userData.phone || 'N/A',
              method: transaction.method || 'M-Pesa',
              source: transaction.source || 'user',
              pixKey: transaction.pixKey || transaction.phone || 'N/A',
              address: transaction.address || 'N/A'
            });
          });
        }
      });

      console.log('👥 Usuários encontrados:', usersData.length);
      console.log('💰 Transações encontradas:', allTransactions.length);
      
      // Filtrar apenas saques para debug
      const withdrawals = allTransactions.filter(t => t.type === 'withdrawal');
      console.log('💸 Saques encontrados:', withdrawals.length);
      console.log('📊 Detalhes dos saques:', withdrawals);

      setUsers(usersData);
      setTransactions(allTransactions);
      
      toast({
        title: "Dados carregados com sucesso! 🎉",
        description: `${usersData.length} usuários e ${allTransactions.length} transações encontradas.`,
      });

    } catch (error) {
      console.error('❌ Erro ao buscar dados do Firebase:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Verifique a conexão com o Firebase.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateTransaction = async (transactionId: string, status: string, notes?: string) => {
    setIsUpdating(true);
    try {
      console.log(`🔄 Atualizando transação ${transactionId} para status: ${status}`);

      // Encontrar a transação e o usuário
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }

      const userRef = doc(db, 'users', transaction.userId);
      
      // Buscar dados atuais do usuário
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      let targetUserData = null;
      
      usersSnapshot.forEach((doc) => {
        if (doc.id === transaction.userId) {
          targetUserData = doc.data();
        }
      });

      if (!targetUserData) {
        throw new Error('Usuário não encontrado');
      }

      // Atualizar a transação específica no array de transações
      const updatedTransactions = targetUserData.transactions.map(t => 
        t.id === transactionId 
          ? { ...t, status, notes: notes || t.notes, updatedAt: new Date().toISOString() }
          : t
      );

      // Atualizar no Firebase
      await updateDoc(userRef, {
        transactions: updatedTransactions
      });

      // Atualizar estado local
      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction.id === transactionId 
            ? { ...transaction, status, notes } 
            : transaction
        )
      );

      const statusText = status === 'completed' ? 'Pago ✅' : 
                        status === 'rejected' ? 'Rejeitado ❌' : status;

      toast({
        title: "Saque atualizado com sucesso! 🎉",
        description: `Status alterado para: ${statusText}`,
      });
      
      console.log(`✅ Saque ${transactionId} atualizado para: ${status}`);
    } catch (error) {
      console.error('❌ Erro ao atualizar transação:', error);
      toast({
        title: "Erro ao atualizar saque",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Estatísticas para o dashboard
  const withdrawalStats = {
    total: transactions.filter(t => t.type === 'withdrawal').length,
    pending: transactions.filter(t => t.type === 'withdrawal' && (t.status === 'pending' || t.status === 'pendente')).length,
    completed: transactions.filter(t => t.type === 'withdrawal' && (t.status === 'completed' || t.status === 'pago')).length,
    rejected: transactions.filter(t => t.type === 'withdrawal' && (t.status === 'rejected' || t.status === 'rejeitado')).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
            <p className="text-white">Carregando dados reais do Firebase...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gold-500">🏛️ Painel Administrativo</h1>
          <p className="text-gray-400">Gerencie todos os saques e transações da plataforma em tempo real.</p>
          <p className="text-sm text-green-400 mt-1">✅ Conectado ao Firebase - Dados Reais</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRealData} disabled={loading}>
            🔄 Atualizar Dados
          </Button>
          <Button variant="destructive" onClick={() => { logout(); navigate('/login'); }}>
            🚪 Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
            📊 Visão Geral
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-gray-700">
            👥 Usuários ({users.length})
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="data-[state=active]:bg-gray-700">
            💰 Gerenciar Saques ({withdrawalStats.total})
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-gray-700">
            🔄 Todas Transações ({transactions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-blue-900/30 border-blue-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Total de Usuários</p>
                    <p className="text-3xl font-bold text-white">{users.length}</p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <User className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-900/30 border-yellow-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-400 text-sm font-medium">Saques Pendentes</p>
                    <p className="text-3xl font-bold text-white">{withdrawalStats.pending}</p>
                  </div>
                  <div className="bg-yellow-500/20 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-900/30 border-green-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400 text-sm font-medium">Saques Pagos</p>
                    <p className="text-3xl font-bold text-white">{withdrawalStats.completed}</p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-900/30 border-red-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-400 text-sm font-medium">Saques Rejeitados</p>
                    <p className="text-3xl font-bold text-white">{withdrawalStats.rejected}</p>
                  </div>
                  <div className="bg-red-500/20 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerta para saques pendentes */}
          {withdrawalStats.pending > 0 && (
            <Card className="bg-orange-900/20 border-orange-700/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-8 w-8 text-orange-400" />
                  <div>
                    <h3 className="text-orange-400 font-bold text-lg">⚠️ Atenção: Saques Pendentes!</h3>
                    <p className="text-orange-300">
                      Existem <strong>{withdrawalStats.pending} saques pendentes</strong> aguardando sua análise. 
                      Acesse a aba "Gerenciar Saques" para processá-los.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Lista de Usuários Reais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Buscar usuário..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Total Ganhos</TableHead>
                    <TableHead>Data de Criação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id} className="hover:bg-gray-700/50">
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-gold-400 font-bold">{user.balance} MT</TableCell>
                      <TableCell className="text-green-400 font-bold">{user.totalEarnings} MT</TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals">
          <WithdrawalsManagement 
            transactions={transactions}
            onUpdateTransaction={handleUpdateTransaction}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Todas as Transações da Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(transaction => (
                    <TableRow key={transaction.id} className="hover:bg-gray-700/50">
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>{transaction.username}</TableCell>
                      <TableCell>
                        <Badge className={transaction.type === 'withdrawal' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
                          {transaction.type === 'withdrawal' ? '💸 Saque' : '💰 Depósito'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gold-400 font-bold">{transaction.amount} MT</TableCell>
                      <TableCell>
                        <Badge className={
                          transaction.status === 'completed' || transaction.status === 'pago' 
                            ? 'bg-green-500/20 text-green-400' 
                            : transaction.status === 'pending' || transaction.status === 'pendente'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }>
                          {transaction.status === 'completed' || transaction.status === 'pago' ? '✅ Concluído' 
                           : transaction.status === 'pending' || transaction.status === 'pendente' ? '⏳ Pendente'
                           : '❌ Rejeitado'}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre o usuário selecionado.
            </DialogDescription>
          </DialogHeader>

          {selectedUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-bold">Username:</span>
                <span>{selectedUser.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span className="font-bold">Email:</span>
                <span>{selectedUser.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="font-bold">Data de Criação:</span>
                <span>{selectedUser.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="font-bold">ID:</span>
                <span className="font-mono">{selectedUser.id}</span>
                <Button variant="outline" size="icon" className="ml-2" onClick={() => {
                  navigator.clipboard.writeText(selectedUser.id);
                  toast({ description: "ID copiado para a área de transferência." })
                }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <AlertCircle className="h-6 w-6 mx-auto mb-2" />
              Nenhum usuário selecionado.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
