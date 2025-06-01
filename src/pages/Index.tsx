
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Shield, Zap, Users, Award, Clock, DollarSign, Pickaxe, Coins, Star, Crown, Diamond, Gem } from "lucide-react";

const Index = () => {
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
      features: ['Mineração 24/7', 'Suporte básico', 'Retorno 350% em 30 dias']
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
      features: ['Mineração 24/7', 'Suporte VIP', 'Retorno 350% em 30 dias']
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
      features: ['Mineração 24/7', 'Suporte exclusivo', 'Retorno 350% em 30 dias']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center lg:text-center mb-12">
            <Badge className="mb-4 bg-gold-400 text-gray-900 text-xs sm:text-sm font-semibold px-3 py-1 sm:px-4 sm:py-2">
              🚀 Ganhe até 15% ao dia com ROI de 350%!
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Mineração Automática
              </span>
              <br />
              <span className="text-white">de Criptomoedas</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
              Invista em nossos mineradores profissionais e obtenha retornos garantidos de 350% em 30 dias. 
              <span className="text-gold-400 font-semibold"> Tecnologia blockchain avançada para máxima rentabilidade!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-gold text-gray-900 hover:bg-gold-500 font-bold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 h-auto">
                <a href="/register">
                  Começar Agora <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" className="border-gold-400 text-gold-400 hover:bg-gold-400/10 font-semibold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 h-auto">
                <a href="/login">Fazer Login</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 text-center">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Users className="h-6 w-6 text-green-400" />
                <div className="text-2xl sm:text-3xl font-bold text-green-400">15,247</div>
              </div>
              <div className="text-gray-300 text-sm sm:text-base">Usuários Ativos</div>
            </div>
            <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 backdrop-blur-sm border border-gold-500/30 rounded-xl p-4 text-center">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Coins className="h-6 w-6 text-gold-400" />
                <div className="text-2xl sm:text-3xl font-bold text-gold-400">2.8M MT</div>
              </div>
              <div className="text-gray-300 text-sm sm:text-base">Pagos Hoje</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 text-center">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Shield className="h-6 w-6 text-blue-400" />
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">99.9%</div>
              </div>
              <div className="text-gray-300 text-sm sm:text-base">Uptime</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 text-center">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Clock className="h-6 w-6 text-purple-400" />
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">24/7</div>
              </div>
              <div className="text-gray-300 text-sm sm:text-base">Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Miners Preview with new design */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Mineradores Premium
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Invista em nossos mineradores de alta performance e obtenha retornos garantidos de 350% em 30 dias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {minerTypes.map((miner) => {
              const IconComponent = miner.icon;
              
              return (
                <Card key={miner.id} className={`bg-gradient-to-br ${miner.bgGradient} backdrop-blur-sm border-gray-700 hover:border-gold-500/50 transition-all duration-300 transform hover:scale-105`}>
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
                        <p className="text-gray-400 text-sm mb-1">Lucro Total</p>
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
                    <Button asChild className={`w-full h-12 font-semibold text-lg bg-gradient-to-r ${miner.color} text-white hover:opacity-90 shadow-lg`}>
                      <a href="/register">
                        Investir {miner.price} MT
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Por que escolher a Alpha Traders?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              A plataforma mais confiável e lucrativa para mineração de criptomoedas em Moçambique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 hover:border-gold-400/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-gray-900" />
                </div>
                <CardTitle className="text-white">Retornos Garantidos</CardTitle>
                <CardDescription className="text-gray-300">
                  ROI de 350% garantido em 30 dias com nossos mineradores profissionais
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 hover:border-gold-400/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-gray-900" />
                </div>
                <CardTitle className="text-white">100% Seguro</CardTitle>
                <CardDescription className="text-gray-300">
                  Seus investimentos protegidos por tecnologia blockchain avançada
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 hover:border-gold-400/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-gray-900" />
                </div>
                <CardTitle className="text-white">Pagamentos via MozPayment</CardTitle>
                <CardDescription className="text-gray-300">
                  Depósitos e saques instantâneos via e-Mola e M-Pesa
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 hover:border-gold-400/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-gray-900" />
                </div>
                <CardTitle className="text-white">Mineração 24/7</CardTitle>
                <CardDescription className="text-gray-300">
                  Seus mineradores trabalham sem parar, gerando renda passiva
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 hover:border-gold-400/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-gray-900" />
                </div>
                <CardTitle className="text-white">Comunidade Ativa</CardTitle>
                <CardDescription className="text-gray-300">
                  Junte-se a milhares de investidores bem-sucedidos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 hover:border-gold-400/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-gray-900" />
                </div>
                <CardTitle className="text-white">Depósito Mínimo Baixo</CardTitle>
                <CardDescription className="text-gray-300">
                  Comece a investir com apenas 100 MT
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
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
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Comece a Ganhar Hoje!
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Junte-se a milhares de investidores que já estão ganhando dinheiro automaticamente com ROI de 350%
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-gold text-gray-900 hover:bg-gold-500 font-bold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 h-auto">
              <a href="/register">
                Criar Conta Grátis <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </Button>
            <Button asChild variant="outline" className="border-gold-400 text-gold-400 hover:bg-gold-400/10 font-semibold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 h-auto">
              <a href="/login">Já tenho conta</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
