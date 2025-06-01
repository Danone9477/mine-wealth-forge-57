import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Shield, Zap, Users, Award, Clock, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-gold-400 text-gray-900 text-xs sm:text-sm font-semibold px-3 py-1 sm:px-4 sm:py-2">
                🚀 Ganhe até 15% ao dia!
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                  Mineração
                </span>
                <br />
                <span className="text-white">Automática de</span>
                <br />
                <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                  Criptomoedas
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
                Ganhe dinheiro 24/7 com nossos mineradores profissionais. 
                <span className="text-gold-400 font-semibold"> Até mesmo enquanto dorme!</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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

            {/* Crypto Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-4 sm:p-6 text-center animate-float">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">₿</span>
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base">Bitcoin</h3>
                <p className="text-orange-400 text-xs sm:text-sm">BTC</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4 sm:p-6 text-center animate-float" style={{animationDelay: '0.2s'}}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">Ξ</span>
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base">Ethereum</h3>
                <p className="text-blue-400 text-xs sm:text-sm">ETH</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4 sm:p-6 text-center animate-float" style={{animationDelay: '0.4s'}}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-base sm:text-xl font-bold text-white">USDT</span>
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base">Tether</h3>
                <p className="text-green-400 text-xs sm:text-sm">USDT</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4 sm:p-6 text-center animate-float" style={{animationDelay: '0.6s'}}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-base sm:text-xl font-bold text-white">BNB</span>
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base">Binance</h3>
                <p className="text-purple-400 text-xs sm:text-sm">BNB</p>
              </div>

              <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4 sm:p-6 text-center animate-float" style={{animationDelay: '0.8s'}}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-base sm:text-xl font-bold text-white">ADA</span>
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base">Cardano</h3>
                <p className="text-red-400 text-xs sm:text-sm">ADA</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-4 sm:p-6 text-center animate-float" style={{animationDelay: '1s'}}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-base sm:text-xl font-bold text-white">DOT</span>
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base">Polkadot</h3>
                <p className="text-yellow-400 text-xs sm:text-sm">DOT</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gold-400 mb-2">15,247</div>
              <div className="text-gray-300 text-sm sm:text-base">Usuários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gold-400 mb-2">2.8M MT</div>
              <div className="text-gray-300 text-sm sm:text-base">Pagos Hoje</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gold-400 mb-2">99.9%</div>
              <div className="text-gray-300 text-sm sm:text-base">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gold-400 mb-2">24/7</div>
              <div className="text-gray-300 text-sm sm:text-base">Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
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
                  Ganhe até 15% ao dia com nossos mineradores profissionais
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
                  Seus investimentos protegidos por tecnologia blockchain
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 hover:border-gold-400/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-gray-900" />
                </div>
                <CardTitle className="text-white">Pagamentos Instantâneos</CardTitle>
                <CardDescription className="text-gray-300">
                  Receba seus ganhos automaticamente via e-Mola e M-Pesa
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
                  Seus mineradores trabalham sem parar, até enquanto você dorme
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

      {/* Miners Preview */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Escolha Seu Minerador
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">
              Quanto maior o investimento, maiores os retornos diários
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <CardTitle className="text-white text-xl sm:text-2xl">Iniciante</CardTitle>
                <CardDescription className="text-gray-300">
                  Perfeito para começar
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gold-400 mb-2">380 MT</div>
                <div className="text-green-400 text-base sm:text-lg font-semibold mb-4">+25 MT/dia</div>
                <Badge className="bg-green-600 text-white mb-4 text-xs sm:text-sm">ROI: 6.6% ao dia</Badge>
                <Button asChild className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500">
                  <a href="/register">Investir Agora</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gold-400 hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gold-400 text-gray-900 px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-bold">
                POPULAR
              </div>
              <CardHeader className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <CardTitle className="text-white text-xl sm:text-2xl">Profissional</CardTitle>
                <CardDescription className="text-gray-300">
                  O mais escolhido
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gold-400 mb-2">2,500 MT</div>
                <div className="text-green-400 text-base sm:text-lg font-semibold mb-4">+250 MT/dia</div>
                <Badge className="bg-gold-600 text-white mb-4 text-xs sm:text-sm">ROI: 10% ao dia</Badge>
                <Button asChild className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500">
                  <a href="/register">Investir Agora</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <CardTitle className="text-white text-xl sm:text-2xl">Elite</CardTitle>
                <CardDescription className="text-gray-300">
                  Máximos retornos
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gold-400 mb-2">8,000 MT</div>
                <div className="text-green-400 text-base sm:text-lg font-semibold mb-4">+1,200 MT/dia</div>
                <Badge className="bg-purple-600 text-white mb-4 text-xs sm:text-sm">ROI: 15% ao dia</Badge>
                <Button asChild className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500">
                  <a href="/register">Investir Agora</a>
                </Button>
              </CardContent>
            </Card>
          </div>
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
            Junte-se a milhares de investidores que já estão ganhando dinheiro automaticamente
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
