
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, TrendingUp, Clock, Zap, Calendar, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { userData, updateUserData } = useAuth();
  const [canCompleteTask, setCanCompleteTask] = useState(false);

  // Sample earnings data for chart
  const earningsData = [
    { day: 'Seg', earnings: 150 },
    { day: 'Ter', earnings: 180 },
    { day: 'Qua', earnings: 220 },
    { day: 'Qui', earnings: 190 },
    { day: 'Sex', earnings: 250 },
    { day: 'Sáb', earnings: 300 },
    { day: 'Dom', earnings: 280 },
  ];

  useEffect(() => {
    if (userData) {
      const today = new Date().toDateString();
      const lastTaskDate = userData.lastTaskDate;
      setCanCompleteTask(!lastTaskDate || lastTaskDate !== today);
    }
  }, [userData]);

  const completeTask = async () => {
    if (!userData || !canCompleteTask) return;

    const baseTaskReward = 25;
    const minerBonus = userData.miners?.reduce((total, miner) => total + (miner.dailyReturn || 0), 0) || 0;
    const totalReward = baseTaskReward + minerBonus;
    const today = new Date().toDateString();
    
    const transaction = {
      id: Date.now().toString(),
      type: 'task',
      amount: totalReward,
      status: 'success',
      date: new Date().toISOString(),
      description: `Tarefa diária completada (${baseTaskReward} MT base + ${minerBonus} MT dos mineradores)`
    };
    
    await updateUserData({
      balance: userData.balance + totalReward,
      totalEarnings: userData.totalEarnings + totalReward,
      lastTaskDate: today,
      transactions: [...(userData.transactions || []), transaction]
    });
    
    setCanCompleteTask(false);
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const dailyMinerEarnings = userData.miners?.reduce((acc, miner) => acc + (miner.dailyReturn || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Olá, <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">{userData.username}</span>! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Bem-vindo ao seu painel de controle. Aqui você pode acompanhar seus ganhos e gerenciar seus investimentos.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gold-400 to-gold-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 font-medium">Saldo Atual</p>
                  <p className="text-2xl font-bold text-gray-900">{userData.balance} MT</p>
                </div>
                <Coins className="h-8 w-8 text-gray-900" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-medium">Ganhos Totais</p>
                  <p className="text-2xl font-bold text-white">{userData.totalEarnings} MT</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-medium">Mineradores Ativos</p>
                  <p className="text-2xl font-bold text-white">{userData.miners?.length || 0}</p>
                </div>
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-medium">Ganho/Dia</p>
                  <p className="text-2xl font-bold text-white">{dailyMinerEarnings} MT</p>
                </div>
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Earnings Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gold-400" />
                  Desempenho dos Ganhos (7 dias)
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Acompanhe a evolução dos seus ganhos diários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#FBB424" 
                        strokeWidth={3}
                        dot={{ fill: '#FBB424', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Task & Miners */}
          <div className="space-y-6">
            {/* Daily Task */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gold-400" />
                  Tarefa Diária
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Complete sua tarefa diária e ganhe 25 MT + bônus dos mineradores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Verificar investimentos</span>
                    {!canCompleteTask ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <Button 
                        onClick={completeTask}
                        size="sm"
                        className="bg-gradient-gold text-gray-900 hover:bg-gold-500"
                      >
                        Completar
                      </Button>
                    )}
                  </div>
                  <Progress value={canCompleteTask ? 0 : 100} className="h-2" />
                  <p className="text-sm text-gray-400">
                    {canCompleteTask ? 
                      `Ganhe ${25 + dailyMinerEarnings} MT hoje!` : 
                      'Tarefa concluída hoje!'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Active Miners */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-gold-400" />
                  Mineradores Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData.miners?.length ? (
                  <div className="space-y-3">
                    {userData.miners.map((miner, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{miner.name}</p>
                          <p className="text-sm text-gray-400">{miner.dailyReturn} MT/dia</p>
                        </div>
                        <Badge className="bg-green-600 text-white">Ativo</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Zap className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Nenhum minerador ativo</p>
                    <Button asChild className="bg-gradient-gold text-gray-900 hover:bg-gold-500">
                      <a href="/miners">Comprar Minerador</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button asChild className="bg-gradient-gold text-gray-900 hover:bg-gold-500 h-16">
              <a href="/miners">Comprar Minerador</a>
            </Button>
            <Button asChild variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900 h-16">
              <a href="/deposit">Fazer Depósito</a>
            </Button>
            <Button asChild variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 h-16">
              <a href="/withdraw">Sacar Fundos</a>
            </Button>
            <Button asChild variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900 h-16">
              <a href="/history">Ver Histórico</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
