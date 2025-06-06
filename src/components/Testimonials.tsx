
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Santos",
      location: "Maputo",
      rating: 5,
      text: "Mine Wealth mudou minha vida! Em 6 meses consegui triplicar meu investimento inicial. O suporte é excepcional!",
      investment: "Investiu 5,000 MT"
    },
    {
      name: "João Pedro",
      location: "Beira",
      rating: 5,
      text: "Plataforma segura e rentável. Recebo meus lucros pontualmente todos os meses. Recomendo a todos!",
      investment: "Investiu 15,000 MT"
    },
    {
      name: "Ana Machado",
      location: "Nampula",
      rating: 5,
      text: "Começei com pouco e hoje tenho uma renda passiva consistente. A mineração digital é o futuro!",
      investment: "Investiu 2,500 MT"
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center text-white mb-6">
        💬 O Que Nossos Investidores Dizem
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Quote className="h-8 w-8 text-gold-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm mb-3 italic">"{testimonial.text}"</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-gray-400 text-xs">{testimonial.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-xs font-medium">{testimonial.investment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
