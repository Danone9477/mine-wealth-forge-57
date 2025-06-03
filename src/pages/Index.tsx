import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Coins, TrendingUp, Shield, Users, Star, CheckCircle, Smartphone, Wallet, Globe, Award, Target, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Coins,
      title: "Mineração Inteligente",
      description: "Algoritmos avançados de mineração que maximizam seus retornos diários",
      color: "from-gold-500 to-gold-600"
    },
    {
      icon: TrendingUp,
      title: "Retornos Consistentes",
      description: "Ganhos diários garantidos com nossa tecnologia de ponta",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Sua segurança é nossa prioridade com criptografia de nível militar",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Programa de Afiliados",
      description: "Ganhe comissões convidando amigos para nossa plataforma",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      location: "Maputo",
      text: "Em 3 meses já recuperei meu investimento inicial. Incrível!",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "João Santos",
      location: "Beira",
      text: "Plataforma confiável, saques rápidos. Recomendo!",
      rating: 5,
      avatar: "👨‍💻"
    },
    {
      name: "Ana Costa",
      location: "Nampula",
      text: "Suporte excelente e ganhos consistentes todos os dias.",
      rating: 5,
      avatar: "👩‍🎓"
    }
  ];

  const stats = [
    { label: "Usuários Ativos", value: "15,000+", icon: Users },
    { label: "MT Distribuídos", value: "2.5M", icon: Coins },
    { label: "Taxa de Satisfação", value: "98%", icon: Star },
    { label: "Países", value: "5+", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="mb-8">
              <Badge className="bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold px-4 py-2 text-sm">
                🏆 #1 Plataforma de Mineração em Moçambique
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Mine Wealth
              </span>
              <br />
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Sua Riqueza Digital
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transforme seus <span className="text-gold-400 font-semibold">Meticais</span> em uma fonte de renda passiva. 
              Mineração inteligente com retornos diários garantidos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {!user ? (
                <>
                  <Button asChild size="lg" className="bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700 font-semibold text-lg px-8 py-4">
                    <a href="/register">
                      Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black font-semibold text-lg px-8 py-4">
                    <a href="/login">Fazer Login</a>
                  </Button>
                </>
              ) : (
                <Button asChild size="lg" className="bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700 font-semibold text-lg px-8 py-4">
                  <a href="/dashboard">
                    Ir para Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-gold-500/20 to-gold-600/20 rounded-full mb-3">
                      <IconComponent className="h-6 w-6 text-gold-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Por que escolher <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Mine Wealth</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Nossa plataforma oferece as melhores oportunidades de investimento em mineração digital de Moçambique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Como <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Funciona</span>
            </h2>
            <p className="text-xl text-gray-300">Comece a ganhar em 3 passos simples</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6 relative">
                <span className="text-2xl font-bold text-white">1</span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Registre-se</h3>
              <p className="text-gray-300">Crie sua conta gratuita em menos de 2 minutos. É rápido e seguro.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6 relative">
                <span className="text-2xl font-bold text-white">2</span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold-400 rounded-full flex items-center justify-center">
                  <Coins className="h-4 w-4 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Deposite Fundos</h3>
              <p className="text-gray-300">Faça um depósito via <span className="text-green-400 font-semibold">M-Pesa</span> ou <span className="text-blue-400 font-semibold">E-Mola</span>. Valor mínimo: 100 MT.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-6 relative">
                <span className="text-2xl font-bold text-white">3</span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold-400 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Comece a Ganhar</h3>
              <p className="text-gray-300">Compre mineradores e receba ganhos diários automáticos. Simples assim!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Pagamentos</span> Seguros
            </h2>
            <p className="text-xl text-gray-300">Métodos de pagamento populares em Moçambique</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6">
                  <Smartphone className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">M-Pesa</h3>
                <p className="text-green-200 mb-6">Pagamentos rápidos e seguros via M-Pesa. Disponível 24/7.</p>
                <Badge className="bg-green-600 text-white px-4 py-2">Ativo</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6">
                  <Wallet className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">E-Mola</h3>
                <p className="text-blue-200 mb-6">Integração completa com E-Mola para máxima conveniência.</p>
                <Badge className="bg-blue-600 text-white px-4 py-2">Ativo</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              O que nossos <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">clientes</span> dizem
            </h2>
            <p className="text-xl text-gray-300">Histórias reais de sucesso de nossos investidores</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gold-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600/10 to-purple-600/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">começar</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a milhares de moçambicanos que já estão construindo sua riqueza digital
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Button asChild size="lg" className="bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700 font-semibold text-lg px-8 py-4">
                  <a href="/register">
                    Registrar Agora <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black font-semibold text-lg px-8 py-4">
                  <a href="/login">Fazer Login</a>
                </Button>
              </>
            ) : (
              <Button asChild size="lg" className="bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700 font-semibold text-lg px-8 py-4">
                <a href="/dashboard">
                  Acessar Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 text-gold-400" />
              <span className="text-white font-semibold">100% Seguro</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Zap className="h-8 w-8 text-gold-400" />
              <span className="text-white font-semibold">Ganhos Diários</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Award className="h-8 w-8 text-gold-400" />
              <span className="text-white font-semibold">Suporte 24/7</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
