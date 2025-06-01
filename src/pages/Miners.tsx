
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, TrendingUp, Star, Crown, Gem, Coins, Clock, Calculator } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Miners = () => {
  const { userData, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const miners = [
    {
      id: 'basic',
      name: 'MineCrypto Basic',
      price: 380,
      dailyReturn: Math.round((380 * 3.5) / 30), // ~44 MT/dia
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      icon: Zap,
      color: 'from-blue-400 to-blue-600',
      badge: 'Iniciante',
      description: 'Perfeito para começar sua jornada na mineração',
      features: ['Mineração 24/7', 'Suporte básico', 'Retorno 350% em 30 dias', 'Ganho total: 1,330 MT']
    },
    {
      id: 'starter',
      name: 'CryptoMiner Starter',
      price: 500,
      dailyReturn: Math.round((500 * 3.5) / 30), // ~58 MT/dia
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
      icon: TrendingUp,
      color: 'from-green-400 to-green-600',
      badge: 'Popular',
      description: 'Ideal para investidores inteligentes',
      features: ['Mineração otimizada', 'Suporte prioritário', 'Retorno 350% em 30 dias', 'Ganho total: 1,750 MT']
    },
    {
      id: 'pro',
      name: 'ProMiner Advanced',
      price: 650,
      dailyReturn: Math.round((650 * 3.5) / 30), // ~76 MT/dia
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
      icon: Star,
      color: 'from-purple-400 to-purple-600',
      badge: 'Avançado',
      description: 'Para quem quer ganhos consistentes',
      features: ['Alto desempenho', 'Suporte VIP', 'Retorno 350% em 30 dias', 'Ganho total: 2,275 MT']
    },
    {
      id: 'premium',
      name: 'GoldMiner Premium',
      price: 800,
      dailyReturn: Math.round((800 * 3.5) / 30), // ~93 MT/dia
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      icon: Crown,
      color: 'from-gold-400 to-gold-600',
      badge: 'Premium',
      description: 'Ganhos premium garantidos',
      features: ['Máximo desempenho', 'Gestor pessoal', 'Retorno 350% em 30 dias', 'Ganho total: 2,800 MT']
    },
    {
      id: 'elite',
      name: 'EliteMiner Diamond',
      price: 1000,
      dailyReturn: Math.round((1000 * 3.5) / 30), // ~117 MT/dia
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      icon: Gem,
      color: 'from-indigo-400 to-indigo-600',
      badge: 'Elite',
      description: 'Para investidores sérios',
      features: ['Tecnologia exclusiva', 'Consultoria premium', 'Retorno 350% em 30 dias', 'Ganho total: 3,500 MT']
    },
    {
      id: 'platinum',
      name: 'PlatinumMiner Ultra',
      price: 1200,
      dailyReturn: Math.round((1200 * 3.5) / 30), // ~140 MT/dia
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
      icon: Coins,
      color: 'from-pink-400 to-pink-600',
      badge: 'Platinum',
      description: 'O mais poderoso da categoria',
      features: ['Exclusividade total', 'Suporte 24/7', 'Retorno 350% em 30 dias', 'Ganho total: 4,200 MT']
    },
    {
      id: 'supreme',
      name: 'SupremeMiner Pro',
      price: 1500,
      dailyReturn: Math.round((1500 * 3.5) / 30), // ~175 MT/dia
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
      icon: Star,
      color: 'from-red-400 to-red-600',
      badge: 'Supreme',
      description: 'Ganhos supremos assegurados',
      features: ['Performance superior', 'Suporte VIP 24/7', 'Retorno 350% em 30 dias', 'Ganho total: 5,250 MT']
    },
    {
      id: 'master',
      name: 'MasterMiner Ultimate',
      price: 1800,
      dailyReturn: Math.round((1800 * 3.5) / 30), // ~210 MT/dia
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
      icon: Crown,
      color: 'from-orange-400 to-orange-600',
      badge: 'Master',
      description: 'Para mestres dos investimentos',
      features: ['Tecnologia avançada', 'Gestor dedicado', 'Retorno 350% em 30 dias', 'Ganho total: 6,300 MT']
    },
    {
      id: 'legend',
      name: 'LegendMiner Exclusive',
      price: 2500,
      dailyReturn: Math.round((2500 * 3.5) / 30), // ~292 MT/dia
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      icon: Gem,
      color: 'from-emerald-400 to-emerald-600',
      badge: 'Legend',
      description: 'Exclusivo para lendas',
      features: ['Acesso exclusivo', 'Consultoria personalizada', 'Retorno 350% em 30 dias', 'Ganho total: 8,750 MT']
    },
    {
      id: 'diamond',
      name: 'DiamondMiner Supreme',
      price: 8000,
      dailyReturn: Math.round((8000 * 3.5) / 30), // ~933 MT/dia
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
      icon: Coins,
      color: 'from-cyan-400 to-cyan-600',
      badge: 'Diamond',
      description: 'O investimento dos milionários',
      features: ['Máxima exclusividade', 'Suporte premium 24/7', 'Retorno 350% em 30 dias', 'Ganho total: 28,000 MT']
    }
  ];

  const buyMiner = async (miner: typeof miners[0]) => {
    if (!userData) return;
    
    if (userData.balance < miner.price) {
      toast({
        title: "Saldo insuficiente",
        description: "Você precisa fazer um depósito para comprar este minerador",
        variant: "destructive",
      });
      navigate('/deposit');
      return;
    }

    // Check if user already owns this miner
    const alreadyOwned = userData.miners?.some(m => m.id === miner.id && m.active);
    if (alreadyOwned) {
      toast({
        title: "Minerador já ativo",
        description: "Você já possui este minerador ativo",
        variant: "destructive",
      });
      return;
    }

    setLoading(miner.id);
    
    try {
      const now = new Date();
      const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias

      const newMiner = {
        ...miner,
        purchaseDate: now.toISOString(),
        expiryDate: expiryDate.toISOString(),
        active: true,
        totalReturn: miner.price * 3.5,
        daysRemaining: 30,
        lastCollection: now.toISOString()
      };

      // Create purchase transaction
      const transaction = {
        id: Date.now().toString(),
        type: 'purchase' as const,
        amount: -miner.price, // Negative because it's a purchase
        status: 'success' as const,
        date: now.toISOString(),
        description: `Compra do minerador ${miner.name}`,
        minerInfo: {
          name: miner.name,
          dailyReturn: miner.dailyReturn,
          duration: '30 dias'
        }
      };

      // Update user data: debit balance and add miner
      await updateUserData({
        balance: userData.balance - miner.price,
        miners: [...(userData.miners || []), newMiner],
        transactions: [...(userData.transactions || []), transaction]
      });

      toast({
        title: "Minerador comprado com sucesso! 🎉",
        description: `${miner.name} está ativo! Ganhe ${miner.dailyReturn} MT/dia por 30 dias!`,
      });
    } catch (error) {
      toast({
        title: "Erro na compra",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando mineradores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Mineradores Premium
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Retorno garantido de 350% em 30 dias! Escolha seu minerador e comece a ganhar
          </p>
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3">
            <Coins className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-semibold">Seu saldo: {userData.balance} MT</span>
          </div>
        </div>

        {/* Active Miners Section */}
        {userData.miners && userData.miners.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Seus Mineradores Ativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.miners.filter(m => m.active).map((miner, index) => {
                const IconComponent = miner.icon || Zap;
                const daysLeft = Math.max(0, Math.floor((new Date(miner.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
                const progressPercentage = ((30 - daysLeft) / 30) * 100;
                
                return (
                  <Card key={index} className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{miner.name}</CardTitle>
                        <Badge className="bg-green-500 text-white">Ativo</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <p className="text-gray-400 text-xs">Ganho/Dia</p>
                          <p className="text-lg font-bold text-green-400">{miner.dailyReturn} MT</p>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <p className="text-gray-400 text-xs">Dias Restantes</p>
                          <p className="text-lg font-bold text-white">{daysLeft}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progresso</span>
                          <span className="text-white">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-400">
                          Comprado em: {new Date(miner.purchaseDate).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-400">
                          Expira em: {new Date(miner.expiryDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Miners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {miners.map((miner) => {
            const IconComponent = miner.icon;
            const isOwned = userData.miners?.some(m => m.id === miner.id && m.active);
            const canAfford = userData.balance >= miner.price;
            const totalReturn = miner.price * 3.5;
            const profit = totalReturn - miner.price;
            
            return (
              <Card key={miner.id} className="bg-gray-800 border-gray-700 overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <img 
                    src={miner.image} 
                    alt={miner.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${miner.color} opacity-80`}></div>
                  <div className="absolute top-4 right-4">
                    <Badge className={`bg-gradient-to-r ${miner.color} text-white border-0`}>
                      {miner.badge}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/50 text-white border-0">
                      +{Math.round(((totalReturn - miner.price) / miner.price) * 100)}%
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">{miner.name}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    {miner.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                      <p className="text-gray-400 text-xs">Investimento</p>
                      <p className="text-lg font-bold text-white">{miner.price} MT</p>
                    </div>
                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                      <p className="text-gray-400 text-xs">Ganho/Dia</p>
                      <p className="text-lg font-bold text-green-400">{miner.dailyReturn} MT</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gradient-to-r from-gold-900/30 to-gold-800/30 rounded-lg border border-gold-700/30">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="h-3 w-3 text-gold-400" />
                        <p className="text-gold-400 text-xs">Duração</p>
                      </div>
                      <p className="text-sm font-bold text-white">30 dias</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-r from-green-900/30 to-green-800/30 rounded-lg border border-green-700/30">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Calculator className="h-3 w-3 text-green-400" />
                        <p className="text-green-400 text-xs">Lucro</p>
                      </div>
                      <p className="text-sm font-bold text-white">{profit} MT</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {miner.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gold-400 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-300 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {isOwned ? (
                    <Button disabled className="w-full bg-green-600 text-white">
                      ✓ Minerador Ativo
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => buyMiner(miner)}
                      disabled={!canAfford || loading === miner.id}
                      className={`w-full ${canAfford 
                        ? `bg-gradient-to-r ${miner.color} hover:opacity-90` 
                        : 'bg-gray-600 cursor-not-allowed'
                      } text-white font-semibold`}
                    >
                      {loading === miner.id ? 'Comprando...' : 
                       !canAfford ? 'Saldo Insuficiente' : 
                       `Comprar ${miner.price} MT`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ROI Info Section */}
        <div className="mt-16 bg-gradient-to-r from-gold-900/20 to-gold-800/20 border border-gold-700/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              <span className="text-gold-400">350% de Retorno</span> Garantido em 30 Dias!
            </h2>
            <p className="text-gray-300 text-lg">
              Todos os mineradores oferecem retorno fixo de 3.5x do valor investido
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
              <CardContent className="p-6 text-center">
                <Calculator className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Cálculo Simples</h3>
                <p className="text-gray-300">Invista X, receba 3.5X de volta em 30 dias</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">30 Dias Fixos</h3>
                <p className="text-gray-300">Duração fixa de 30 dias para todos os planos</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gold-900/50 to-gold-800/50 border-gold-700">
              <CardContent className="p-6 text-center">
                <Crown className="h-12 w-12 text-gold-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Ganhos Diários</h3>
                <p className="text-gray-300">Receba seus ganhos automaticamente todo dia</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Miners;
