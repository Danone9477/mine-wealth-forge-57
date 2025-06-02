import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        // Mock data com usuários mais realistas
        const mockUsers = [
          {
            id: '1',
            username: 'carlos_silva',
            email: 'carlos.silva@gmail.com',
            createdAt: '2024-01-15'
          },
          {
            id: '2', 
            username: 'ana_costa',
            email: 'ana.costa@hotmail.com',
            createdAt: '2024-01-20'
          },
          {
            id: '3',
            username: 'joao_afiliado',
            email: 'joao.marketing@gmail.com',
            createdAt: '2024-02-01'
          },
          {
            id: '4',
            username: 'maria_santos',
            email: 'maria.santos@yahoo.com',
            createdAt: '2024-02-10'
          }
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        toast({
          title: "Erro ao buscar usuários",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    };

    const fetchTransactions = async () => {
      try {
        // Mock data com saques completos e realistas
        const mockTransactions = [
          {
            id: 'WD001',
            userId: '1',
            username: 'carlos_silva',
            email: 'carlos.silva@gmail.com',
            type: 'withdrawal',
            amount: 150,
            date: '2024-01-25',
            status: 'pending',
            source: 'user',
            phone: '+258 84 123 4567',
            method: 'M-Pesa',
            pixKey: '84 123 4567',
            address: 'Maputo, Moçambique',
            notes: 'Primeiro saque do usuário'
          },
          {
            id: 'WD002',
            userId: '2',
            username: 'ana_costa',
            email: 'ana.costa@hotmail.com',
            type: 'withdrawal',
            amount: 75,
            date: '2024-01-26',
            status: 'completed',
            source: 'user',
            phone: '+258 87 987 6543',
            method: 'E-Mola',
            pixKey: '87 987 6543',
            address: 'Beira, Moçambique'
          },
          {
            id: 'WD003',
            userId: '3',
            username: 'joao_afiliado',
            email: 'joao.marketing@gmail.com',
            type: 'withdrawal',
            amount: 300,
            date: '2024-02-01',
            status: 'pending',
            source: 'affiliate',
            phone: '+258 82 555 7777',
            method: 'M-Pesa',
            pixKey: '82 555 7777',
            address: 'Nampula, Moçambique',
            notes: 'Saque de comissões - 15 referidos ativos'
          },
          {
            id: 'WD004',
            userId: '4',
            username: 'maria_santos',
            email: 'maria.santos@yahoo.com',
            type: 'withdrawal',
            amount: 50,
            date: '2024-02-05',
            status: 'rejected',
            source: 'user',
            phone: '+258 86 111 2222',
            method: 'E-Mola',
            pixKey: '86 111 2222',
            address: 'Matola, Moçambique',
            notes: 'Rejeitado - dados bancários incorretos'
          },
          {
            id: 'WD005',
            userId: '1',
            username: 'carlos_silva',
            email: 'carlos.silva@gmail.com',
            type: 'withdrawal',
            amount: 200,
            date: '2024-02-08',
            status: 'pending',
            source: 'user',
            phone: '+258 84 123 4567',
            method: 'M-Pesa',
            pixKey: '84 123 4567',
            address: 'Maputo, Moçambique'
          },
          {
            id: 'WD006',
            userId: '3',
            username: 'joao_afiliado',
            email: 'joao.marketing@gmail.com',
            type: 'withdrawal',
            amount: 450,
            date: '2024-02-10',
            status: 'pending',
            source: 'affiliate',
            phone: '+258 82 555 7777',
            method: 'M-Pesa',
            pixKey: '82 555 7777',
            address: 'Nampula, Moçambique',
            notes: 'Saque de comissões - 25 referidos ativos'
          },
          // Adicionar alguns depósitos também
          {
            id: 'DP001',
            userId: '2',
            username: 'ana_costa',
            email: 'ana.costa@hotmail.com',
            type: 'deposit',
            amount: 100,
            date: '2024-02-12',
            status: 'completed',
            source: 'user'
          },
          {
            id: 'DP002',
            userId: '4',
            username: 'maria_santos',
            email: 'maria.santos@yahoo.com',
            type: 'deposit',
            amount: 80,
            date: '2024-02-13',
            status: 'completed',
            source: 'user'
          }
        ];
        setTransactions(mockTransactions);
        
        console.log('🔥 Transações carregadas no AdminDashboard:', mockTransactions.length);
        console.log('📊 Saques encontrados:', mockTransactions.filter(t => t.type === 'withdrawal').length);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
        toast({
          title: "Erro ao buscar transações",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    };

    fetchUsers();
    fetchTransactions();
  }, [user, navigate]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateTransaction = async (transactionId: string, status: string, notes?: string) => {
    setIsUpdating(true);
    try {
      // Atualizar transação localmente
      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction.id === transactionId ? { ...transaction, status, notes } : transaction
        )
      );
  
      toast({
        title: "Saque atualizado com sucesso! 🎉",
        description: `Status alterado para: ${status === 'completed' ? 'Pago ✅' : status === 'rejected' ? 'Rejeitado ❌' : status}`,
      });
      
      console.log(`💰 Saque ${transactionId} marcado como: ${status}`);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gold-500">🏛️ Painel Administrativo</h1>
          <p className="text-gray-400">Gerencie todos os saques e transações da plataforma em tempo real.</p>
        </div>
        <Button variant="destructive" onClick={() => { logout(); navigate('/login'); }}>
          🚪 Logout
        </Button>
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
              <CardTitle>Lista de Usuários</CardTitle>
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
                    <TableHead>Data de Criação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id} className="hover:bg-gray-700/50">
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
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
