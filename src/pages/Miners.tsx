import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Pickaxe, Zap, Clock, Shield, TrendingUp, Star, Crown, Diamond, Gem, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { addMinerToUser, unlockWithdrawalsForUser } from '@/services/minerService';

const Miners = () => {
  const { userData, updateUserData } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const minerTypes = [
    {
      id: 'basic',
      name: 'MineCrypto Basic',
      price: 380,
      dailyReturn: 44,
      duration: 30,
      description: 'Perfeito para começar sua jornada na mineração',
      roi: '350%',
      icon: Pickaxe,
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-900/20 to-blue-800/20',
      totalReturn: 1330,
      features: ['Mineração 24/7', 'Suporte básico', 'Retorno 350% em 30 dias', 'Ganho total: 1.330 MT']
    },
    {
      id: 'advanced',
      name: 'MineCrypto Advanced',
      price: 760,
      dailyReturn: 88,
      duration: 30,
      description: 'Para mineradores experientes',
      roi: '350%',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-900/20 to-purple-800/20',
      totalReturn: 2660,
      features: ['Mineração 24/7', 'Suporte prioritário', 'Retorno 350% em 30 dias', 'Ganho total: 2.660 MT']
    },
    {
      id: 'premium',
      name: 'MineCrypto Premium',
      price: 1140,
      dailyReturn: 133,
      duration: 30,
      description: 'Alta performance e retorno garantido',
      roi: '350%',
      icon: Star,
      color: 'from-gold-500 to-gold-600',
      bgGradient: 'from-gold-900/20 to-gold-800/20',
      totalReturn: 3990,
      features: ['Mineração 24/7', 'Suporte VIP', 'Retorno 350% em 30 dias', 'Ganho total: 3.990 MT']
    },
    {
      id: 'elite',
      name: 'MineCrypto Elite',
      price: 1900,
      dailyReturn: 221,
      duration: 30,
      description: 'Para investidores de elite',
      roi: '350%',
      icon: Crown,
      color: 'from-red-500 to-red-600',
      bgGradient: 'from-red-900/20 to-red-800/20',
      totalReturn: 6650,
      features: ['Mineração 24/7', 'Suporte exclusivo', 'Retorno 350% em 30 dias', 'Ganho total: 6.650 MT']
    },
    {
      id: 'diamond',
      name: 'MineCrypto Diamond',
      price: 2850,
      dailyReturn: 332,
      duration: 30,
      description: 'Máximo poder de mineração',
      roi: '350%',
      icon: Diamond,
      color: 'from-cyan-500 to-cyan-600',
      bgGradient: 'from-cyan-900/20 to-cyan-800/20',
      totalReturn: 9975,
      features: ['Mineração 24/7', 'Suporte VIP Plus', 'Retorno 350% em 30 dias', 'Ganho total: 9.975 MT']
    },
    {
      id: 'platinum',
      name: 'MineCrypto Platinum',
      price: 3800,
      dailyReturn: 443,
      duration: 30,
      description: 'Nível platinum de mineração',
      roi: '350%',
      icon: Gem,
      color: 'from-gray-400 to-gray-600',
      bgGradient: 'from-gray-900/20 to-gray-800/20',
      totalReturn: 13300,
      features: ['Mineração 24/7', 'Suporte premium', 'Retorno 350% em 30 dias', 'Ganho total: 13.300 MT']
    },
    {
      id: 'gold',
      name: 'MineCrypto Gold',
      price: 4750,
      dailyReturn: 553,
      duration: 30,
      description: 'Mineração de alto rendimento',
      roi: '350%',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-900/20 to-yellow-800/20',
      totalReturn: 16625,
      features: ['Mineração 24/7', 'Suporte gold', 'Retorno 350% em 30 dias', 'Ganho total: 16.625 MT']
    },
    {
      id: 'master',
      name: 'MineCrypto Master',
      price: 5700,
      dailyReturn: 664,
      duration: 30,
      description: 'Para mestres da mineração',
      roi: '350%',
      icon: Crown,
      color: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-900/20 to-indigo-800/20',
      totalReturn: 19950,
      features: ['Mineração 24/7', 'Suporte master', 'Retorno 350% em 30 dias', 'Ganho total: 19.950 MT']
    },
    {
      id: 'legendary',
      name: 'MineCrypto Legendary',
      price: 7600,
      dailyReturn: 885,
      duration: 30,
      description: 'Status lendário de mineração',
      roi: '350%',
      icon: Diamond,
      color: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-900/20 to-orange-800/20',
      totalReturn: 26600,
      features: ['Mineração 24/7', 'Suporte lendário', 'Retorno 350% em 30 dias', 'Ganho total: 26.600 MT']
    },
    {
      id: 'ultimate',
      name: 'MineCrypto Ultimate',
      price: 8500,
      dailyReturn: 991,
      duration: 30,
      description: 'O máximo em mineração de criptomoedas',
      roi: '350%',
      icon: Gem,
      color: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-900/20 to-pink-800/20',
      totalReturn: 29750,
      features: ['Mineração 24/7', 'Suporte ultimate', 'Retorno 350% em 30 dias', 'Ganho total: 29.750 MT']
    }
  ];

  const handlePurchaseMiner = async (miner: any) => {
    if (!userData) {
      toast({
        title: "Erro de autenticação",
        description: "Por favor, faça login novamente",
        variant: "destructive",
      });
      return;
    }

    if (userData.balance < miner.price) {
      toast({
        title: "Saldo insuficiente",
        description: `Você precisa de ${miner.price} MT para comprar este minerador`,
        variant: "destructive",
      });
      return;
    }

    setLoading(miner.id);

    try {
      const newMiner = await addMinerToUser(userData.uid, miner);
      
      // Criar transação de compra
      const purchaseTransaction = {
        id: Date.now().toString(),
        type: 'purchase' as const,
        amount: -miner.price,
        status: 'success' as const,
        date: new Date().toISOString(),
        description: `Compra do minerador ${miner.name}`,
        minerName: miner.name
      };

      const wasWithdrawalBlocked = !userData.canWithdraw && (userData.miners?.length || 0) === 0;

      // Atualizar dados do usuário
      await updateUserData({
        balance: userData.balance - miner.price,
        miners: [...(userData.miners || []), newMiner],
        transactions: [...(userData.transactions || []), purchaseTransaction],
        canWithdraw: true // Liberar saques automaticamente
      });

      // Se era a primeira compra, liberar saques no Firebase também
      if (wasWithdrawalBlocked) {
        try {
          await unlockWithdrawalsForUser(userData.uid);
        } catch (error) {
          console.log('Aviso: Não foi possível atualizar saques no Firebase:', error);
        }
      }

      toast({
        title: "Minerador comprado com sucesso! 🎉",
        description: `${miner.name} foi adicionado à sua conta. ${wasWithdrawalBlocked ? 'Saques foram liberados!' : ''}`,
      });

    } catch (error) {
      console.error('Erro na compra:', error);
      toast({
        title: "Erro na compra",
        description: "Tente novamente ou contacte o suporte",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const calculateDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const activeMiners = userData?.miners?.filter(m => m.isActive) || [];
  const totalDailyEarnings = activeMiners.reduce((sum, miner) => sum + miner.dailyReturn, 0);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                Mineradores Premium
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Invista em nossos mineradores de alta performance e obtenha retornos garantidos de 350% em 30 dias. 
              Tecnologia avançada para máxima rentabilidade.
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 justify-center">
                  <Coins className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-green-400 font-semibold text-lg">Saldo Atual</p>
                    <p className="text-2xl font-bold text-white">{userData.balance.toFixed(2)} MT</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 justify-center">
                  <Pickaxe className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-blue-400 font-semibold text-lg">Mineradores Ativos</p>
                    <p className="text-2xl font-bold text-white">{activeMiners.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 backdrop-blur-sm border border-gold-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 justify-center">
                  <TrendingUp className="h-8 w-8 text-gold-400" />
                  <div>
                    <p className="text-gold-400 font-semibold text-lg">Ganho Diário</p>
                    <p className="text-2xl font-bold text-white">{totalDailyEarnings.toFixed(0)} MT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Active Miners */}
        {activeMiners.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Seus Mineradores Ativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMiners.map((miner, index) => {
                const daysRemaining = calculateDaysRemaining(miner.expiryDate);
                const totalDays = 30;
                const progressPercentage = ((totalDays - daysRemaining) / totalDays) * 100;
                
                return (
                  <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gold-500/50 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{miner.name}</CardTitle>
                        <Badge className="bg-green-500 text-white">Ativo</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progresso</span>
                          <span className="text-gray-400">{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Ganho Diário</p>
                          <p className="text-green-400 font-semibold">{miner.dailyReturn} MT</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Dias Restantes</p>
                          <p className="text-blue-400 font-semibold">{daysRemaining} dias</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Total Ganho</p>
                          <p className="text-gold-400 font-semibold">{(miner.totalEarned || 0).toFixed(2)} MT</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Investimento</p>
                          <p className="text-white font-semibold">{miner.price} MT</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Miners */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Mineradores Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {minerTypes.map((miner) => {
              const IconComponent = miner.icon;
              const isLoading = loading === miner.id;
              const canAfford = userData.balance >= miner.price;
              
              return (
                <Card key={miner.id} className={`bg-gradient-to-br ${miner.bgGradient} backdrop-blur-sm border-gray-700 hover:border-gold-500/50 transition-all duration-300 transform hover:scale-105 ${!canAfford ? 'opacity-75' : ''}`}>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-full bg-gradient-to-r ${miner.color} shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl mb-2">{miner.name}</CardTitle>
                    <CardDescription className="text-gray-300">{miner.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Investment and Daily Return */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-sm mb-1">Investimento</p>
                        <p className="text-2xl font-bold text-white">{miner.price} MT</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-sm mb-1">Ganho/Dia</p>
                        <p className="text-2xl font-bold text-green-400">{miner.dailyReturn} MT</p>
                      </div>
                    </div>

                    {/* Duration and Total Return */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-sm mb-1">Duração</p>
                        <p className="text-xl font-bold text-blue-400">30 dias</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-sm mb-1">Lucro</p>
                        <p className="text-xl font-bold text-gold-400">{miner.totalReturn.toLocaleString()} MT</p>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-2">
                      {miner.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* ROI Badge */}
                    <div className="text-center">
                      <Badge className={`bg-gradient-to-r ${miner.color} text-white px-4 py-2 text-lg`}>
                        ROI {miner.roi}
                      </Badge>
                    </div>
                    
                    {/* Purchase Button */}
                    <Button
                      onClick={() => handlePurchaseMiner(miner)}
                      disabled={isLoading || !canAfford}
                      className={`w-full h-12 font-semibold text-lg ${
                        canAfford
                          ? `bg-gradient-to-r ${miner.color} text-white hover:opacity-90 shadow-lg`
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Comprando...
                        </div>
                      ) : !canAfford ? (
                        'Saldo Insuficiente'
                      ) : (
                        `Comprar ${miner.price} MT`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-green-900/30 to-green-800/30 border-green-700/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="h-10 w-10 text-green-400" />
                <h3 className="text-2xl font-bold text-white">Garantia de Segurança Total</h3>
              </div>
              <p className="text-gray-300 mb-6 text-lg">
                Todos os mineradores são processados automaticamente com tecnologia blockchain avançada. 
                Os ganhos são creditados diariamente com garantia de retorno de 350% em 30 dias.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                  <div className="text-gray-300">Automático</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">350%</div>
                  <div className="text-gray-300">ROI Garantido</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">30</div>
                  <div className="text-gray-300">Dias de Duração</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
                  <div className="text-gray-300">Funcionamento</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Miners;
