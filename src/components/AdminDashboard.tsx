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
  Star,
  FileText,
  Calendar
} from "lucide-react";
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
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
  totalDeposited?: number;
  totalWithdrawn?: number;
  lastLogin?: string;
  phone?: string;
  address?: string;
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
  earnings?: number;
  startDate?: string;
  [key: string]: any;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [affiliates, setAffiliates] = useState<UserData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [withdrawals, setWithdrawals] = useState<TransactionData[]>([]);
  const [affiliateWithdrawals, setAffiliateWithdrawals] = useState<TransactionData[]>([]);
  const [miners, setMiners] = useState<MinerData[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAffiliates: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeMiners: 0,
    todayRegistrations: 0,
    pendingWithdrawals: 0,
    pendingWithdrawalAmount: 0,
    totalProfit: 0,
    systemUptime: 99.9,
    totalAffiliateCommissions: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [withdrawalFilter, setWithdrawalFilter] = useState('pending');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAdminData();
    const interval = setInterval(loadAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando dados administrativos...');
      
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData: UserData[] = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('pt-BR') : 'N/A',
          lastLogin: data.lastLogin ? new Date(data.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'
        } as UserData;
      });

      const regularUsers = usersData.filter(user => !user.affiliateCode);
      const affiliateUsers = usersData.filter(user => user.affiliateCode);
      
      setUsers(regularUsers);
      setAffiliates(affiliateUsers);
      console.log('👥 Usuários carregados:', regularUsers.length);
      console.log('⭐ Afiliados carregados:', affiliateUsers.length);

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
      
      transactionsData.sort((a, b) => {
        const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
        const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
        return timeB.getTime() - timeA.getTime();
      });
      
      setTransactions(transactionsData);
      console.log('💳 Transações carregadas:', transactionsData.length);

      const allWithdrawals = transactionsData.filter(t => t.type === 'withdrawal');
      const normalWithdrawals = allWithdrawals.filter(t => !t.source || t.source === 'balance');
      const affiliateWithdrawalsData = allWithdrawals.filter(t => t.source === 'affiliate');

      setWithdrawals(normalWithdrawals);
      setAffiliateWithdrawals(affiliateWithdrawalsData);
      
      console.log('💰 Saques normais:', normalWithdrawals.length);
      console.log('⭐ Saques de afiliados:', affiliateWithdrawalsData.length);
      console.log('⏳ Saques pendentes:', allWithdrawals.filter(w => w.status === 'pending').length);

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

      const totalAffiliateCommissions = affiliateUsers
        .reduce((sum, user) => sum + (user.affiliateBalance || 0), 0);

      const activeMiners = allMiners.filter(m => m.isActive).length;

      setStats({
        totalUsers: regularUsers.length,
        totalAffiliates: affiliateUsers.length,
        totalDeposits,
        totalWithdrawals,
        activeMiners,
        todayRegistrations,
        pendingWithdrawals,
        pendingWithdrawalAmount,
        totalProfit: totalDeposits - totalWithdrawals,
        systemUptime: 99.9,
        totalAffiliateCommissions
      });

    } catch (error) {
      console.error('❌ Erro ao carregar dados do admin:', error);
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
      setAffiliates(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updatedData } : user
      ));
      
      toast({
        title: "✅ Sucesso",
        description: "Usuário atualizado com sucesso",
      });
      
      setEditModalOpen(false);
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      toast({
        title: "❌ Erro",
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
      
      const updateTransaction = (transaction: TransactionData) => 
        transaction.id === transactionId 
          ? { ...transaction, status, notes, processedAt: new Date().toISOString() }
          : transaction;

      setTransactions(prev => prev.map(updateTransaction));
      setWithdrawals(prev => prev.map(updateTransaction));
      setAffiliateWithdrawals(prev => prev.map(updateTransaction));
      
      toast({
        title: "✅ Sucesso",
        description: `Saque ${status === 'completed' ? 'aprovado' : 'rejeitado'} com sucesso`,
      });
      
      setWithdrawalModalOpen(false);
      await loadAdminData();
    } catch (error) {
      console.error('❌ Erro ao processar saque:', error);
      toast({
        title: "❌ Erro",
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
      
      const updateTransaction = (transaction: TransactionData) => 
        transaction.id === transactionId 
          ? { ...transaction, status: newStatus, processedAt: new Date().toISOString() }
          : transaction;

      setTransactions(prev => prev.map(updateTransaction));
      setWithdrawals(prev => prev.map(updateTransaction));
      setAffiliateWithdrawals(prev => prev.map(updateTransaction));
      
      toast({
        title: "✅ Sucesso",
        description: `Saque ${newStatus === 'completed' ? 'aprovado' : 'rejeitado'}`,
      });
      
      await loadAdminData();
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      toast({
        title: "❌ Erro",
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

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.affiliateCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || affiliate.status === filterStatus;
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando Painel Administrativo...</div>
          <div className="text-gray-400 text-sm mt-2">Aguarde enquanto carregamos todos os dados</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Melhorado */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 flex items-center gap-3">
                <Settings className="h-8 w-8 text-gold-400" />
                Painel Administrativo
              </h1>
              <p className="text-gray-400 text-lg">
                Controle total do sistema - Usuários, Afiliados, Transações e Saques
              </p>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="text-green-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Sistema Online
                </span>
                <span className="text-gray-400">
                  Última atualização: {new Date().toLocaleTimeString('pt-BR')}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gold-400/50 text-gold-400 hover:bg-gold-400/10" 
                onClick={loadAdminData}
              >
                <Bell className="h-4 w-4 mr-2" />
                Atualizar Dados
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar Global Melhorada */}
        <div className="mb-6">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="🔍 Pesquisar usuários, emails, transações, afiliados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-gray-700/50 border-gray-600 text-white text-lg rounded-xl focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
            />
          </div>
        </div>

        {/* Stats Grid Melhorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-700/50 hover:border-blue-600/70 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-400 text-sm font-medium">Usuários Ativos</CardTitle>
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-blue-300">+{stats.todayRegistrations} hoje</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold-900/40 to-gold-800/40 border-gold-700/50 hover:border-gold-600/70 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gold-400 text-sm font-medium">Afiliados</CardTitle>
                <Star className="h-5 w-5 text-gold-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalAffiliates.toLocaleString()}</div>
              <p className="text-xs text-gold-300">{stats.totalAffiliateCommissions.toFixed(0)} MT comissões</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-700/50 hover:border-green-600/70 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-400 text-sm font-medium">Receita Total</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalDeposits.toFixed(0)} MT</div>
              <p className="text-xs text-green-300">Lucro: {stats.totalProfit.toFixed(0)} MT</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/40 to-red-800/40 border-red-700/50 hover:border-red-600/70 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-red-400 text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Saques Pendentes
                </CardTitle>
                <AlertCircle className="h-5 w-5 text-red-400 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.pendingWithdrawals}</div>
              <p className="text-xs text-red-300">Valor: {stats.pendingWithdrawalAmount.toFixed(0)} MT</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Principais */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-gray-800/70 border-gray-700 p-1 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900 rounded-lg transition-all"
            >
              📊 Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900 rounded-lg transition-all"
            >
              👥 Usuários ({users.length})
            </TabsTrigger>
            <TabsTrigger 
              value="affiliates" 
              className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900 rounded-lg transition-all"
            >
              ⭐ Afiliados ({affiliates.length})
            </TabsTrigger>
            <TabsTrigger 
              value="withdrawals" 
              className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900 rounded-lg transition-all relative"
            >
              💰 Saques ({withdrawals.filter(w => w.status === 'pending').length})
              {withdrawals.filter(w => w.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="affiliate-withdrawals" 
              className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900 rounded-lg transition-all relative"
            >
              🌟 Saques Afiliados ({affiliateWithdrawals.filter(w => w.status === 'pending').length})
              {affiliateWithdrawals.filter(w => w.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900 rounded-lg transition-all"
            >
              📋 Transações
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Atividade Recente */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-400" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(transaction.type)}
                          <div>
                            <div className="text-white text-sm font-medium">{transaction.username}</div>
                            <div className="text-gray-400 text-xs">{transaction.type} - {transaction.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gold-400 font-bold">{transaction.amount} MT</div>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Saques Urgentes */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-400 animate-pulse" />
                    Saques Pendentes (Ação Necessária)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {[...withdrawals, ...affiliateWithdrawals]
                      .filter(w => w.status === 'pending')
                      .slice(0, 8)
                      .map((withdrawal) => (
                      <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-400/20 rounded-full flex items-center justify-center">
                            <Banknote className="h-4 w-4 text-red-400" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">
                              {withdrawal.username}
                              {withdrawal.source === 'affiliate' && <span className="text-gold-400 ml-1">⭐</span>}
                            </div>
                            <div className="text-gray-400 text-xs">{withdrawal.date}</div>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <div className="text-gold-400 font-bold">{withdrawal.amount} MT</div>
                            <div className="text-xs text-gray-400">{withdrawal.phone}</div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gold-400/50 text-gold-400 hover:bg-gold-400/10"
                            onClick={() => handleProcessWithdrawal(withdrawal)}
                          >
                            Processar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-white text-xl">👥 Gerenciamento de Usuários</CardTitle>
                    <CardDescription className="text-gray-400">
                      Visualize e edite todos os dados dos usuários da plataforma
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      <option value="all">Todos os Status</option>
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
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Usuário</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium hidden lg:table-cell">Contato</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Saldo Principal</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Saldo Afiliado</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium hidden xl:table-cell">Mineradores</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium hidden xl:table-cell">Registrado</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <div className="text-white font-medium">{user.username || 'N/A'}</div>
                                <div className="text-gray-400 text-xs lg:hidden">{user.email}</div>
                                <div className="text-gray-500 text-xs">ID: {user.id.slice(-8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-3 hidden lg:table-cell">
                            <div>
                              <div className="text-gray-300">{user.email}</div>
                              {user.phone && <div className="text-gray-400 text-xs">{user.phone}</div>}
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="text-green-400 font-bold text-lg">{(user.balance || 0).toFixed(2)} MT</div>
                            <div className="text-gray-400 text-xs">Principal</div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="text-gold-400 font-bold text-lg">{(user.affiliateBalance || 0).toFixed(2)} MT</div>
                            <div className="text-gray-400 text-xs">Comissões</div>
                          </td>
                          <td className="py-4 px-3 hidden xl:table-cell">
                            <div className="text-white font-medium">{user.miners?.length || 0}</div>
                            <div className="text-gray-400 text-xs">Mineradores</div>
                          </td>
                          <td className="py-4 px-3 hidden xl:table-cell">
                            <div className="text-gray-300">{user.joinDate}</div>
                            <div className="text-gray-400 text-xs">Último login: {user.lastLogin}</div>
                          </td>
                          <td className="py-4 px-3">
                            <Badge className={getStatusColor(user.status || 'active')}>
                              {user.status || 'active'}
                            </Badge>
                          </td>
                          <td className="py-4 px-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
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
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Star className="h-6 w-6 text-gold-400" />
                      ⭐ Gerenciamento de Afiliados
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Controle total dos afiliados e suas comissões
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Afiliado</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium hidden lg:table-cell">Contato</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Código</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Saldo Geral</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Comissões</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium hidden xl:table-cell">Referidos</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium hidden xl:table-cell">Registrado</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAffiliates.map((affiliate) => (
                        <tr key={affiliate.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-gray-900 font-semibold">
                                {affiliate.username?.charAt(0).toUpperCase() || 'A'}
                              </div>
                              <div>
                                <div className="text-gold-400 font-medium flex items-center gap-1">
                                  {affiliate.username || 'N/A'}
                                  <Star className="h-3 w-3" />
                                </div>
                                <div className="text-gray-400 text-xs lg:hidden">{affiliate.email}</div>
                                <div className="text-gray-500 text-xs">ID: {affiliate.id.slice(-8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-3 hidden lg:table-cell">
                            <div>
                              <div className="text-gray-300">{affiliate.email}</div>
                              {affiliate.phone && <div className="text-gray-400 text-xs">{affiliate.phone}</div>}
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <span className="bg-gold-400/20 text-gold-400 px-3 py-1 rounded-full text-xs font-mono font-bold">
                              {affiliate.affiliateCode}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <div className="text-green-400 font-bold text-lg">{(affiliate.balance || 0).toFixed(2)} MT</div>
                            <div className="text-gray-400 text-xs">Principal</div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="text-gold-400 font-bold text-lg">{(affiliate.affiliateBalance || 0).toFixed(2)} MT</div>
                            <div className="text-gray-400 text-xs">Comissões</div>
                          </td>
                          <td className="py-4 px-3 hidden xl:table-cell">
                            <div className="text-white font-medium">{affiliate.affiliateStats?.totalInvited || 0}</div>
                            <div className="text-gray-400 text-xs">Referidos</div>
                          </td>
                          <td className="py-4 px-3 hidden xl:table-cell">
                            <div className="text-gray-300">{affiliate.joinDate}</div>
                            <div className="text-gray-400 text-xs">Último login: {affiliate.lastLogin}</div>
                          </td>
                          <td className="py-4 px-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-gold-400/50 text-gold-400 hover:bg-gold-400/10"
                              onClick={() => handleEditUser(affiliate)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
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
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Banknote className="h-6 w-6 text-green-400" />
                      💰 Saques de Usuários
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Gerencie todos os saques do saldo principal ({filteredWithdrawals.length} total)
                    </CardDescription>
                  </div>
                  <select
                    value={withdrawalFilter}
                    onChange={(e) => setWithdrawalFilter(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="all">Todos ({withdrawals.length})</option>
                    <option value="pending">🔄 Pendente ({withdrawals.filter(w => w.status === 'pending').length})</option>
                    <option value="completed">✅ Pago ({withdrawals.filter(w => w.status === 'completed').length})</option>
                    <option value="rejected">❌ Rejeitado ({withdrawals.filter(w => w.status === 'rejected').length})</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {filteredWithdrawals.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Banknote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <div className="text-lg">
                      {withdrawalFilter === 'pending' ? 'Nenhum saque pendente encontrado' : 'Nenhum saque encontrado'}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-4 px-3 text-gray-400 font-medium">Usuário</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium">Dados Bancários</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium">Valor</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium hidden lg:table-cell">Método</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium hidden xl:table-cell">Data</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium">Status</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWithdrawals.map((withdrawal) => (
                          <tr key={withdrawal.id} className={`border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
                            withdrawal.status === 'pending' ? 'bg-yellow-900/10' : ''
                          }`}>
                            <td className="py-4 px-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                  {withdrawal.username?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <div className="text-white font-medium">{withdrawal.username || 'N/A'}</div>
                                  <div className="text-gray-400 text-xs">{withdrawal.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="space-y-1">
                                {withdrawal.phone && (
                                  <div className="flex items-center gap-2 text-green-400">
                                    <Phone className="h-3 w-3" />
                                    <span className="text-xs font-mono">{withdrawal.phone}</span>
                                  </div>
                                )}
                                {withdrawal.pixKey && (
                                  <div className="flex items-center gap-2 text-blue-400">
                                    <CreditCard className="h-3 w-3" />
                                    <span className="text-xs font-mono">{withdrawal.pixKey}</span>
                                  </div>
                                )}
                                {withdrawal.address && (
                                  <div className="flex items-start gap-2 text-purple-400">
                                    <MapPin className="h-3 w-3 mt-0.5" />
                                    <span className="text-xs">{withdrawal.address}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="text-gold-400 font-bold text-xl">{withdrawal.amount} MT</div>
                            </td>
                            <td className="py-4 px-3 hidden lg:table-cell">
                              <span className="text-gray-300">{withdrawal.method || 'N/A'}</span>
                            </td>
                            <td className="py-4 px-3 hidden xl:table-cell">
                              <div className="text-gray-300">{withdrawal.date}</div>
                            </td>
                            <td className="py-4 px-3">
                              <Badge className={getStatusColor(withdrawal.status)}>
                                {withdrawal.status === 'completed' ? '✅ Pago' : 
                                 withdrawal.status === 'rejected' ? '❌ Rejeitado' : 
                                 '🔄 Pendente'}
                              </Badge>
                            </td>
                            <td className="py-4 px-3">
                              <div className="flex gap-1">
                                {withdrawal.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="bg-green-600 hover:bg-green-700 text-white px-2"
                                      onClick={() => handleQuickStatusUpdate(withdrawal.id, 'completed')}
                                      title="Marcar como pago"
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="bg-red-600 hover:bg-red-700 text-white px-2"
                                      onClick={() => handleQuickStatusUpdate(withdrawal.id, 'rejected')}
                                      title="Rejeitar saque"
                                    >
                                      <AlertCircle className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 px-2"
                                  onClick={() => handleProcessWithdrawal(withdrawal)}
                                  title="Ver detalhes completos"
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
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Star className="h-6 w-6 text-gold-400" />
                      🌟 Saques de Comissões de Afiliados
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Gerencie saques das comissões de afiliados ({filteredAffiliateWithdrawals.length} total)
                    </CardDescription>
                  </div>
                  <select
                    value={withdrawalFilter}
                    onChange={(e) => setWithdrawalFilter(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="all">Todos ({affiliateWithdrawals.length})</option>
                    <option value="pending">🔄 Pendente ({affiliateWithdrawals.filter(w => w.status === 'pending').length})</option>
                    <option value="completed">✅ Pago ({affiliateWithdrawals.filter(w => w.status === 'completed').length})</option>
                    <option value="rejected">❌ Rejeitado ({affiliateWithdrawals.filter(w => w.status === 'rejected').length})</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {filteredAffiliateWithdrawals.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <div className="text-lg">
                      {withdrawalFilter === 'pending' ? 'Nenhum saque de afiliado pendente' : 'Nenhum saque de afiliado encontrado'}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-4 px-3 text-gray-400 font-medium">Afiliado</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium">Dados Bancários</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium">Valor</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium hidden lg:table-cell">Método</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium hidden xl:table-cell">Data</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium">Status</th>
                          <th className="text-left py-4 px-3 text-gray-400 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAffiliateWithdrawals.map((withdrawal) => (
                          <tr key={withdrawal.id} className={`border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
                            withdrawal.status === 'pending' ? 'bg-gold-900/10' : ''
                          }`}>
                            <td className="py-4 px-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center text-gray-900 font-semibold text-xs">
                                  {withdrawal.username?.charAt(0) || 'A'}
                                </div>
                                <div>
                                  <div className="text-gold-400 font-medium flex items-center gap-1">
                                    {withdrawal.username || 'N/A'}
                                    <Star className="h-3 w-3" />
                                  </div>
                                  <div className="text-gray-400 text-xs">{withdrawal.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="space-y-1">
                                {withdrawal.phone && (
                                  <div className="flex items-center gap-2 text-green-400">
                                    <Phone className="h-3 w-3" />
                                    <span className="text-xs font-mono">{withdrawal.phone}</span>
                                  </div>
                                )}
                                {withdrawal.pixKey && (
                                  <div className="flex items-center gap-2 text-blue-400">
                                    <CreditCard className="h-3 w-3" />
                                    <span className="text-xs font-mono">{withdrawal.pixKey}</span>
                                  </div>
                                )}
                                {withdrawal.address && (
                                  <div className="flex items-start gap-2 text-purple-400">
                                    <MapPin className="h-3 w-3 mt-0.5" />
                                    <span className="text-xs">{withdrawal.address}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="text-gold-400 font-bold text-xl">{withdrawal.amount} MT</div>
                              <div className="text-xs text-gold-300">Comissão</div>
                            </td>
                            <td className="py-4 px-3 hidden lg:table-cell">
                              <span className="text-gray-300">{withdrawal.method || 'N/A'}</span>
                            </td>
                            <td className="py-4 px-3 hidden xl:table-cell">
                              <div className="text-gray-300">{withdrawal.date}</div>
                            </td>
                            <td className="py-4 px-3">
                              <Badge className={getStatusColor(withdrawal.status)}>
                                {withdrawal.status === 'completed' ? '✅ Pago' : 
                                 withdrawal.status === 'rejected' ? '❌ Rejeitado' : 
                                 '🔄 Pendente'}
                              </Badge>
                            </td>
                            <td className="py-4 px-3">
                              <div className="flex gap-1">
                                {withdrawal.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="bg-green-600 hover:bg-green-700 text-white px-2"
                                      onClick={() => handleQuickStatusUpdate(withdrawal.id, 'completed')}
                                      title="Marcar como pago"
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="bg-red-600 hover:bg-red-700 text-white px-2"
                                      onClick={() => handleQuickStatusUpdate(withdrawal.id, 'rejected')}
                                      title="Rejeitar saque"
                                    >
                                      <AlertCircle className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-gold-400/50 text-gold-400 hover:bg-gold-400/10 px-2"
                                  onClick={() => handleProcessWithdrawal(withdrawal)}
                                  title="Ver detalhes completos"
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

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-400" />
                  📋 Histórico Completo de Transações
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Visualize todas as transações do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Usuário</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium hidden sm:table-cell">Email</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Tipo</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Valor</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium hidden lg:table-cell">Data</th>
                        <th className="text-left py-4 px-3 text-gray-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.slice(0, 50).map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                          <td className="py-4 px-3">
                            <div className="text-white font-medium">{transaction.username || 'N/A'}</div>
                          </td>
                          <td className="py-4 px-3 hidden sm:table-cell">
                            <div className="text-gray-300">{transaction.email}</div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(transaction.type)}
                              <span className="text-gray-300 capitalize">
                                {transaction.type === 'deposit' ? 'Depósito' :
                                 transaction.type === 'withdrawal' ? 'Saque' :
                                 transaction.type === 'mining' ? 'Mineração' : transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <span className="text-gold-400 font-bold text-lg">{transaction.amount} MT</span>
                          </td>
                          <td className="py-4 px-3 hidden lg:table-cell">
                            <span className="text-gray-400">{transaction.date}</span>
                          </td>
                          <td className="py-4 px-3">
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status === 'completed' ? 'Completo' :
                               transaction.status === 'pending' ? 'Pendente' :
                               transaction.status === 'rejected' ? 'Rejeitado' : transaction.status}
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
