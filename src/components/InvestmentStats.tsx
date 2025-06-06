
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Shield, Zap, DollarSign, Globe } from 'lucide-react';

const InvestmentStats = () => {
  const stats = [
    {
      icon: DollarSign,
      title: 'Volume Total',
      value: '2.5M MT',
      description: 'Investido na plataforma',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30'
    },
    {
      icon: Users,
      title: 'Investidores Ativos',
      value: '1,247',
      description: 'Confiaram em nós',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30'
    },
    {
      icon: TrendingUp,
      title: 'ROI Médio',
      value: '15.8%',
      description: 'Retorno mensal',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30'
    },
    {
      icon: Shield,
      title: 'Segurança',
      value: '100%',
      description: 'Fundos protegidos',
      color: 'from-gold-500 to-gold-600',
      bgColor: 'from-gold-500/20 to-gold-600/20',
      borderColor: 'border-gold-500/30'
    },
    {
      icon: Zap,
      title: 'Uptime',
      value: '99.9%',
      description: 'Disponibilidade',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-500/20 to-orange-600/20',
      borderColor: 'border-orange-500/30'
    },
    {
      icon: Globe,
      title: 'Países',
      value: '12+',
      description: 'Operando globalmente',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-500/20 to-teal-600/20',
      borderColor: 'border-teal-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index} 
            className={`bg-gradient-to-r ${stat.bgColor} ${stat.borderColor} backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
          >
            <CardContent className="p-4 text-center">
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${stat.color} mb-3`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-300">{stat.title}</p>
              <p className="text-xs text-gray-400">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default InvestmentStats;
