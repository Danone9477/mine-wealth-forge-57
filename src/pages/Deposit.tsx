
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Smartphone, Wallet, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Deposit = () => {
  const { userData, updateUserData } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'from-green-500 to-green-600' },
    { id: 'emola', name: 'e-Mola', icon: Wallet, color: 'from-blue-500 to-blue-600' },
    { id: 'ponto24', name: 'Ponto 24', icon: CreditCard, color: 'from-purple-500 to-purple-600' },
  ];

  const handleDeposit = async () => {
    if (!userData) {
      toast({
        title: "Erro de autenticação",
        description: "Por favor, faça login novamente",
        variant: "destructive",
      });
      return;
    }

    if (!amount || !paymentMethod || !phoneNumber) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (depositAmount < 100) {
      toast({
        title: "Valor mínimo",
        description: "O valor mínimo de depósito é 100 MT",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transaction = {
        id: Date.now().toString(),
        type: 'deposit' as const,
        amount: depositAmount,
        status: 'success' as const,
        date: new Date().toISOString(),
        description: `Depósito via ${paymentMethods.find(m => m.id === paymentMethod)?.name} - ${phoneNumber}`,
        paymentMethod,
        phoneNumber
      };

      await updateUserData({
        balance: userData.balance + depositAmount,
        transactions: [...(userData.transactions || []), transaction]
      });

      toast({
        title: "Depósito realizado com sucesso! 🎉",
        description: `${depositAmount} MT foram adicionados à sua conta`,
      });

      setAmount('');
      setPhoneNumber('');
      setPaymentMethod('');

    } catch (error) {
      toast({
        title: "Erro no depósito",
        description: "Erro ao processar o depósito. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Fazer Depósito
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Adicione fundos à sua conta Alpha Traders de forma rápida e segura
            </p>
          </div>

          {/* Current Balance */}
          <div className="max-w-md mx-auto mb-8">
            <Card className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border-gold-500/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Wallet className="h-8 w-8 text-gold-400" />
                  <div>
                    <p className="text-gold-200 font-medium">Saldo Atual</p>
                    <p className="text-3xl font-bold text-white">{userData.balance.toFixed(2)} MT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Deposit Form */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-xl sm:text-2xl">Informações do Depósito</CardTitle>
              <CardDescription className="text-gray-300">
                Preencha os dados para realizar seu depósito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white font-medium">Valor (MT)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Valor mínimo: 100 MT"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  min="100"
                />
                <p className="text-sm text-gray-400">Valor mínimo: 100 MT</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Método de Pagamento</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Escolha o método de pagamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <SelectItem key={method.id} value={method.id} className="text-white hover:bg-gray-700">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {method.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-medium">Número de Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ex: 84xxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <p className="text-sm text-gray-400">Número da conta para débito</p>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={loading || !amount || !paymentMethod || !phoneNumber}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 font-semibold h-12 text-base sm:text-lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processando...
                  </div>
                ) : (
                  `Depositar ${amount ? parseFloat(amount).toFixed(2) : '0.00'} MT`
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Payment Methods Info */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  Métodos de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <div key={method.id} className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${method.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{method.name}</h4>
                        <p className="text-gray-400 text-sm">Transferência instantânea</p>
                      </div>
                      <Badge className="ml-auto bg-green-600 text-white">Ativo</Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-blue-400" />
                  Segurança Garantida
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Transações protegidas por SSL</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Processamento instantâneo</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Suporte 24/7 disponível</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Sem taxas ocultas</span>
                </div>
              </CardContent>
            </Card>

            {/* Processing Time */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-6 w-6 text-gold-400" />
                  Tempo de Processamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">M-Pesa</span>
                    <Badge className="bg-green-600 text-white">Instantâneo</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">e-Mola</span>
                    <Badge className="bg-green-600 text-white">Instantâneo</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Ponto 24</span>
                    <Badge className="bg-blue-600 text-white">1-5 min</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-yellow-400 font-semibold mb-2">Informações Importantes</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Valor mínimo de depósito: 100 MT</li>
                    <li>• Depósitos são processados automaticamente</li>
                    <li>• Guarde o comprovante da transação</li>
                    <li>• Em caso de problemas, contacte o suporte</li>
                    <li>• Verifique se o número inserido está correto</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
