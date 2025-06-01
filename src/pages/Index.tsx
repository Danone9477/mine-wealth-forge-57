
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, Zap, Clock, ArrowUp, Users, Shield, TrendingUp } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-gold-400" />,
      title: "Ganhos Automáticos",
      description: "Mineradores trabalham 24/7, mesmo quando você está dormindo"
    },
    {
      icon: <Clock className="h-8 w-8 text-gold-400" />,
      title: "Retorno Rápido",
      description: "Veja seus lucros crescerem em tempo real"
    },
    {
      icon: <Shield className="h-8 w-8 text-gold-400" />,
      title: "100% Seguro",
      description: "Plataforma protegida e confiável"
    }
  ];

  const miners = [
    { name: "Miner Básico", price: "500 MT", returns: "50 MT/dia", image: "⛏️" },
    { name: "Miner Pro", price: "2,000 MT", returns: "220 MT/dia", image: "⚡" },
    { name: "Miner Elite", price: "10,000 MT", returns: "1,200 MT/dia", image: "💎" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600/20 to-gold-400/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-float mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold rounded-full animate-glow">
              <Coins className="w-10 h-10 text-gray-900" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              GANHE DINHEIRO
            </span>
            <br />
            <span className="text-white">Enquanto Dorme</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Invista em mineradores digitais e <span className="text-gold-400 font-bold">ganhe automaticamente</span> todos os dias.
            <br />
            <span className="text-gold-300">Depósito mínimo: apenas 100 MT</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-gold text-gray-900 hover:bg-gold-500 text-lg px-8 py-4">
                  Ir para Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-gold text-gray-900 hover:bg-gold-500 text-lg px-8 py-4">
                    Começar Agora
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-gray-900 text-lg px-8 py-4">
                    Já tenho conta
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gold-500/20 rounded-lg p-6">
              <div className="text-3xl font-bold text-gold-400 mb-2">1,500+</div>
              <div className="text-gray-300">Usuários Ativos</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gold-500/20 rounded-lg p-6">
              <div className="text-3xl font-bold text-gold-400 mb-2">25,000 MT</div>
              <div className="text-gray-300">Pagos Hoje</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gold-500/20 rounded-lg p-6">
              <div className="text-3xl font-bold text-gold-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Por que escolher nossa plataforma?
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            A forma mais inteligente de fazer seu dinheiro trabalhar para você
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gold-500/50 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center group-hover:animate-float">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Miners Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Nossos Mineradores
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Escolha o minerador ideal para seu orçamento e objetivos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {miners.map((miner, index) => (
              <Card key={index} className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 hover:border-gold-500/50 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 group-hover:animate-float">{miner.image}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{miner.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="text-gold-400 font-bold text-lg">{miner.price}</div>
                    <Badge className="bg-green-600 text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {miner.returns}
                    </Badge>
                  </div>
                  <Button className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500">
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Como Funciona
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-gold w-12 h-12 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Registre-se</h3>
              <p className="text-gray-400">Crie sua conta em menos de 2 minutos</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-gold w-12 h-12 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Deposite</h3>
              <p className="text-gray-400">Mínimo de 100 MT via E-Mola ou M-Pesa</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-gold w-12 h-12 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Compre Mineradores</h3>
              <p className="text-gray-400">Escolha e adquira seus mineradores</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-gold w-12 h-12 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ganhe</h3>
              <p className="text-gray-400">Receba lucros diários automaticamente</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Pronto para começar a ganhar?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Junte-se a milhares de pessoas que já estão ganhando dinheiro automaticamente
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-gold text-gray-900 hover:bg-gold-500 text-lg px-8 py-4">
                  Registrar Agora
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-gray-900 text-lg px-8 py-4">
                  Fazer Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
