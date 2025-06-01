
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Eye, 
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Clock,
  Banknote,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Pickaxe,
  Play,
  Pause
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { processDailyMinerRewards } from '@/services/minerService';

interface AdminUserData {
  uid: string;
  username: string;
  email: string;
  balance: number;
  totalEarnings: number;
  affiliateBalance?: number;
  affiliateStats?: any;
  transactions?: any[];
  createdAt?: string;
  lastLogin?: string;
  miners?: any[];
  canWithdraw?: boolean;
  isBlocked?: boolean;
  withdrawBlocked?: boolean;
}

interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  phone: string;
  method: string;
  status: 'pending' | 'approved' | 'failed';
  date: string;
  transactionId?: string;
}

const Admin = () => {
  const { userData } = useAuth();
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUserData | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const [editAffiliateBalance, setEditAffiliateBalance] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'withdrawals' | 'miners' | 'system'>('users');
  const [systemSettings, setSystemSettings] = useState({
    globalWithdrawEnabled: true,
    minerRewardsEnabled: true,
    newRegistrationsEnabled: true,
    depositsEnabled: true
  });

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalAffiliateBalance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeUsers: 0,
    pendingWithdrawals: 0,
    pendingWithdrawalAmount: 0,
    totalMiners: 0,
    activeMiners: 0
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      const usersData: AdminUserData[] = [];
      const withdrawalRequests: WithdrawalRequest[] = [];
      let totalBalance = 0;
      let totalAffiliateBalance = 0;
      let totalDeposits = 0;
      let totalWithdrawals = 0;
      let activeUsers = 0;
      let pendingWithdrawals = 0;
      let pendingWithdrawalAmount = 0;
      let totalMiners = 0;
      let activeMiners = 0;

      snapshot.forEach((doc) => {
        const userData = doc.data() as AdminUserData;
        usersData.push(userData);
        
        totalBalance += userData.balance || 0;
        totalAffiliateBalance += userData.affiliateBalance || 0;
        
        // Contar mineradores
        if (userData.miners) {
          totalMiners += userData.miners.length;
          activeMiners += userData.miners.filter(m => m.isActive).length;
        }
        
        // Count transactions and extract withdrawal requests
        if (userData.transactions) {
          userData.transactions.forEach(tx => {
            if (tx.type === 'deposit' && tx.status === 'success') {
              totalDeposits += tx.amount;
            } else if (tx.type === 'withdraw') {
              if (tx.status === 'success') {
                totalWithdrawals += tx.amount;
              } else if (tx.status === 'pending') {
                pendingWithdrawals++;
                pendingWithdrawalAmount += tx.amount;
                
                // Add to withdrawal requests
                withdrawalRequests.push({
                  id: tx.id,
                  userId: userData.uid,
                  username: userData.username,
                  amount: tx.amount,
                  phone: tx.phone || '',
                  method: tx.method || 'emola',
                  status: 'pending',
                  date: tx.date,
                  transactionId: tx.id
                });
              }
            }
          });
        }
        
        // Check if user is active (has miners or recent transactions)
        if (userData.miners && userData.miners.length > 0) {
          activeUsers++;
        }
      });

      setUsers(usersData);
      setWithdrawals(withdrawalRequests);
      setStats({
        totalUsers: usersData.length,
        totalBalance,
        totalAffiliateBalance,
        totalDeposits,
        totalWithdrawals,
        activeUsers,
        pendingWithdrawals,
        pendingWithdrawalAmount,
        totalMiners,
        activeMiners
      });
      
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditUser = (user: AdminUserData) => {
    setSelectedUser(user);
    setEditBalance(user.balance.toString());
    setEditAffiliateBalance((user.affiliateBalance || 0).toString());
    setShowEditModal(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    try {
      const newBalance = parseFloat(editBalance) || 0;
      const newAffiliateBalance = parseFloat(editAffiliateBalance) || 0;
      
      await updateDoc(doc(db, 'users', selectedUser.uid), {
        balance: newBalance,
        affiliateBalance: newAffiliateBalance,
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      });
      
      setShowEditModal(false);
      loadUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário",
        variant: "destructive",
      });
    }
  };

  const handleToggleWithdraw = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        withdrawBlocked: !currentStatus,
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Sucesso",
        description: `Saque ${!currentStatus ? 'bloqueado' : 'liberado'} com sucesso`,
      });
      
      loadUsers();
    } catch (error) {
      console.error('Erro ao alterar status de saque:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status de saque",
        variant: "destructive",
      });
    }
  };

  const handleToggleUserBlock = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isBlocked: !currentStatus,
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Sucesso",
        description: `Usuário ${!currentStatus ? 'bloqueado' : 'desbloqueado'} com sucesso`,
      });
      
      loadUsers();
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do usuário",
        variant: "destructive",
      });
    }
  };

  const handleProcessWithdrawal = async (withdrawalId: string, newStatus: 'approved' | 'failed') => {
    try {
      // Find the withdrawal and user
      const withdrawal = withdrawals.find(w => w.id === withdrawalId);
      if (!withdrawal) return;

      const user = users.find(u => u.uid === withdrawal.userId);
      if (!user) return;

      // Update the transaction in user's data
      const updatedTransactions = user.transactions?.map(tx => {
        if (tx.id === withdrawalId) {
          return {
            ...tx,
            status: newStatus === 'approved' ? 'success' : 'failed',
            processedAt: new Date().toISOString(),
            processedBy: 'admin'
          };
        }
        return tx;
      }) || [];

      await updateDoc(doc(db, 'users', user.uid), {
        transactions: updatedTransactions,
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Sucesso",
        description: `Saque ${newStatus === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`,
      });

      loadUsers();
    } catch (error) {
      console.error('Erro ao processar saque:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar saque",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário? Esta ação é irreversível!')) return;
    
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast({
        title: "Sucesso",
        description: "Usuário deletado com sucesso",
      });
      loadUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar usuário",
        variant: "destructive",
      });
    }
  };

  const handleProcessDailyRewards = async () => {
    try {
      setLoading(true);
      await processDailyMinerRewards();
      toast({
        title: "Sucesso",
        description: "Recompensas diárias processadas com sucesso",
      });
      loadUsers();
    } catch (error) {
      console.error('Erro ao processar recompensas:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar recompensas diárias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'active') {
      return matchesSearch && user.balance > 0;
    } else if (filterStatus === 'affiliate') {
      return matchesSearch && (user.affiliateBalance || 0) > 0;
    } else if (filterStatus === 'blocked') {
      return matchesSearch && user.isBlocked;
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Painel Administrativo Completo
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-red-400" />
            <span className="text-red-400 font-semibold">Controle Total do Sistema</span>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={loadUsers} className="bg-gold-400 text-gray-900 hover:bg-gold-500">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Dados
            </Button>
            <Button onClick={handleProcessDailyRewards} className="bg-green-500 text-white hover:bg-green-600">
              <Pickaxe className="h-4 w-4 mr-2" />
              Processar Recompensas
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Total de Usuários</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                  <p className="text-xs text-blue-400">Ativos: {stats.activeUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Saldo Total</p>
                  <p className="text-3xl font-bold text-white">{stats.totalBalance.toFixed(2)} MT</p>
                  <p className="text-xs text-green-400">Afiliados: {stats.totalAffiliateBalance.toFixed(2)} MT</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm font-medium">Saques Pendentes</p>
                  <p className="text-3xl font-bold text-white">{stats.pendingWithdrawals}</p>
                  <p className="text-xs text-yellow-400">{stats.pendingWithdrawalAmount.toFixed(2)} MT</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Mineradores</p>
                  <p className="text-3xl font-bold text-white">{stats.totalMiners}</p>
                  <p className="text-xs text-purple-400">Ativos: {stats.activeMiners}</p>
                </div>
                <Pickaxe className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'bg-gold-400 text-gray-900' : 'bg-gray-700 text-white'}
          >
            <Users className="h-4 w-4 mr-2" />
            Gerenciar Usuários
          </Button>
          <Button
            onClick={() => setActiveTab('withdrawals')}
            className={activeTab === 'withdrawals' ? 'bg-gold-400 text-gray-900' : 'bg-gray-700 text-white'}
          >
            <Banknote className="h-4 w-4 mr-2" />
            Processar Saques ({stats.pendingWithdrawals})
          </Button>
          <Button
            onClick={() => setActiveTab('miners')}
            className={activeTab === 'miners' ? 'bg-gold-400 text-gray-900' : 'bg-gray-700 text-white'}
          >
            <Pickaxe className="h-4 w-4 mr-2" />
            Mineradores Ativos
          </Button>
          <Button
            onClick={() => setActiveTab('system')}
            className={activeTab === 'system' ? 'bg-gold-400 text-gray-900' : 'bg-gray-700 text-white'}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações Sistema
          </Button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            {/* Enhanced Filters and Search */}
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Filtros e Busca Avançada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-gray-300">Buscar Usuário</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Filtrar por Status</Label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value="all">Todos</option>
                      <option value="active">Com Saldo</option>
                      <option value="affiliate">Afiliados</option>
                      <option value="blocked">Bloqueados</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Users Table */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Controle Completo de Usuários ({filteredUsers.length})</CardTitle>
                <CardDescription className="text-gray-400">
                  Gerencie todos os aspectos das contas dos usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Usuário</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Saldo</TableHead>
                        <TableHead className="text-gray-300">Afiliado</TableHead>
                        <TableHead className="text-gray-300">Mineradores</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Controles</TableHead>
                        <TableHead className="text-gray-300">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.uid} className="border-gray-700">
                          <TableCell className="text-white font-medium">
                            {user.username}
                            {user.isBlocked && <Badge className="ml-2 bg-red-500">Bloqueado</Badge>}
                          </TableCell>
                          <TableCell className="text-gray-300">{user.email}</TableCell>
                          <TableCell className="text-green-400 font-bold">{user.balance.toFixed(2)} MT</TableCell>
                          <TableCell className="text-gold-400 font-bold">{(user.affiliateBalance || 0).toFixed(2)} MT</TableCell>
                          <TableCell className="text-blue-400">{user.miners?.length || 0}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {user.withdrawBlocked ? (
                                <Badge className="bg-red-500 text-white">Saque Bloqueado</Badge>
                              ) : (
                                <Badge className="bg-green-500 text-white">Saque Liberado</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={!user.withdrawBlocked}
                                  onCheckedChange={() => handleToggleWithdraw(user.uid, !user.withdrawBlocked)}
                                />
                                <span className="text-xs text-gray-400">Saque</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={!user.isBlocked}
                                  onCheckedChange={() => handleToggleUserBlock(user.uid, user.isBlocked || false)}
                                />
                                <span className="text-xs text-gray-400">Conta</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDeleteUser(user.uid)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                <Trash2 className="h-4 w-4" />
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
          </>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Processar Saques</CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie todas as solicitações de saque pendentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Usuário</TableHead>
                      <TableHead className="text-gray-300">Valor</TableHead>
                      <TableHead className="text-gray-300">Método</TableHead>
                      <TableHead className="text-gray-300">Telefone</TableHead>
                      <TableHead className="text-gray-300">Data</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">{withdrawal.username}</TableCell>
                        <TableCell className="text-yellow-400 font-bold">{withdrawal.amount.toFixed(2)} MT</TableCell>
                        <TableCell className="text-gray-300 capitalize">{withdrawal.method}</TableCell>
                        <TableCell className="text-gray-300">{withdrawal.phone}</TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(withdrawal.date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-500 text-black">Pendente</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleProcessWithdrawal(withdrawal.id, 'approved')}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleProcessWithdrawal(withdrawal.id, 'failed')}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <XCircle className="h-4 w-4" />
                              Rejeitar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {withdrawals.length === 0 && (
                  <div className="text-center py-8">
                    <Banknote className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Nenhum saque pendente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Editar Usuário: {selectedUser.username}</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Saldo da Plataforma (MT)</Label>
                  <Input
                    type="number"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300">Saldo de Afiliado (MT)</Label>
                  <Input
                    type="number"
                    value={editAffiliateBalance}
                    onChange={(e) => setEditAffiliateBalance(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button onClick={handleSaveUser} className="bg-gold-400 text-gray-900 hover:bg-gold-500">
                  Salvar Alterações
                </Button>
                <Button onClick={() => setShowEditModal(false)} variant="outline" className="border-gray-600 text-gray-300">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
