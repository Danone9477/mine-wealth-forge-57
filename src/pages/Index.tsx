
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Coins, TrendingUp, Shield, Zap, Crown, Star, Users, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: "João Silva",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      text: "Já ganhei mais de 15.000 MT em apenas 2 meses! Melhor investimento que já fiz.",
      earnings: "15.234 MT"
    },
    {
      name: "Maria Santos",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=60&h=60&fit=crop&crop=face",
      text: "Sistema automático incrível! Ganho dinheiro até dormindo com meus mineradores.",
      earnings: "8.750 MT"
    },
    {
      name: "Carlos Pereira",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      text: "ROI em menos de 3 semanas! Já comprei 4 mineradores premium.",
      earnings: "22.100 MT"
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Ganhos Automáticos",
      description: "Seus mineradores trabalham 24/7 gerando renda passiva",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Tecnologia Firebase e criptografia de ponta",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Zap,
      title: "Processamento Instantâneo",
      description: "Depósitos e saques processados em tempo real",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Crown,
      title: "Suporte Premium",
      description: "Atendimento especializado para maximizar ganhos",
      color: "from-gold-400 to-gold-600"
    }
  ];

  const stats = [
    { label: "Usuários Ativos", value: "12.847", icon: Users },
    { label: "Mineradores Vendidos", value: "45.230", icon: Zap },
    { label: "Total Pago (MT)", value: "2.8M", icon: Coins },
    { label: "Uptime", value: "99.9%", icon: Clock }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop" 
            alt="Mining Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <Badge className="mb-6 bg-gradient-gold text-gray-900 text-lg px-6 py-2 animate-pulse">
                🚀 Nova Era da Mineração Digital
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                  GANHE
                </span>
                <br />
                <span className="text-white">DINHEIRO</span>
                <br />
                <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                  DORMINDO
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                Mineradores automatizados que geram <span className="text-gold-400 font-bold">renda passiva 24/7</span>. 
                Comece com apenas <span className="text-green-400 font-bold">100 MT</span> e veja seu dinheiro crescer!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {user ? (
                  <Button asChild size="lg" className="bg-gradient-gold text-gray-900 hover:bg-gold-500 text-xl px-8 py-6 animate-glow">
                    <Link to="/dashboard">
                      Acessar Dashboard <ArrowRight className="ml-2 h-6 w-6" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="bg-gradient-gold text-gray-900 hover:bg-gold-500 text-xl px-8 py-6 animate-glow">
                      <Link to="/register">
                        Começar Agora <ArrowRight className="ml-2 h-6 w-6" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-gray-900 text-xl px-8 py-6">
                      <Link to="/login">
                        Fazer Login
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Earning Counter */}
              <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-green-400 font-bold text-lg">GANHOS EM TEMPO REAL:</p>
                    <p className="text-3xl font-bold text-white">+127.450 MT hoje</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop" 
                alt="Crypto Mining"
                className="rounded-2xl shadow-2xl animate-float"
              />
              <div className="absolute -top-6 -right-6 bg-gradient-gold rounded-2xl p-4 animate-glow">
                <Coins className="h-8 w-8 text-gray-900" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-4 animate-glow">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-gray-900" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Por que escolher
              </span>
              <br />
              <span className="text-white">MineWealth Forge?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A plataforma mais avançada e segura para investir em mineração automatizada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:scale-105 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full mb-6 group-hover:animate-pulse`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              O que nossos <span className="text-gold-400">investidores</span> dizem
            </h2>
            <p className="text-gray-400 text-lg">Histórias reais de sucesso na nossa plataforma</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700">
            <div 
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 p-8">
                  <div className="text-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full mx-auto mb-6 border-4 border-gold-400"
                    />
                    <p className="text-xl text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                    <p className="text-white font-bold text-lg">{testimonial.name}</p>
                    <Badge className="mt-2 bg-gradient-gold text-gray-900">
                      Ganhou {testimonial.earnings}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-gold-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-gold-900/50 to-gold-800/50 border border-gold-600/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para começar a 
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                {" "}ganhar dinheiro?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a milhares de investidores que já estão ganhando renda passiva
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="text-white">Depósito mínimo: 100 MT</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="text-white">ROI em 21-25 dias</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="text-white">Suporte 24/7</span>
              </div>
            </div>

            {!user && (
              <Button asChild size="lg" className="bg-gradient-gold text-gray-900 hover:bg-gold-500 text-xl px-12 py-6 animate-glow">
                <Link to="/register">
                  Criar Conta Grátis <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
