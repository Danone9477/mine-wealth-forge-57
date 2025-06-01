
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Users, Settings, Search, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserData {
  uid: string;
  username: string;
  email: string;
  balance: number;
  totalEarnings: number;
  canWithdraw: boolean;
  miners: any[];
  transactions: any[];
}

const Admin = () => {
  const { userData } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    if (userData?.role !== 'admin') {
      return;
    }
    loadUsers();
  }, [userData]);

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      const usersData: UserData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          uid: doc.id,
          username: data.username || 'Sem nome',
          email: data.email || 'Sem email',
          balance: data.balance || 0,
          totalEarnings: data.totalEarnings || 0,
          canWithdraw: data.canWithdraw || false,
          miners: data.miners || [],
          transactions: data.transactions || []
        });
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWithdrawPermission = async (userId: string, currentStatus: boolean) => {
    setUpdatingUser(userId);
    
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        canWithdraw: !currentStatus
      });

      // Atualizar estado local
      setUsers(prev => prev.map(user => 
        user.uid === userId 
          ? { ...user, canWithdraw: !currentStatus }
          : user
      ));

      toast({
        title: "Permissão atualizada",
        description: `Saques ${!currentStatus ? 'liberados' : 'bloqueados'} para este usuário`,
      });

    } catch (error) {
      console.error('Erro ao atualizar permissão:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar permissão de saque",
        variant: "destructive",
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (userData.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <Card className="bg-red-900/20 border-red-700 max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
            <p className="text-gray-300">Você não tem permissão para acessar o painel administrativo.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const usersWithWithdrawals = users.filter(u => u.canWithdraw).length;
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
  const totalEarnings = users.reduce((sum, u) => sum + u.totalEarnings, 0);

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
          <p className="text-gray-400 text-lg">
            Gerencie usuários e permissões do Alpha Traders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 font-medium mb-1">Total de Usuários</p>
                  <p className="text-3xl font-bold text-white">{totalUsers}</p>
                </div>
                <Users className="h-12 w-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 font-medium mb-1">Saques Liberados</p>
                  <p className="text-3xl font-bold text-white">{usersWithWithdrawals}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold-500/20 to-gold-600/20 border-gold-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold-200 font-medium mb-1">Saldo Total</p>
                  <p className="text-3xl font-bold text-white">{totalBalance.toFixed(0)} MT</p>
                </div>
                <Shield className="h-12 w-12 text-gold-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 font-medium mb-1">Ganhos Totais</p>
                  <p className="text-3xl font-bold text-white">{totalEarnings.toFixed(0)} MT</p>
                </div>
                <Settings className="h-12 w-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar usuário por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:border-gold-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Gerenciar Usuários</CardTitle>
            <CardDescription className="text-gray-400">
              Controle as permissões de saque dos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Carregando usuários...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.uid} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-white font-semibold">{user.username}</h3>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={user.canWithdraw ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                            {user.canWithdraw ? 'Saques Liberados' : 'Saques Bloqueados'}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {user.miners.length} Mineradores
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Saldo: </span>
                          <span className="text-white font-medium">{user.balance.toFixed(2)} MT</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Ganhos: </span>
                          <span className="text-white font-medium">{user.totalEarnings.toFixed(2)} MT</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Transações: </span>
                          <span className="text-white font-medium">{user.transactions.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Label htmlFor={`withdraw-${user.uid}`} className="text-gray-300">
                        Permitir Saques
                      </Label>
                      <Switch
                        id={`withdraw-${user.uid}`}
                        checked={user.canWithdraw}
                        disabled={updatingUser === user.uid}
                        onCheckedChange={() => toggleWithdrawPermission(user.uid, user.canWithdraw)}
                      />
                    </div>
                  </div>
                ))}
                
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhum usuário encontrado</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
