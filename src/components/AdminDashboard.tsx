
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 15247,
    totalDeposits: 2850000,
    totalWithdrawals: 1200000,
    activeMiners: 8450,
    todayRegistrations: 127,
    pendingWithdrawals: 45,
    totalProfit: 850000,
    systemUptime: 99.9
  });

  const [users, setUsers] = useState([
    { id: 1, name: "João Silva", email: "joao@email.com", balance: 1250, status: "active", joinDate: "2024-01-15", miners: 3 },
    { id: 2, name: "Maria Costa", email: "maria@email.com", balance: 2400, status: "active", joinDate: "2024-02-10", miners: 5 },
    { id: 3, name: "Pedro Santos", email: "pedro@email.com", balance: 850, status: "suspended", joinDate: "2024-03-05", miners: 2 },
    { id: 4, name: "Ana Pereira", email: "ana@email.com", balance: 3200, status: "active", joinDate: "2024-01-20", miners: 7 },
    { id: 5, name: "Carlos Mendes", email: "carlos@email.com", balance: 1800, status: "pending", joinDate: "2024-05-12", miners: 4 }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, user: "João Silva", type: "deposit", amount: 500, status: "completed", date: "2024-06-01 10:30" },
    { id: 2, user: "Maria Costa", type: "withdrawal", amount: 300, status: "pending", date: "2024-06-01 09:15" },
    { id: 3, user: "Pedro Santos", type: "mining", amount: 45, status: "completed", date: "2024-06-01 08:45" },
    { id: 4, user: "Ana Pereira", type: "deposit", amount: 1000, status: "completed", date: "2024-05-31 16:20" },
    { id: 5, user: "Carlos Mendes", type: "withdrawal", amount: 150, status: "processing", date: "2024-05-31 14:10" }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <CreditCard className="h-4 w-4" />;
      case 'withdrawal': return <Banknote className="h-4 w-4" />;
      case 'mining': return <Pickaxe className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

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
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notificações</span>
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>
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
              <div className="text-2xl font-bold text-white">{(stats.totalDeposits / 1000000).toFixed(1)}M MT</div>
              <p className="text-xs text-green-300">+12% este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border-yellow-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-yellow-400 text-sm font-medium">Mineradores Ativos</CardTitle>
                <Pickaxe className="h-4 w-4 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeMiners.toLocaleString()}</div>
              <p className="text-xs text-yellow-300">Funcionando 24/7</p>
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
              <div className="text-2xl font-bold text-white">{(stats.totalProfit / 1000).toFixed(0)}K MT</div>
              <p className="text-xs text-purple-300">+{stats.systemUptime}% uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
              Transações
            </TabsTrigger>
            <TabsTrigger value="miners" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
              Mineradores
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
              Configurações
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
                        <th className="text-left py-3 px-2 text-gray-400 font-medium hidden lg:table-cell">Mineradores</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center text-gray-900 font-semibold text-xs">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-white font-medium">{user.name}</div>
                                <div className="text-gray-400 text-xs sm:hidden">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gray-300 hidden sm:table-cell">{user.email}</td>
                          <td className="py-3 px-2 text-green-400 font-medium">{user.balance} MT</td>
                          <td className="py-3 px-2 text-gray-300 hidden lg:table-cell">{user.miners}</td>
                          <td className="py-3 px-2">
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-blue-400 hover:bg-blue-400/20">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-400 hover:bg-gray-400/20">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:bg-red-400/20">
                                <Trash2 className="h-3 w-3" />
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
                <CardTitle className="text-white">Transações Recentes</CardTitle>
                <CardDescription className="text-gray-400">
                  Monitore todas as transações da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Usuário</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Tipo</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Valor</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium hidden sm:table-cell">Data</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="py-3 px-2 text-white">{transaction.user}</td>
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

          {/* Miners Tab */}
          <TabsContent value="miners" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Pickaxe className="h-5 w-5" />
                    Basic Miners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">2,450</div>
                    <div className="text-sm text-blue-300">Ativos agora</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <div className="text-xs text-gray-400">85% capacidade</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gold-900/30 to-gold-800/30 border-gold-700/50">
                <CardHeader>
                  <CardTitle className="text-gold-400 flex items-center gap-2">
                    <Pickaxe className="h-5 w-5" />
                    Premium Miners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">3,200</div>
                    <div className="text-sm text-gold-300">Ativos agora</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gold-400 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                    <div className="text-xs text-gray-400">92% capacidade</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-700/50">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <Pickaxe className="h-5 w-5" />
                    Elite Miners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">2,800</div>
                    <div className="text-sm text-red-300">Ativos agora</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                    <div className="text-xs text-gray-400">78% capacidade</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure parâmetros globais da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Mineradores</h3>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Taxa de ROI (%)</label>
                      <Input className="bg-gray-700 border-gray-600 text-white" defaultValue="350" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Duração padrão (dias)</label>
                      <Input className="bg-gray-700 border-gray-600 text-white" defaultValue="30" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Pagamentos</h3>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Taxa de saque (%)</label>
                      <Input className="bg-gray-700 border-gray-600 text-white" defaultValue="2.5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Valor mínimo de saque (MT)</label>
                      <Input className="bg-gray-700 border-gray-600 text-white" defaultValue="100" />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button className="bg-gold-400 text-gray-900 hover:bg-gold-500">
                    Salvar Alterações
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
