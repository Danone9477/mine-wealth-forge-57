
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, User, Mail, Copy, AlertCircle, DollarSign, Edit } from "lucide-react";
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
import EditUserBalanceModal from './EditUserBalanceModal';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
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
        const userInfo = {
          id: doc.id,
          username: userData.username || 'N/A',
          email: userData.email || 'N/A',
          createdAt: userData.createdAt || new Date().toISOString().split('T')[0],
          balance: userData.balance || 0,
          totalEarnings: userData.totalEarnings || 0,
          affiliateBalance: userData.affiliateBalance || 0,
          phone: userData.phone || 'N/A'
        };
        
        usersData.push(userInfo);

        if (userData.transactions && Array.isArray(userData.transactions)) {
          userData.transactions.forEach(transaction => {
            // Garantir que todas as transações tenham ID único
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
      console.log('📊 Saques pendentes detalhados:', pendingWithdrawals);

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
      console.log(`🔄 Atualizando transação ${transactionId} para status: ${status}`);

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gold-500">🏛️ Admin Panel</h1>
            <p className="text-gray-400 text-sm">Gerencie usuários e saques em tempo real</p>
            <p className="text-xs text-green-400 mt-1">✅ Firebase Conectado</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
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
        <TabsList className="bg-gray-800 border-gray-700 grid grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 text-xs px-2 py-2">
            📊 Resumo
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="data-[state=active]:bg-gray-700 text-xs px-2 py-2">
            💰 Saques ({withdrawalStats.pending})
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-gray-700 text-xs px-2 py-2">
            👥 Usuários
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-gray-700 text-xs px-2 py-2">
            🔄 Transações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="bg-blue-900/30 border-blue-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <User className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-400 text-xs font-medium">Usuários</p>
                  <p className="text-xl font-bold text-white">{users.length}</p>
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

            <Card className="bg-green-900/30 border-green-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <CreditCard className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 text-xs font-medium">Pagos</p>
                  <p className="text-xl font-bold text-white">{withdrawalStats.completed}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-900/30 border-red-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <CreditCard className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <p className="text-red-400 text-xs font-medium">Rejeitados</p>
                  <p className="text-xl font-bold text-white">{withdrawalStats.rejected}</p>
                </div>
              </CardContent>
            </Card>
          </div>

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
              <CardTitle className="text-lg">Usuários ({users.length})</CardTitle>
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
                      <TableHead className="text-xs">Saldo</TableHead>
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
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gold-400 font-bold">{user.balance} MT</div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setEditUserModalOpen(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-xs h-8"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
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
                    {transactions.slice(0, 50).map(transaction => (
                      <TableRow key={transaction.id} className="hover:bg-gray-700/50">
                        <TableCell className="text-sm">{transaction.username}</TableCell>
                        <TableCell>
                          <Badge className={transaction.type === 'withdrawal' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
                            {transaction.type === 'withdrawal' ? 'Saque' : 'Depósito'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gold-400 font-bold text-sm">{transaction.amount} MT</TableCell>
                        <TableCell>
                          <Badge className={
                            transaction.status === 'completed' || transaction.status === 'pago' 
                              ? 'bg-green-500/20 text-green-400' 
                              : transaction.status === 'pending' || transaction.status === 'pendente'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }>
                            {transaction.status === 'completed' || transaction.status === 'pago' ? 'Pago' 
                             : transaction.status === 'pending' || transaction.status === 'pendente' ? 'Pendente'
                             : 'Rejeitado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{transaction.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de detalhes do usuário */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
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
                <DollarSign className="h-5 w-5" />
                <span className="font-bold">Saldo:</span>
                <span className="text-gold-400">{selectedUser.balance} MT</span>
              </div>
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
    </div>
  );
};

export default AdminDashboard;
