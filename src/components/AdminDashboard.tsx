import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, User, Mail, Copy, AlertCircle, DollarSign, Edit, Users, TrendingUp, Pickaxe, Target, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import WithdrawalsManagement from './WithdrawalsManagement';
import EditUserBalanceModal from './EditUserBalanceModal';
import ManualDepositModal from './ManualDepositModal';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [manualDepositModalOpen, setManualDepositModalOpen] = useState(false);
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

      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const usersData = [];
      const allTransactions = [];

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        
        // Calcular estatísticas de afiliado
        const affiliateStats = userData.affiliateStats || {};
        const miners = userData.miners || [];
        const activeMinerCount = miners.filter(miner => {
          const expiryDate = new Date(miner.expiryDate);
          return expiryDate > new Date() && (miner.isActive || miner.active);
        }).length;
        
        const totalMinerEarnings = miners.reduce((sum, miner) => {
          return sum + (miner.totalEarned || 0);
        }, 0);

        const dailyMinerEarnings = miners.filter(miner => {
          const expiryDate = new Date(miner.expiryDate);
          return expiryDate > new Date() && (miner.isActive || miner.active);
        }).reduce((sum, miner) => {
          return sum + (miner.dailyReturn || 0);
        }, 0);

        const userInfo = {
          id: doc.id,
          username: userData.username || 'N/A',
          email: userData.email || 'N/A',
          createdAt: userData.createdAt || new Date().toISOString().split('T')[0],
          balance: userData.balance || 0,
          totalEarnings: userData.totalEarnings || 0,
          monthlyEarnings: userData.monthlyEarnings || 0,
          affiliateBalance: userData.affiliateBalance || 0,
          phone: userData.phone || 'N/A',
          referredBy: userData.referredBy || null,
          affiliateCode: userData.affiliateCode || 'N/A',
          
          // Estatísticas de mineração
          miners: miners.length,
          activeMiners: activeMinerCount,
          totalMinerEarnings,
          dailyMinerEarnings,
          
          // Estatísticas de afiliado
          totalInvited: affiliateStats.totalInvited || 0,
          activeReferralsCount: affiliateStats.activeReferralsCount || 0,
          totalCommissions: affiliateStats.totalCommissions || 0,
          monthlyCommissions: affiliateStats.monthlyCommissions || 0,
          totalClicks: affiliateStats.totalClicks || 0,
          todayClicks: affiliateStats.todayClicks || 0,
          
          // Transações
          transactionCount: (userData.transactions || []).length,
          withdrawalCount: (userData.transactions || []).filter(t => t.type === 'withdrawal').length,
          depositCount: (userData.transactions || []).filter(t => t.type === 'deposit').length,
          
          // Dados completos para modal
          fullData: userData
        };
        
        usersData.push(userInfo);

        if (userData.transactions && Array.isArray(userData.transactions)) {
          userData.transactions.forEach(transaction => {
            const transactionWithId = {
              ...transaction,
              id: transaction.id || `${doc.id}_${Date.now()}_${Math.random()}`,
              userId: doc.id,
              username: userData.username,
              email: userData.email,
              phone: transaction.phone || userData.phone || 'N/A',
              method: transaction.method || 'M-Pesa',
              source: transaction.source || 'user',
              pixKey: transaction.pixKey || transaction.phone || userData.phone || 'N/A',
              address: transaction.address || 'N/A',
              status: transaction.status || 'pending'
            };
            allTransactions.push(transactionWithId);
          });
        }
      });

      console.log('👥 Usuários encontrados:', usersData.length);
      console.log('💰 Transações encontradas:', allTransactions.length);
      
      const withdrawals = allTransactions.filter(t => t.type === 'withdrawal');
      const pendingWithdrawals = withdrawals.filter(t => 
        t.status === 'pending' || t.status === 'pendente'
      );
      
      console.log('💸 Total de saques:', withdrawals.length);
      console.log('⏳ Saques pendentes:', pendingWithdrawals.length);

      setUsers(usersData);
      setTransactions(allTransactions);
      
      toast({
        title: "✅ Dados carregados!",
        description: `${usersData.length} usuários, ${allTransactions.length} transações, ${pendingWithdrawals.length} saques pendentes`,
      });

    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Verifique a conexão com o Firebase.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserBalance = async (userId: string, newBalance: number) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { balance: newBalance });
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, balance: newBalance } : user
      ));
      
      toast({
        title: "✅ Saldo atualizado!",
        description: `Novo saldo: ${newBalance} MT`,
      });
      
      setEditUserModalOpen(false);
    } catch (error) {
      console.error('❌ Erro ao atualizar saldo:', error);
      toast({
        title: "Erro ao atualizar saldo",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTransaction = async (transactionId: string, status: string, notes?: string) => {
    setIsUpdating(true);
    try {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }

      const userRef = doc(db, 'users', transaction.userId);
      
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

      const updatedTransactions = targetUserData.transactions.map(t => 
        t.id === transactionId 
          ? { ...t, status, notes: notes || t.notes, updatedAt: new Date().toISOString() }
          : t
      );

      await updateDoc(userRef, {
        transactions: updatedTransactions
      });

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
        title: "✅ Saque processado!",
        description: `Status: ${statusText}`,
      });
      
    } catch (error) {
      console.error('❌ Erro ao atualizar transação:', error);
      toast({
        title: "Erro ao processar saque",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManualDeposit = async (email: string, amount: number, description: string) => {
    try {
      console.log('Processando depósito manual:', { email, amount, description });

      // Buscar usuário pelo email
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('email', '==', email));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        throw new Error('Usuário não encontrado com este email');
      }

      let userData = null;
      let userId = null;

      userSnapshot.forEach((doc) => {
        userData = doc.data();
        userId = doc.id;
      });

      if (!userData || !userId) {
        throw new Error('Dados do usuário não encontrados');
      }

      // Criar transação
      const transaction = {
        id: `manual_${Date.now()}`,
        type: 'deposit' as const,
        amount: amount,
        status: 'completed' as const,
        date: new Date().toISOString(),
        description: `Depósito Manual: ${description}`,
        paymentMethod: 'manual',
        source: 'admin',
        processedBy: user?.email || 'admin'
      };

      // Atualizar saldo e histórico
      const newBalance = (userData.balance || 0) + amount;
      const updatedTransactions = [...(userData.transactions || []), transaction];

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        balance: newBalance,
        transactions: updatedTransactions
      });

      // Atualizar estado local
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              balance: newBalance,
              transactionCount: updatedTransactions.length,
              depositCount: updatedTransactions.filter(t => t.type === 'deposit').length
            }
          : user
      ));

      setTransactions(prev => [...prev, {
        ...transaction,
        userId,
        username: userData.username,
        email: userData.email
      }]);

      console.log('Depósito manual processado com sucesso');

    } catch (error) {
      console.error('Erro no depósito manual:', error);
      throw error;
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const withdrawalStats = {
    total: transactions.filter(t => t.type === 'withdrawal').length,
    pending: transactions.filter(t => t.type === 'withdrawal' && (t.status === 'pending' || t.status === 'pendente')).length,
    completed: transactions.filter(t => t.type === 'withdrawal' && (t.status === 'completed' || t.status === 'pago')).length,
    rejected: transactions.filter(t => t.type === 'withdrawal' && (t.status === 'rejected' || t.status === 'rejeitado')).length
  };

  // Calcular estatísticas gerais
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const totalEarnings = users.reduce((sum, user) => sum + user.totalEarnings, 0);
  const totalMiners = users.reduce((sum, user) => sum + user.miners, 0);
  const totalActiveMiners = users.reduce((sum, user) => sum + user.activeMiners, 0);
  const totalInvites = users.reduce((sum, user) => sum + user.totalInvited, 0);
  const totalCommissions = users.reduce((sum, user) => sum + user.totalCommissions, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
            <p className="text-white">Carregando dados do Firebase...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6">
      {/* Header Mobile-First */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gold-500">🏛️ Admin Panel Completo</h1>
            <p className="text-gray-400 text-sm">Todos os dados dos usuários e afiliados em tempo real</p>
            <p className="text-xs text-green-400 mt-1">✅ Firebase Conectado • {users.length} usuários</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={() => setManualDepositModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-xs"
            >
              💰 Depósito Manual
            </Button>
            <Button variant="outline" onClick={fetchRealData} disabled={loading} className="text-xs">
              🔄 Atualizar
            </Button>
            <Button variant="destructive" onClick={() => { logout(); navigate('/login'); }} className="text-xs">
              🚪 Sair
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700 grid grid-cols-3 sm:grid-cols-5 h-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 text-xs px-2 py-2">
            📊 Resumo
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-gray-700 text-xs px-2 py-2">
            👥 Usuários ({users.length})
          </TabsTrigger>
          <TabsTrigger value="affiliates" className="data-[state=active]:bg-gray-700 text-xs px-2 py-2">
            🤝 Afiliados
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="data-[state=active]:bg-gray-700 text-xs px-2 py-2">
            💰 Saques ({withdrawalStats.pending})
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-gray-700 text-xs px-2 py-2">
            🔄 Transações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <Card className="bg-blue-900/30 border-blue-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <User className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-400 text-xs font-medium">Usuários</p>
                  <p className="text-xl font-bold text-white">{users.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-900/30 border-green-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <DollarSign className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 text-xs font-medium">Saldo Total</p>
                  <p className="text-lg font-bold text-white">{totalBalance.toFixed(0)} MT</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/30 border-purple-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-400 text-xs font-medium">Ganhos Total</p>
                  <p className="text-lg font-bold text-white">{totalEarnings.toFixed(0)} MT</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-indigo-900/30 border-indigo-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <Pickaxe className="h-6 w-6 text-indigo-400 mx-auto mb-2" />
                  <p className="text-indigo-400 text-xs font-medium">Mineradores</p>
                  <p className="text-lg font-bold text-white">{totalActiveMiners}/{totalMiners}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-900/30 border-yellow-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <AlertCircle className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-yellow-400 text-xs font-medium">Pendentes</p>
                  <p className="text-xl font-bold text-white">{withdrawalStats.pending}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-pink-900/30 border-pink-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <Users className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                  <p className="text-pink-400 text-xs font-medium">Convites</p>
                  <p className="text-xl font-bold text-white">{totalInvites}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerta de saques pendentes */}
          {withdrawalStats.pending > 0 && (
            <Card className="bg-orange-900/20 border-orange-700/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-orange-400 font-bold text-sm">⚠️ {withdrawalStats.pending} Saques Pendentes!</h3>
                    <p className="text-orange-300 text-xs mt-1">
                      Acesse "Saques" para processá-los.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Todos os Usuários ({users.length})</CardTitle>
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
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Usuário</TableHead>
                      <TableHead className="text-xs">Saldos</TableHead>
                      <TableHead className="text-xs">Mineradores</TableHead>
                      <TableHead className="text-xs">Transações</TableHead>
                      <TableHead className="text-xs">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id} className="hover:bg-gray-700/50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{user.username}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                            {user.referredBy && (
                              <div className="text-xs text-purple-400">Referido por: {user.referredBy}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-gold-400 font-bold text-sm">{user.balance.toFixed(0)} MT</div>
                            <div className="text-xs text-green-400">Ganhos: {user.totalEarnings.toFixed(0)} MT</div>
                            <div className="text-xs text-blue-400">Afiliado: {user.affiliateBalance.toFixed(0)} MT</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{user.activeMiners}/{user.miners}</div>
                            <div className="text-xs text-gray-400">Ganho diário: {user.dailyMinerEarnings.toFixed(0)} MT</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{user.transactionCount} total</div>
                            <div className="text-xs text-green-400">{user.depositCount} depósitos</div>
                            <div className="text-xs text-red-400">{user.withdrawalCount} saques</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsModalOpen(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-xs h-7"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setEditUserModalOpen(true);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-xs h-7"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Estatísticas de Afiliados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Afiliado</TableHead>
                      <TableHead className="text-xs">Código</TableHead>
                      <TableHead className="text-xs">Convidados</TableHead>
                      <TableHead className="text-xs">Ativos</TableHead>
                      <TableHead className="text-xs">Comissões</TableHead>
                      <TableHead className="text-xs">Cliques</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(user => user.totalInvited > 0 || user.totalCommissions > 0).map(user => (
                      <TableRow key={user.id} className="hover:bg-gray-700/50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{user.username}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-gray-700 px-2 py-1 rounded">{user.affiliateCode}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                navigator.clipboard.writeText(user.affiliateCode);
                                toast({
                                  title: "Código copiado!",
                                  description: "Código do afiliado copiado para a área de transferência",
                                });
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-purple-400 font-bold">{user.totalInvited}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-green-400 font-bold">{user.activeReferralsCount}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-gold-400 font-bold text-sm">{user.totalCommissions.toFixed(0)} MT</div>
                            <div className="text-xs text-gray-400">Mensal: {user.monthlyCommissions.toFixed(0)} MT</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{user.totalClicks} total</div>
                            <div className="text-xs text-blue-400">Hoje: {user.todayClicks}</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
              <CardTitle className="text-lg">Todas as Transações ({transactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Usuário</TableHead>
                      <TableHead className="text-xs">Tipo</TableHead>
                      <TableHead className="text-xs">Valor</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 100).map(transaction => (
                      <TableRow key={transaction.id} className="hover:bg-gray-700/50">
                        <TableCell className="text-sm">{transaction.username}</TableCell>
                        <TableCell>
                          <Badge className={
                            transaction.type === 'withdrawal' ? 'bg-red-500/20 text-red-400' :
                            transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400' :
                            transaction.type === 'mining' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          }>
                            {transaction.type === 'withdrawal' ? 'Saque' : 
                             transaction.type === 'deposit' ? 'Depósito' :
                             transaction.type === 'mining' ? 'Mineração' : 'Tarefa'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gold-400 font-bold text-sm">{transaction.amount} MT</TableCell>
                        <TableCell>
                          <Badge className={
                            transaction.status === 'completed' || transaction.status === 'pago' || transaction.status === 'success'
                              ? 'bg-green-500/20 text-green-400' 
                              : transaction.status === 'pending' || transaction.status === 'pendente'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }>
                            {transaction.status === 'completed' || transaction.status === 'pago' || transaction.status === 'success' ? 'Sucesso' 
                             : transaction.status === 'pending' || transaction.status === 'pendente' ? 'Pendente'
                             : transaction.status === 'failed' ? 'Falhou'
                             : 'Rejeitado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(transaction.date).toLocaleDateString('pt-PT')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de detalhes completos do usuário */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes Completos do Usuário</DialogTitle>
            <DialogDescription className="text-gray-400">
              Todas as informações disponíveis sobre {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <Card className="bg-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Username</p>
                    <p className="text-white font-bold">{selectedUser.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Telefone</p>
                    <p className="text-white">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Data de Registro</p>
                    <p className="text-white">{selectedUser.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Referido por</p>
                    <p className="text-white">{selectedUser.referredBy || 'Registro direto'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Código de Afiliado</p>
                    <p className="text-white font-mono">{selectedUser.affiliateCode}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Saldos e Ganhos */}
              <Card className="bg-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Saldos e Ganhos
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-gold-400 text-2xl font-bold">{selectedUser.balance.toFixed(2)} MT</p>
                    <p className="text-gray-400 text-sm">Saldo Atual</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 text-2xl font-bold">{selectedUser.totalEarnings.toFixed(2)} MT</p>
                    <p className="text-gray-400 text-sm">Ganhos Totais</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-400 text-2xl font-bold">{selectedUser.affiliateBalance.toFixed(2)} MT</p>
                    <p className="text-gray-400 text-sm">Saldo Afiliado</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-400 text-xl font-bold">{selectedUser.monthlyEarnings.toFixed(2)} MT</p>
                    <p className="text-gray-400 text-sm">Ganhos Mensais</p>
                  </div>
                  <div className="text-center">
                    <p className="text-orange-400 text-xl font-bold">{selectedUser.totalMinerEarnings.toFixed(2)} MT</p>
                    <p className="text-gray-400 text-sm">Ganhos Mineração</p>
                  </div>
                  <div className="text-center">
                    <p className="text-pink-400 text-xl font-bold">{selectedUser.dailyMinerEarnings.toFixed(2)} MT</p>
                    <p className="text-gray-400 text-sm">Ganho Diário</p>
                  </div>
                </CardContent>
              </Card>

              {/* Mineradores */}
              <Card className="bg-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Pickaxe className="h-5 w-5" />
                    Mineradores
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-blue-400 text-xl font-bold">{selectedUser.miners}</p>
                    <p className="text-gray-400 text-sm">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 text-xl font-bold">{selectedUser.activeMiners}</p>
                    <p className="text-gray-400 text-sm">Ativos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gold-400 text-xl font-bold">{selectedUser.dailyMinerEarnings.toFixed(0)} MT</p>
                    <p className="text-gray-400 text-sm">Ganho Diário</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-400 text-xl font-bold">{(selectedUser.dailyMinerEarnings * 30).toFixed(0)} MT</p>
                    <p className="text-gray-400 text-sm">Potencial Mensal</p>
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas de Afiliado */}
              <Card className="bg-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Programa de Afiliados
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-purple-400 text-xl font-bold">{selectedUser.totalInvited}</p>
                    <p className="text-gray-400 text-sm">Pessoas Convidadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 text-xl font-bold">{selectedUser.activeReferralsCount}</p>
                    <p className="text-gray-400 text-sm">Referidos Ativos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gold-400 text-xl font-bold">{selectedUser.totalCommissions.toFixed(0)} MT</p>
                    <p className="text-gray-400 text-sm">Comissões Totais</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-400 text-xl font-bold">{selectedUser.totalClicks}</p>
                    <p className="text-gray-400 text-sm">Cliques no Link</p>
                  </div>
                  <div className="text-center">
                    <p className="text-cyan-400 text-xl font-bold">{selectedUser.todayClicks}</p>
                    <p className="text-gray-400 text-sm">Cliques Hoje</p>
                  </div>
                  <div className="text-center">
                    <p className="text-yellow-400 text-xl font-bold">{selectedUser.monthlyCommissions.toFixed(0)} MT</p>
                    <p className="text-gray-400 text-sm">Comissões Mensais</p>
                  </div>
                </CardContent>
              </Card>

              {/* Resumo de Transações */}
              <Card className="bg-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Atividade Financeira
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-white text-xl font-bold">{selectedUser.transactionCount}</p>
                    <p className="text-gray-400 text-sm">Total Transações</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 text-xl font-bold">{selectedUser.depositCount}</p>
                    <p className="text-gray-400 text-sm">Depósitos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-400 text-xl font-bold">{selectedUser.withdrawalCount}</p>
                    <p className="text-gray-400 text-sm">Saques</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de edição de saldo */}
      {selectedUser && (
        <EditUserBalanceModal
          user={selectedUser}
          isOpen={editUserModalOpen}
          onClose={() => setEditUserModalOpen(false)}
          onUpdateBalance={handleUpdateUserBalance}
        />
      )}

      {/* Modal de depósito manual */}
      <ManualDepositModal
        isOpen={manualDepositModalOpen}
        onClose={() => setManualDepositModalOpen(false)}
        onDeposit={handleManualDeposit}
      />
    </div>
  );
};

export default AdminDashboard;
