
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";

const CryptoSection = () => {
  const cryptoData = [
    {
      symbol: "MT",
      name: "Malta Token",
      price: 1.00,
      change: 2.5,
      icon: "🇲🇹",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-900/20 to-red-800/20"
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 43250.75,
      change: 3.2,
      icon: "₿",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-900/20 to-orange-800/20"
    },
    {
      symbol: "BNB",
      name: "Binance Coin",
      price: 312.45,
      change: -1.8,
      icon: "🔶",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-900/20 to-yellow-800/20"
    },
    {
      symbol: "USDT",
      name: "Tether (TRC20)",
      price: 1.00,
      change: 0.1,
      icon: "₮",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-900/20 to-green-800/20"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 2850.30,
      change: 4.7,
      icon: "⟠",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-900/20 to-blue-800/20"
    },
    {
      symbol: "ADA",
      name: "Cardano",
      price: 0.485,
      change: -2.1,
      icon: "₳",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-900/20 to-purple-800/20"
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: 98.75,
      change: 6.3,
      icon: "◎",
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-900/20 to-pink-800/20"
    },
    {
      symbol: "MATIC",
      name: "Polygon",
      price: 0.92,
      change: 1.5,
      icon: "⬟",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-900/20 to-indigo-800/20"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Criptomoedas Suportadas
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Invista em uma variedade de criptomoedas com nossa plataforma de mineração automatizada
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cryptoData.map((crypto) => (
            <Card key={crypto.symbol} className={`bg-gradient-to-br ${crypto.bgColor} backdrop-blur-sm border-gray-700 hover:border-gold-500/50 transition-all duration-300 transform hover:scale-105`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${crypto.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {crypto.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white text-sm">{crypto.symbol}</CardTitle>
                      <CardDescription className="text-gray-400 text-xs">{crypto.name}</CardDescription>
                    </div>
                  </div>
                  <Coins className="h-5 w-5 text-gold-400" />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="text-xl font-bold text-white">
                    ${crypto.price.toLocaleString()}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {crypto.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <Badge 
                      className={`text-xs ${crypto.change >= 0 
                        ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                        : 'bg-red-500/20 text-red-400 border-red-500/50'
                      }`}
                    >
                      {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Preços atualizados em tempo real • Suporte para mais de 69 criptomoedas
          </p>
        </div>
      </div>
    </section>
  );
};

export default CryptoSection;
