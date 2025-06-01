
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, TrendingUp, Star, Crown, Gem, Coins } from 'lucide-react';
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
      dailyReturn: 15,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      icon: Zap,
      color: 'from-blue-400 to-blue-600',
      badge: 'Iniciante',
      description: 'Perfeito para começar sua jornada na mineração',
      features: ['Mineração 24/7', 'Suporte básico', 'ROI em 25 dias']
    },
    {
      id: 'pro',
      name: 'CryptoMiner Pro',
      price: 850,
      dailyReturn: 35,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
      icon: TrendingUp,
      color: 'from-green-400 to-green-600',
      badge: 'Popular',
      description: 'O mais escolhido pelos investidores inteligentes',
      features: ['Mineração otimizada', 'Suporte prioritário', 'ROI em 24 dias']
    },
    {
      id: 'premium',
      name: 'GoldMiner Premium',
      price: 1500,
      dailyReturn: 65,
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
      icon: Star,
      color: 'from-purple-400 to-purple-600',
      badge: 'Avançado',
      description: 'Para quem quer ganhos superiores',
      features: ['Alto desempenho', 'Suporte VIP', 'ROI em 23 dias']
    },
    {
      id: 'elite',
      name: 'EliteMiner Diamond',
      price: 3200,
      dailyReturn: 140,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      icon: Crown,
      color: 'from-gold-400 to-gold-600',
      badge: 'Elite',
      description: 'Ganhos de elite para investidores sérios',
      features: ['Máximo desempenho', 'Gestor pessoal', 'ROI em 22 dias']
    },
    {
      id: 'platinum',
      name: 'PlatinumMiner Ultra',
      price: 5500,
      dailyReturn: 250,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      icon: Gem,
      color: 'from-indigo-400 to-indigo-600',
      badge: 'Platinum',
      description: 'O mais poderoso da nossa linha',
      features: ['Tecnologia exclusiva', 'Consultoria', 'ROI em 22 dias']
    },
    {
      id: 'diamond',
      name: 'DiamondMiner Supreme',
      price: 8000,
      dailyReturn: 380,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
      icon: Coins,
      color: 'from-pink-400 to-pink-600',
      badge: 'Supreme',
      description: 'O investimento dos milionários',
      features: ['Exclusividade total', 'Suporte 24/7', 'ROI em 21 dias']
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

    setLoading(miner.id);
    
    try {
      const newMiner = {
        ...miner,
        purchaseDate: new Date().toISOString(),
        active: true
      };

      await updateUserData({
        balance: userData.balance - miner.price,
        miners: [...(userData.miners || []), newMiner]
      });

      toast({
        title: "Minerador comprado com sucesso! 🎉",
        description: `${miner.name} está agora ativo e gerando ${miner.dailyReturn} MT por dia!`,
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
            Escolha o minerador perfeito e comece a ganhar dinheiro automaticamente
          </p>
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3">
            <Coins className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-semibold">Seu saldo: {userData.balance} MT</span>
          </div>
        </div>

        {/* Miners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {miners.map((miner) => {
            const IconComponent = miner.icon;
            const isOwned = userData.miners?.some(m => m.id === miner.id);
            const canAfford = userData.balance >= miner.price;
            
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
                </div>
                
                <CardHeader>
                  <CardTitle className="text-white text-xl">{miner.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {miner.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                      <p className="text-gray-400 text-sm">Preço</p>
                      <p className="text-2xl font-bold text-white">{miner.price} MT</p>
                    </div>
                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                      <p className="text-gray-400 text-sm">Ganho/Dia</p>
                      <p className="text-2xl font-bold text-green-400">{miner.dailyReturn} MT</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {miner.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm">{feature}</span>
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
                       `Comprar por ${miner.price} MT`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Mineração 24/7</h3>
              <p className="text-gray-300">Seus mineradores trabalham 24 horas por dia, gerando renda automaticamente</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">ROI Garantido</h3>
              <p className="text-gray-300">Retorno do investimento entre 21-25 dias, com ganhos contínuos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold-900/50 to-gold-800/50 border-gold-700">
            <CardContent className="p-6 text-center">
              <Crown className="h-12 w-12 text-gold-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Suporte Premium</h3>
              <p className="text-gray-300">Suporte especializado para maximizar seus ganhos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Miners;
