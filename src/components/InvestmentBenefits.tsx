
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, Clock, Award, Headphones, Globe } from 'lucide-react';

const InvestmentBenefits = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "ROI Garantido",
      description: "Retornos consistentes e crescentes com nossa tecnologia de mineração avançada",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Seus investimentos protegidos com tecnologia blockchain e criptografia militar",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Clock,
      title: "Disponível 24/7",
      description: "Plataforma funcionando continuamente, gerando lucros mesmo enquanto você dorme",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Award,
      title: "Premiada",
      description: "Reconhecida como a melhor plataforma de mineração digital em Moçambique",
      color: "from-gold-500 to-gold-600"
    },
    {
      icon: Headphones,
      title: "Suporte Expert",
      description: "Equipe especializada para maximizar seus investimentos e esclarecer dúvidas",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Globe,
      title: "Global",
      description: "Operações em 12+ países com tecnologia de ponta e parcerias estratégicas",
      color: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-xl text-center">
          🚀 Por Que Escolher Mine Wealth?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${benefit.color} flex-shrink-0`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">{benefit.title}</h4>
                  <p className="text-gray-300 text-xs">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentBenefits;
