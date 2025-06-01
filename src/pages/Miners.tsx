import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Pickaxe, Coins, Clock, TrendingUp, Zap, Shield, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { addMinerToUser } from '@/services/minerService';

const Miners = () => {
  const { userData, updateUserData } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const minerTypes = [
    {
      id: 'basic',
      name: 'Minerador Básico',
      price: 50,
      dailyReturn: 2.5,
      duration: 30,
      description: 'Ideal para iniciantes',
      roi: '150%',
      icon: Pickaxe,
      color: 'from-blue-500 to-blue-600',
      features: ['2.5 MT por dia', '30 dias de mineração', 'ROI: 150%', 'Suporte básico']
    },
    {
      id: 'advanced',
      name: 'Minerador Avançado',
      price: 250,
      dailyReturn: 15,
      duration: 30,
      description: 'Para investidores experientes',
      roi: '180%',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      features: ['15 MT por dia', '30 dias de mineração', 'ROI: 180%', 'Suporte prioritário']
    },
    {
      id: 'premium',
      name: 'Minerador Premium',
      price: 500,
      dailyReturn: 35,
      duration: 30,
      description: 'Máximo retorno garantido',
      roi: '210%',
      icon: Star,
      color: 'from-gold-500 to-gold-600',
      features: ['35 MT por dia', '30 dias de mineração', 'ROI: 210%', 'Suporte VIP']
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
      // Criar o novo minerador ativo
      const newMiner = await addMinerToUser(userData.uid, miner);
      
      // Atualizar dados do usuário
      const updatedMiners = [...(userData.miners || []), newMiner];
      const newBalance = userData.balance - miner.price;
      
      // Criar transação de compra
      const transaction = {
        id: Date.now().toString(),
        type: 'purchase' as const,
        amount: miner.price,
        status: 'success' as const,
        date: new Date().toISOString(),
        description: `Compra de ${miner.name}`,
        minerDetails: {
          name: miner.name,
          dailyReturn: miner.dailyReturn,
          duration: miner.duration
        }
      };

      const updatedTransactions = [...(userData.transactions || []), transaction];

      // Habilitar saques automaticamente ao comprar minerador
      await updateUserData({
        balance: newBalance,
        miners: updatedMiners,
        transactions: updatedTransactions,
        canWithdraw: true
      });

      toast({
        title: "🎉 Minerador comprado com sucesso!",
        description: `${miner.name} está ativo e começará a gerar ${miner.dailyReturn} MT por dia. Saques liberados!`,
      });

    } catch (error) {
      console.error('Erro ao comprar minerador:', error);
      toast({
        title: "Erro na compra",
        description: "Erro ao processar a compra do minerador",
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
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
              Mineradores Ativos Premium
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Invista em mineradores e ganhe retornos diários garantidos por 30 dias
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 justify-center">
                <Coins className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-semibold">Saldo: {userData.balance.toFixed(2)} MT</span>
              </div>
            </div>
            
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 justify-center">
                <Pickaxe className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-semibold">Mineradores Ativos: {activeMiners.length}</span>
              </div>
            </div>
            
            <div className="bg-gold-500/20 border border-gold-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 justify-center">
                <TrendingUp className="h-5 w-5 text-gold-400" />
                <span className="text-gold-400 font-semibold">Ganho Diário: {totalDailyEarnings} MT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Miners */}
        {activeMiners.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Seus Mineradores Ativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMiners.map((miner, index) => {
                const daysRemaining = calculateDaysRemaining(miner.expiryDate);
                const totalDays = 30;
                const progressPercentage = ((totalDays - daysRemaining) / totalDays) * 100;
                
                return (
                  <Card key={index} className="bg-gray-800 border-gray-700">
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
                          <p className="text-gray-400">Valor Investido</p>
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
          <h2 className="text-2xl font-bold text-white mb-6">Mineradores Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {minerTypes.map((miner) => {
              const IconComponent = miner.icon;
              const isLoading = loading === miner.id;
              const canAfford = userData.balance >= miner.price;
              
              return (
                <Card key={miner.id} className={`bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 ${!canAfford ? 'opacity-75' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${miner.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge className={`bg-gradient-to-r ${miner.color} text-white`}>
                        ROI {miner.roi}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-xl">{miner.name}</CardTitle>
                    <CardDescription className="text-gray-400">{miner.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{miner.price} MT</div>
                      <div className="text-green-400 font-semibold">{miner.dailyReturn} MT/dia</div>
                    </div>
                    
                    <div className="space-y-3">
                      {miner.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-400 font-medium">Projeção de 30 dias</span>
                      </div>
                      <div className="text-2xl font-bold text-green-400">
                        {(miner.dailyReturn * 30).toFixed(0)} MT
                      </div>
                      <div className="text-sm text-gray-400">
                        Retorno total: {miner.price + (miner.dailyReturn * 30)} MT
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handlePurchaseMiner(miner)}
                      disabled={isLoading || !canAfford}
                      className={`w-full h-12 font-semibold ${
                        canAfford
                          ? `bg-gradient-to-r ${miner.color} text-white hover:opacity-90`
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Comprando...
                        </div>
                      ) : !canAfford ? (
                        'Saldo Insuficiente'
                      ) : (
                        `Comprar por ${miner.price} MT`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-green-900/50 to-green-800/50 border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="h-8 w-8 text-green-400" />
                <h3 className="text-xl font-bold text-white">Garantia de Segurança</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Todos os mineradores são processados automaticamente e os ganhos são creditados diariamente. 
                Sistema totalmente automatizado com garantia de retorno por 30 dias.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">100%</div>
                  <div className="text-sm text-gray-400">Automático</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">30</div>
                  <div className="text-sm text-gray-400">Dias Garantidos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">24/7</div>
                  <div className="text-sm text-gray-400">Funcionamento</div>
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
