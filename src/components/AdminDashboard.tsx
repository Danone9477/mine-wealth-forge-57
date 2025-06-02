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
        // For now, using mock data since we don't have a real API
        // In a real app, you would use Firebase or your backend API
        const mockUsers = [
          {
            id: '1',
            username: 'user1',
            email: 'user1@example.com',
            createdAt: '2024-01-15'
          },
          {
            id: '2', 
            username: 'user2',
            email: 'user2@example.com',
            createdAt: '2024-01-20'
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
        // Mock data for transactions
        const mockTransactions = [
          {
            id: '1',
            userId: 'user1',
            type: 'withdrawal',
            amount: 100,
            date: '2024-01-25',
            status: 'pending'
          },
          {
            id: '2',
            userId: 'user2', 
            type: 'deposit',
            amount: 50,
            date: '2024-01-26',
            status: 'completed'
          }
        ];
        setTransactions(mockTransactions);
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
  }, [user, navigate, logout]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateTransaction = async (transactionId: string, status: string, notes?: string) => {
    setIsUpdating(true);
    try {
      // In a real app, this would make an API call
      // For now, just update locally
      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction.id === transactionId ? { ...transaction, status, notes } : transaction
        )
      );
  
      toast({
        title: "Transação atualizada",
        description: "Status da transação foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast({
        title: "Erro ao atualizar transação",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gold-500">Painel Administrativo</h1>
          <p className="text-gray-400">Gerencie usuários e transações da plataforma.</p>
        </div>
        <Button variant="destructive" onClick={() => { logout(); navigate('/login'); }}>
          Logout
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
            💰 Gerenciar Saques ({transactions.filter(t => t.type === 'withdrawal').length})
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-gray-700">
            🔄 Transações ({transactions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">Estatísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-900/30 p-4 rounded-lg">
                <p className="text-blue-400 text-sm">Total de Usuários</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="bg-green-900/30 p-4 rounded-lg">
                <p className="text-green-400 text-sm">Total de Transações</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div className="bg-gold-900/30 p-4 rounded-lg">
                <p className="text-gold-400 text-sm">Total de Saques</p>
                <p className="text-2xl font-bold">{transactions.filter(t => t.type === 'withdrawal').length}</p>
              </div>
            </CardContent>
          </Card>
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
              <CardTitle>Lista de Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(transaction => (
                    <TableRow key={transaction.id} className="hover:bg-gray-700/50">
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.userId}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
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
