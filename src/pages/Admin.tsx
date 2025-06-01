
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Filter
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
}

const Admin = () => {
  const { userData } = useAuth();
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUserData | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const [editAffiliateBalance, setEditAffiliateBalance] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalAffiliateBalance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeUsers: 0,
    pendingWithdrawals: 0
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      const usersData: AdminUserData[] = [];
      let totalBalance = 0;
      let totalAffiliateBalance = 0;
      let totalDeposits = 0;
      let totalWithdrawals = 0;
      let activeUsers = 0;
      let pendingWithdrawals = 0;

      snapshot.forEach((doc) => {
        const userData = doc.data() as AdminUserData;
        usersData.push(userData);
        
        totalBalance += userData.balance || 0;
        totalAffiliateBalance += userData.affiliateBalance || 0;
        
        // Count transactions
        if (userData.transactions) {
          userData.transactions.forEach(tx => {
            if (tx.type === 'deposit' && tx.status === 'success') {
              totalDeposits += tx.amount;
            } else if (tx.type === 'withdraw') {
              if (tx.status === 'success') {
                totalWithdrawals += tx.amount;
              } else if (tx.status === 'pending') {
                pendingWithdrawals += tx.amount;
              }
            }
          });
        }
        
        // Check if user is active (has made transactions in last 30 days)
        if (userData.transactions && userData.transactions.length > 0) {
          const lastTransaction = userData.transactions[userData.transactions.length - 1];
          const lastTxDate = new Date(lastTransaction.date);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          if (lastTxDate > thirtyDaysAgo) {
            activeUsers++;
          }
        }
      });

      setUsers(usersData);
      setStats({
        totalUsers: usersData.length,
        totalBalance,
        totalAffiliateBalance,
        totalDeposits,
        totalWithdrawals,
        activeUsers,
        pendingWithdrawals
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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;
    
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'active') {
      return matchesSearch && user.balance > 0;
    } else if (filterStatus === 'affiliate') {
      return matchesSearch && (user.affiliateBalance || 0) > 0;
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
              Painel Administrativo
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-red-400" />
            <span className="text-red-400 font-semibold">Acesso Restrito</span>
          </div>
          <Button onClick={loadUsers} className="bg-gold-400 text-gray-900 hover:bg-gold-500">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Dados
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Total de Usuários</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Saldo Total Plataforma</p>
                  <p className="text-3xl font-bold text-white">{stats.totalBalance.toFixed(2)} MT</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold-900/50 to-gold-800/50 border-gold-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold-300 text-sm font-medium">Saldo Afiliados</p>
                  <p className="text-3xl font-bold text-white">{stats.totalAffiliateBalance.toFixed(2)} MT</p>
                </div>
                <TrendingUp className="h-8 w-8 text-gold-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Usuários Ativos</p>
                  <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Total Depósitos</p>
                  <p className="text-2xl font-bold text-green-400">{stats.totalDeposits.toFixed(2)} MT</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Total Saques</p>
                  <p className="text-2xl font-bold text-red-400">{stats.totalWithdrawals.toFixed(2)} MT</p>
                </div>
                <TrendingUp className="h-6 w-6 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Saques Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pendingWithdrawals.toFixed(2)} MT</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Filtros e Busca</CardTitle>
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
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Gerenciar Usuários ({filteredUsers.length})</CardTitle>
            <CardDescription className="text-gray-400">
              Visualize e gerencie todas as contas da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Usuário</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Saldo Plataforma</TableHead>
                    <TableHead className="text-gray-300">Saldo Afiliado</TableHead>
                    <TableHead className="text-gray-300">Transações</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.uid} className="border-gray-700">
                      <TableCell className="text-white font-medium">{user.username}</TableCell>
                      <TableCell className="text-gray-300">{user.email}</TableCell>
                      <TableCell className="text-green-400 font-bold">{user.balance.toFixed(2)} MT</TableCell>
                      <TableCell className="text-gold-400 font-bold">{(user.affiliateBalance || 0).toFixed(2)} MT</TableCell>
                      <TableCell className="text-gray-300">{user.transactions?.length || 0}</TableCell>
                      <TableCell>
                        {user.balance > 0 ? (
                          <Badge className="bg-green-500 text-white">Ativo</Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-600 text-gray-400">Inativo</Badge>
                        )}
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
                  Salvar
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
