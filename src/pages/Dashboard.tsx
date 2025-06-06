import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, TrendingUp, Clock, Zap, Calendar, CheckCircle, Gift, Pickaxe, Trophy } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { userData, updateUserData } = useAuth();
  const [canCompleteTask, setCanCompleteTask] = useState(false);
  const [canCollectMinerEarnings, setCanCollectMinerEarnings] = useState(false);
  const [loading, setLoading] = useState(false);

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

      checkMinerEarningsAvailability();
    }
  }, [userData]);

  const checkMinerEarningsAvailability = () => {
    if (!userData?.miners) return;

    const now = new Date();
    const today = now.toDateString();
    
    const hasEarningsToCollect = userData.miners.some(miner => {
      if (!miner.isActive && !miner.active) return false;
      
      const lastCollection = miner.lastCollection ? new Date(miner.lastCollection).toDateString() : null;
      const expiryDate = new Date(miner.expiryDate);
      
      return expiryDate > now && lastCollection !== today;
    });

    setCanCollectMinerEarnings(hasEarningsToCollect);
  };

  const completeTask = async () => {
    if (!userData || !canCompleteTask) return;

    // Tarefa diária agora adiciona EXATAMENTE 18 MT, sem bônus dos mineradores
    const taskReward = 18;
    const today = new Date().toDateString();
    
    const transaction = {
      id: Date.now().toString(),
      type: 'task' as const,
      amount: taskReward,
      status: 'success' as const,
      date: new Date().toISOString(),
      description: `Tarefa diária completada - ${taskReward} MT`
    };
    
    await updateUserData({
      balance: userData.balance + taskReward,
      totalEarnings: userData.totalEarnings + taskReward,
      lastTaskDate: today,
      transactions: [...(userData.transactions || []), transaction]
    });
    
    setCanCompleteTask(false);
    toast({
      title: "Tarefa completada! 🎉",
      description: `Você ganhou ${taskReward} MT!`,
    });
  };

  const collectMinerEarnings = async () => {
    if (!userData || !canCollectMinerEarnings || loading) return;

    setLoading(true);
    
    try {
      const now = new Date();
      const today = now.toDateString();
      let totalEarnings = 0;
      
      const updatedMiners = userData.miners?.map(miner => {
        if (!miner.isActive && !miner.active) return miner;
        
        const lastCollection = miner.lastCollection ? new Date(miner.lastCollection).toDateString() : null;
        const expiryDate = new Date(miner.expiryDate);
        
        if (expiryDate > now && lastCollection !== today) {
          totalEarnings += miner.dailyReturn || 0;
          
          const daysRemaining = Math.max(0, Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
          
          return {
            ...miner,
            lastCollection: now.toISOString(),
            lastProcessed: now.toISOString(),
            daysRemaining,
            isActive: daysRemaining > 0,
            active: daysRemaining > 0,
            totalEarned: (miner.totalEarned || 0) + (miner.dailyReturn || 0)
          };
        }
        
        return miner;
      }) || [];

      if (totalEarnings > 0) {
        const transaction = {
          id: Date.now().toString(),
          type: 'mining' as const,
          amount: totalEarnings,
          status: 'success' as const,
          date: now.toISOString(),
          description: `Ganhos diários dos mineradores coletados`
        };

        // Calcular ganhos mensais atualizados
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const monthlyEarnings = (userData.transactions || [])
          .filter(t => 
            (t.type === 'mining' || t.type === 'mining_reward' || t.type === 'task') && 
            new Date(t.date) >= thirtyDaysAgo
          )
          .reduce((sum, t) => sum + t.amount, 0) + totalEarnings;

        await updateUserData({
          balance: userData.balance + totalEarnings,
          totalEarnings: userData.totalEarnings + totalEarnings,
          monthlyEarnings: monthlyEarnings,
          miners: updatedMiners,
          transactions: [...(userData.transactions || []), transaction]
        });

        setCanCollectMinerEarnings(false);
        
        toast({
          title: "Ganhos coletados! 💰",
          description: `Você coletou ${totalEarnings} MT dos seus mineradores!`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao coletar ganhos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  // Calcular mineradores ativos corretamente
  const activeMinerEarnings = userData.miners?.reduce((acc, miner) => {
    if (!miner.isActive && !miner.active) return acc;
    const expiryDate = new Date(miner.expiryDate);
    return expiryDate > new Date() ? acc + (miner.dailyReturn || 0) : acc;
  }, 0) || 0;

  const activeMinerCount = userData.miners?.filter(miner => {
    if (!miner.isActive && !miner.active) return false;
    const expiryDate = new Date(miner.expiryDate);
    return expiryDate > new Date();
  }).length || 0;

  // Calcular ganhos de hoje corretamente
  const todayEarnings = userData.transactions?.filter(t => {
    const transactionDate = new Date(t.date).toDateString();
    const today = new Date().toDateString();
    return transactionDate === today && (t.type === 'task' || t.type === 'mining' || t.type === 'mining_reward');
  }).reduce((sum, t) => sum + t.amount, 0) || 0;

  // Calcular ganhos mensais
  const monthlyEarnings = userData.monthlyEarnings || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Bem-vindo, <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">{userData.username}</span>! 👋
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Acompanhe seus investimentos, mineradores ativos e ganhos em tempo real. Sua jornada para a liberdade financeira começa aqui.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Saldo Atual */}
          <Card className="bg-gradient-to-br from-gold-500/20 to-gold-600/20 border-gold-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold-200 font-medium mb-1">Saldo Atual</p>
                  <p className="text-3xl font-bold text-white">{userData.balance.toFixed(2)} MT</p>
                </div>
                <Coins className="h-12 w-12 text-gold-400" />
              </div>
            </CardContent>
          </Card>

          {/* Ganhos do Dia */}
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 font-medium mb-1">Ganhos do Dia</p>
                  <p className="text-3xl font-bold text-white">{todayEarnings.toFixed(2)} MT</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          {/* Mineradores Ativos */}
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 font-medium mb-1">Mineradores Ativos</p>
                  <p className="text-3xl font-bold text-white">{activeMinerCount}</p>
                </div>
                <Pickaxe className="h-12 w-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          {/* Ganhos Mensais */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 font-medium mb-1">Ganhos Mensais</p>
                  <p className="text-3xl font-bold text-white">{monthlyEarnings.toFixed(2)} MT</p>
                </div>
                <Trophy className="h-12 w-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Daily Performance Chart */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-gold-400" />
                Performance de Ganhos (7 dias)
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
                      dot={{ fill: '#FBB424', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-6 w-6 text-gold-400" />
                Estatísticas Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Ganho Diário</p>
                  <p className="text-2xl font-bold text-green-400">{activeMinerEarnings.toFixed(0)} MT</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Ganho Mensal</p>
                  <p className="text-2xl font-bold text-blue-400">{(activeMinerEarnings * 30).toFixed(0)} MT</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Meta Mensal</span>
                    <span className="text-gray-400">{Math.min(100, (userData.totalEarnings / 10000 * 100)).toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(100, (userData.totalEarnings / 10000 * 100))} className="h-3" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-gold-400">{userData.transactions?.length || 0}</p>
                    <p className="text-xs text-gray-400">Transações</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-blue-400">{(userData.totalEarnings / Math.max(1, userData.balance) * 100).toFixed(1)}%</p>
                    <p className="text-xs text-gray-400">ROI Total</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-purple-400">{Math.floor((Date.now() - Date.parse('2024-01-01')) / (1000 * 60 * 60 * 24))}</p>
                    <p className="text-xs text-gray-400">Dias Ativo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Miner Earnings Collection */}
          {canCollectMinerEarnings && (
            <Card className="bg-gradient-to-br from-gold-900/50 to-gold-800/50 border-gold-600/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="h-6 w-6 text-gold-400" />
                  Coletar Ganhos
                </CardTitle>
                <CardDescription className="text-gold-200">
                  Seus mineradores geraram {activeMinerEarnings} MT hoje!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={collectMinerEarnings}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700 font-semibold h-12"
                >
                  {loading ? 'Coletando...' : `Coletar ${activeMinerEarnings} MT`}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Daily Task */}
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-6 w-6 text-green-400" />
                Tarefa Diária
              </CardTitle>
              <CardDescription className="text-green-200">
                Complete e ganhe 18 MT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Verificar investimentos</span>
                  {!canCompleteTask ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <Button 
                      onClick={completeTask}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Completar
                    </Button>
                  )}
                </div>
                <Progress value={canCompleteTask ? 0 : 100} className="h-2" />
                <p className="text-sm text-green-200">
                  {canCompleteTask ? 'Ganhe 18 MT hoje!' : 'Tarefa concluída hoje!'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Active Miners Summary */}
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Pickaxe className="h-6 w-6 text-blue-400" />
                Resumo dos Mineradores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeMinerCount > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Ativos</span>
                    <span className="text-white font-bold">{activeMinerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Ganho Diário</span>
                    <span className="text-green-400 font-bold">{activeMinerEarnings} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Ganho Mensal</span>
                    <span className="text-gold-400 font-bold">{(activeMinerEarnings * 30).toFixed(0)} MT</span>
                  </div>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                    <a href="/miners">Ver Detalhes</a>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Pickaxe className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Nenhum minerador ativo</p>
                  <Button asChild className="bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700">
                    <a href="/miners">Comprar Minerador</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button asChild className="bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700 h-16 text-lg font-semibold">
            <a href="/miners">🏗️ Comprar Minerador</a>
          </Button>
          <Button asChild variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black h-16 text-lg font-semibold">
            <a href="/deposit">💰 Fazer Depósito</a>
          </Button>
          <Button asChild variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-black h-16 text-lg font-semibold">
            <a href="/withdraw">💸 Sacar Fundos</a>
          </Button>
          <Button asChild variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black h-16 text-lg font-semibold">
            <a href="/history">📊 Ver Histórico</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
