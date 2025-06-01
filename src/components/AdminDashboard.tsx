import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Pickaxe,
  CreditCard,
  Banknote,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  Star
} from "lucide-react";
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import EditUserModal from './EditUserModal';
import ProcessWithdrawalModal from './ProcessWithdrawalModal';

interface UserData {
  id: string;
  username?: string;
  email?: string;
  balance?: number;
  affiliateBalance?: number;
  status?: string;
  canWithdraw?: boolean;
  miners?: any[];
  createdAt?: any;
  joinDate: string;
  affiliateCode?: string;
  affiliateStats?: any;
  [key: string]: any;
}

interface TransactionData {
  id: string;
  username?: string;
  email?: string;
  type?: string;
  amount?: number;
  status?: string;
  method?: string;
  phone?: string;
  address?: string;
  pixKey?: string;
  timestamp?: any;
  date: string;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
  userId?: string;
  source?: string;
  [key: string]: any;
}

interface MinerData {
  id?: string;
  type?: string;
  isActive?: boolean;
  userId: string;
  username: string;
  [key: string]: any;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [withdrawals, setWithdrawals] = useState<TransactionData[]>([]);
  const [affiliateWithdrawals, setAffiliateWithdrawals] = useState<TransactionData[]>([]);
  const [miners, setMiners] = useState<MinerData[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeMiners: 0,
    todayRegistrations: 0,
    pendingWithdrawals: 0,
    pendingWithdrawalAmount: 0,
    totalProfit: 0,
    systemUptime: 99.9
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [withdrawalFilter, setWithdrawalFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      console.log('Carregando dados administrativos...');
      
      // Carregar usuários
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData: UserData[] = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('pt-BR') : 'N/A'
        } as UserData;
      });
      setUsers(usersData);
      console.log('Usuários carregados:', usersData.length);

      // Carregar transações - removendo orderBy para evitar erros de índice
      const transactionsSnapshot = await getDocs(collection(db, 'transactions'));
      const transactionsData: TransactionData[] = transactionsSnapshot.docs.map(doc => {
        const data = doc.data();
        const userData = usersData.find(u => u.id === data.userId);
        return {
          id: doc.id,
          ...data,
          username: userData?.username || data.username || 'N/A',
          email: userData?.email || data.email || 'N/A',
          date: data.timestamp ? new Date(data.timestamp.toDate ? data.timestamp.toDate() : data.timestamp).toLocaleString('pt-BR') : 'N/A'
        } as TransactionData;
      });
      
      // Ordenar por timestamp (mais recentes primeiro)
      transactionsData.sort((a, b) => {
        const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
        const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
        return timeB.getTime() - timeA.getTime();
      });
      
      setTransactions(transactionsData);
      console.log('Transações carregadas:', transactionsData.length);

      // Separar saques normais e de afiliados
      const allWithdrawals = transactionsData.filter(t => t.type === 'withdrawal');
      const normalWithdrawals = allWithdrawals.filter(t => !t.source || t.source === 'balance');
      const affiliateWithdrawalsData = allWithdrawals.filter(t => t.source === 'affiliate');

      setWithdrawals(normalWithdrawals);
      setAffiliateWithdrawals(affiliateWithdrawalsData);
      
      console.log('Saques normais:', normalWithdrawals.length);
      console.log('Saques de afiliados:', affiliateWithdrawalsData.length);
      console.log('Saques pendentes:', allWithdrawals.filter(w => w.status === 'pending').length);

      // Carregar mineradores
      const allMiners: MinerData[] = [];
      usersData.forEach(user => {
        if (user.miners && user.miners.length > 0) {
          user.miners.forEach(miner => {
            allMiners.push({
              ...miner,
              userId: user.id,
              username: user.username || 'N/A'
            });
          });
        }
      });
      setMiners(allMiners);

      // Calcular estatísticas
      const today = new Date().toDateString();
      const todayRegistrations = usersData.filter(user => 
        user.createdAt && new Date(user.createdAt).toDateString() === today
      ).length;

      const totalDeposits = transactionsData
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const totalWithdrawals = transactionsData
        .filter(t => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const pendingWithdrawals = allWithdrawals.filter(t => t.status === 'pending').length;
      const pendingWithdrawalAmount = allWithdrawals
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const activeMiners = allMiners.filter(m => m.isActive).length;

      setStats({
        totalUsers: usersData.length,
        totalDeposits,
        totalWithdrawals,
        activeMiners,
        todayRegistrations,
        pendingWithdrawals,
        pendingWithdrawalAmount,
        totalProfit: totalDeposits - totalWithdrawals,
        systemUptime: 99.9
      });

      console.log('Estatísticas calculadas:', {
        pendingWithdrawals,
        pendingWithdrawalAmount,
        totalWithdrawals: allWithdrawals.length
      });

    } catch (error) {
      console.error('Erro ao carregar dados do admin:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados administrativos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleProcessWithdrawal = (transaction: TransactionData) => {
    setSelectedTransaction(transaction);
    setWithdrawalModalOpen(true);
  };

  const handleUserUpdate = async (userId: string, updatedData: any) => {
    try {
      await updateDoc(doc(db, 'users', userId), updatedData);
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updatedData } : user
      ));
      
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      });
      
      setEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário",
        variant: "destructive",
      });
    }
  };

  const handleWithdrawalUpdate = async (transactionId: string, status: string, notes = '') => {
    try {
      await updateDoc(doc(db, 'transactions', transactionId), {
        status,
        notes,
        processedAt: new Date().toISOString(),
        processedBy: 'admin'
      });
      
      // Atualizar todos os estados que contêm transações
      const updateTransaction = (transaction: TransactionData) => 
        transaction.id === transactionId 
          ? { ...transaction, status, notes, processedAt: new Date().toISOString() }
          : transaction;

      setTransactions(prev => prev.map(updateTransaction));
      setWithdrawals(prev => prev.map(updateTransaction));
      setAffiliateWithdrawals(prev => prev.map(updateTransaction));
      
      toast({
        title: "Sucesso",
        description: `Saque ${status === 'completed' ? 'aprovado' : 'rejeitado'} com sucesso`,
      });
      
      setWithdrawalModalOpen(false);
      // Recarregar dados para atualizar estatísticas
      await loadAdminData();
    } catch (error) {
      console.error('Erro ao processar saque:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar saque",
        variant: "destructive",
      });
    }
  };

  const handleQuickStatusUpdate = async (transactionId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'transactions', transactionId), {
        status: newStatus,
        processedAt: new Date().toISOString(),
        processedBy: 'admin'
      });
      
      // Atualizar estado local
      const updateTransaction = (transaction: TransactionData) => 
        transaction.id === transactionId 
          ? { ...transaction, status: newStatus, processedAt: new Date().toISOString() }
          : transaction;

      setTransactions(prev => prev.map(updateTransaction));
      setWithdrawals(prev => prev.map(updateTransaction));
      setAffiliateWithdrawals(prev => prev.map(updateTransaction));
      
      toast({
        title: "Sucesso",
        description: `Saque marcado como ${newStatus === 'completed' ? 'aprovado' : 'rejeitado'}`,
      });
      
      // Recarregar dados para atualizar estatísticas
      await loadAdminData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = withdrawal.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = withdrawalFilter === 'all' || withdrawal.status === withdrawalFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredAffiliateWithdrawals = affiliateWithdrawals.filter(withdrawal => {
    const matchesSearch = withdrawal.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = withdrawalFilter === 'all' || withdrawal.status === withdrawalFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'deposit': return <CreditCard className="h-4 w-4" />;
      case 'withdrawal': return <Banknote className="h-4 w-4" />;
      case 'mining': return <Pickaxe className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-4 sm:p-6 flex items-center justify-center">
        <div className="text-white text-xl">Carregando dados administrativos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Painel Administrativo
              </h1>
              <p className="text-gray-400">
                Gerencie usuários, transações e monitorize o sistema
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300" onClick={loadAdminData}>
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar Global */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar usuários, emails, transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-400 text-sm font-medium">Usuários Totais</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-blue-300">+{stats.todayRegistrations} hoje</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-400 text-sm font-medium">Depósitos Totais</CardTitle>
                <CreditCard className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalDeposits.toFixed(0)} MT</div>
              <p className="text-xs text-green-300">Total depositado</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border-yellow-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-yellow-400 text-sm font-medium">Saques Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingWithdrawals}</div>
              <p className="text-xs text-yellow-300">Valor: {stats.pendingWithdrawalAmount.toFixed(0)} MT</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-purple-400 text-sm font-medium">Lucro Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalProfit.toFixed(0)} MT</div>
              <p className="text-xs text-purple-300">Depósitos - Saques</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 bg-gray-800 border-gray-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
              Afiliados
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
              Transações
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
              Saques ({withdrawals.filter(w => w.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="affiliate-withdrawals" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
              Saques Afiliados ({affiliateWithdrawals.filter(w => w.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="miners" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
              Mineradores
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-white">Gerenciamento de Usuários</CardTitle>
                    <CardDescription className="text-gray-400">
                      Visualize e gerencie todos os usuários da plataforma
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar usuários..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white w-full sm:w-64"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                    >
                      <option value="all">Todos</option>
                      <option value="active">Ativo</option>
                      <option value="suspended">Suspenso</option>
                      <option value="pending">Pendente</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Usuário</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium hidden sm:table-cell">Email</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Saldo</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Saldo Afiliado</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium hidden lg:table-cell">Mineradores</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium hidden lg:table-cell">Data Registro</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.filter(user => !user.affiliateCode).map((user) => (
                        <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                {user.username?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <div className="text-white font-medium">{user.username || 'N/A'}</div>
                                <div className="text-gray-400 text-xs sm:hidden">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gray-300 hidden sm:table-cell">{user.email}</td>
                          <td className="py-3 px-2 text-green-400 font-medium">{(user.balance || 0).toFixed(2)} MT</td>
                          <td className="py-3 px-2 text-gold-400 font-medium">{(user.affiliateBalance || 0).toFixed(2)} MT</td>
                          <td className="py-3 px-2 text-gray-300 hidden lg:table-cell">{user.miners?.length || 0}</td>
                          <td className="py-3 px-2 text-gray-400 hidden lg:table-cell text-xs">{user.joinDate}</td>
                          <td className="py-3 px-2">
                            <Badge className={getStatusColor(user.status || 'active')}>
                              {user.status || 'active'}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 w-7 p-0 text-blue-400 hover:bg-blue-400/20"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Star className="h-5 w-5 text-gold-400" />
                      Gerenciamento de Afiliados
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Visualize e gerencie todos os afiliados da plataforma
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Afiliado</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium hidden sm:table-cell">Email</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Código</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Saldo Geral</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Comissões</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium hidden lg:table-cell">Referidos</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium hidden lg:table-cell">Data Registro</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(user => user.affiliateCode).map((affiliate) => (
                        <tr key={affiliate.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center text-gray-900 font-semibold text-xs">
                                {affiliate.username?.charAt(0) || 'A'}
                              </div>
                              <div>
                                <div className="text-gold-400 font-medium">{affiliate.username || 'N/A'}</div>
                                <div className="text-gray-400 text-xs sm:hidden">{affiliate.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gray-300 hidden sm:table-cell">{affiliate.email}</td>
                          <td className="py-3 px-2">
                            <span className="bg-gold-400/20 text-gold-400 px-2 py-1 rounded text-xs font-mono">
                              {affiliate.affiliateCode}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-green-400 font-medium">{(affiliate.balance || 0).toFixed(2)} MT</td>
                          <td className="py-3 px-2 text-gold-400 font-medium">{(affiliate.affiliateBalance || 0).toFixed(2)} MT</td>
                          <td className="py-3 px-2 text-gray-300 hidden lg:table-cell">{affiliate.affiliateStats?.totalInvited || 0}</td>
                          <td className="py-3 px-2 text-gray-400 hidden lg:table-cell text-xs">{affiliate.joinDate}</td>
                          <td className="py-3 px-2">
                            <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/50">
                              Afiliado Ativo
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 w-7 p-0 text-gold-400 hover:bg-gold-400/20"
                                onClick={() => handleEditUser(affiliate)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Transações</CardTitle>
                <CardDescription className="text-gray-400">
                  Monitore todas as transações do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Usuário</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Tipo</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Valor</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium hidden sm:table-cell">Data</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="py-3 px-2 text-white">{transaction.username || 'N/A'}</td>
                          <td className="py-3 px-2 text-gray-300">{transaction.email}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(transaction.type)}
                              <span className="text-gray-300 capitalize">{transaction.type}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gold-400 font-medium">{transaction.amount} MT</td>
                          <td className="py-3 px-2 text-gray-400 hidden sm:table-cell">{transaction.date}</td>
                          <td className="py-3 px-2">
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-white">Saques de Usuários</CardTitle>
                    <CardDescription className="text-gray-400">
                      Processe e gerencie saques do saldo principal ({filteredWithdrawals.length} total)
                    </CardDescription>
                  </div>
                  <select
                    value={withdrawalFilter}
                    onChange={(e) => setWithdrawalFilter(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                  >
                    <option value="all">Todos ({withdrawals.length})</option>
                    <option value="pending">Pendente ({withdrawals.filter(w => w.status === 'pending').length})</option>
                    <option value="completed">Pago ({withdrawals.filter(w => w.status === 'completed').length})</option>
                    <option value="rejected">Rejeitado ({withdrawals.filter(w => w.status === 'rejected').length})</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {filteredWithdrawals.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    {withdrawalFilter === 'pending' ? 'Nenhum saque pendente encontrado' : 'Nenhum saque encontrado'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Usuário</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Dados Bancários</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Valor</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Método</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium hidden lg:table-cell">Data</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Status</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWithdrawals.map((withdrawal) => (
                          <tr key={withdrawal.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                            <td className="py-3 px-2">
                              <div>
                                <div className="text-white font-medium">{withdrawal.username || 'N/A'}</div>
                                <div className="text-gray-400 text-xs">{withdrawal.email}</div>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-gray-300">
                                  <Phone className="h-3 w-3" />
                                  <span className="text-xs">{withdrawal.phone || 'N/A'}</span>
                                </div>
                                {withdrawal.pixKey && (
                                  <div className="text-xs text-green-400">
                                    PIX: {withdrawal.pixKey}
                                  </div>
                                )}
                                {withdrawal.address && (
                                  <div className="text-xs text-blue-400">
                                    Endereço: {withdrawal.address}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gold-400 font-bold">{withdrawal.amount} MT</td>
                            <td className="py-3 px-2 text-gray-300">{withdrawal.method || 'N/A'}</td>
                            <td className="py-3 px-2 text-gray-400 hidden lg:table-cell text-xs">{withdrawal.date}</td>
                            <td className="py-3 px-2">
                              <Badge className={getStatusColor(withdrawal.status)}>
                                {withdrawal.status === 'completed' ? 'Pago' : 
                                 withdrawal.status === 'rejected' ? 'Rejeitado' : 
                                 'Pendente'}
                              </Badge>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex gap-1">
                                {withdrawal.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-7 px-2 text-green-400 hover:bg-green-400/20"
                                      onClick={() => handleQuickStatusUpdate(withdrawal.id, 'completed')}
                                      title="Marcar como pago"
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-7 px-2 text-red-400 hover:bg-red-400/20"
                                      onClick={() => handleQuickStatusUpdate(withdrawal.id, 'rejected')}
                                      title="Rejeitar saque"
                                    >
                                      <AlertCircle className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 px-2 text-blue-400 hover:bg-blue-400/20"
                                  onClick={() => handleProcessWithdrawal(withdrawal)}
                                  title="Ver detalhes"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Affiliate Withdrawals Tab */}
          <TabsContent value="affiliate-withdrawals" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Star className="h-5 w-5 text-gold-400" />
                      Saques de Afiliados
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Processe saques das comissões de afiliados ({filteredAffiliateWithdrawals.length} total)
                    </CardDescription>
                  </div>
                  <select
                    value={withdrawalFilter}
                    onChange={(e) => setWithdrawalFilter(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                  >
                    <option value="all">Todos ({affiliateWithdrawals.length})</option>
                    <option value="pending">Pendente ({affiliateWithdrawals.filter(w => w.status === 'pending').length})</option>
                    <option value="completed">Pago ({affiliateWithdrawals.filter(w => w.status === 'completed').length})</option>
                    <option value="rejected">Rejeitado ({affiliateWithdrawals.filter(w => w.status === 'rejected').length})</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {filteredAffiliateWithdrawals.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    {withdrawalFilter === 'pending' ? 'Nenhum saque de afiliado pendente encontrado' : 'Nenhum saque de afiliado encontrado'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Afiliado</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Dados Bancários</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Valor</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Método</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium hidden lg:table-cell">Data</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Status</th>
                          <th className="text-left py-3 px-2 text-gray-400 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAffiliateWithdrawals.map((withdrawal) => (
                          <tr key={withdrawal.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                            <td className="py-3 px-2">
                              <div>
                                <div className="text-gold-400 font-medium">{withdrawal.username || 'N/A'}</div>
                                <div className="text-gray-400 text-xs">{withdrawal.email}</div>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-gray-300">
                                  <Phone className="h-3 w-3" />
                                  <span className="text-xs">{withdrawal.phone || 'N/A'}</span>
                                </div>
                                {withdrawal.pixKey && (
                                  <div className="text-xs text-green-400">
                                    PIX: {withdrawal.pixKey}
                                  </div>
                                )}
                                {withdrawal.address && (
                                  <div className="text-xs text-blue-400">
                                    Endereço: {withdrawal.address}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gold-400 font-bold">{withdrawal.amount} MT</td>
                            <td className="py-3 px-2 text-gray-300">{withdrawal.method || 'N/A'}</td>
                            <td className="py-3 px-2 text-gray-400 hidden lg:table-cell text-xs">{withdrawal.date}</td>
                            <td className="py-3 px-2">
                              <Badge className={getStatusColor(withdrawal.status)}>
                                {withdrawal.status === 'completed' ? 'Pago' : 
                                 withdrawal.status === 'rejected' ? 'Rejeitado' : 
                                 'Pendente'}
                              </Badge>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex gap-1">
                                {withdrawal.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-7 px-2 text-green-400 hover:bg-green-400/20"
                                      onClick={() => handleQuickStatusUpdate(withdrawal.id, 'completed')}
                                      title="Marcar como pago"
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-7 px-2 text-red-400 hover:bg-red-400/20"
                                      onClick={() => handleQuickStatusUpdate(withdrawal.id, 'rejected')}
                                      title="Rejeitar saque"
                                    >
                                      <AlertCircle className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 px-2 text-blue-400 hover:bg-blue-400/20"
                                  onClick={() => handleProcessWithdrawal(withdrawal)}
                                  title="Ver detalhes"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Miners Tab */}
          <TabsContent value="miners" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Basic', 'Premium', 'Elite'].map((type) => {
                const typeMiners = miners.filter(m => m.type === type);
                const activeCount = typeMiners.filter(m => m.isActive).length;
                const totalCount = typeMiners.length;
                const percentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
                
                return (
                  <Card key={type} className={`bg-gradient-to-br ${
                    type === 'Basic' ? 'from-blue-900/30 to-blue-800/30 border-blue-700/50' :
                    type === 'Premium' ? 'from-gold-900/30 to-gold-800/30 border-gold-700/50' :
                    'from-red-900/30 to-red-800/30 border-red-700/50'
                  }`}>
                    <CardHeader>
                      <CardTitle className={`${
                        type === 'Basic' ? 'text-blue-400' :
                        type === 'Premium' ? 'text-gold-400' :
                        'text-red-400'
                      } flex items-center gap-2`}>
                        <Pickaxe className="h-5 w-5" />
                        {type} Miners
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-white">{activeCount}</div>
                        <div className={`text-sm ${
                          type === 'Basic' ? 'text-blue-300' :
                          type === 'Premium' ? 'text-gold-300' :
                          'text-red-300'
                        }`}>Ativos de {totalCount} total</div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              type === 'Basic' ? 'bg-blue-400' :
                              type === 'Premium' ? 'bg-gold-400' :
                              'bg-red-400'
                            }`}
                            style={{width: `${percentage}%`}}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-400">{percentage}% ativo</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modais */}
      {editModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleUserUpdate}
        />
      )}

      {withdrawalModalOpen && selectedTransaction && (
        <ProcessWithdrawalModal
          transaction={selectedTransaction}
          isOpen={withdrawalModalOpen}
          onClose={() => setWithdrawalModalOpen(false)}
          onUpdate={handleWithdrawalUpdate}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
