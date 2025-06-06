
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Smartphone, Wallet, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Deposit = () => {
  const { userData, updateUserData } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'text-green-600' },
    { id: 'emola', name: 'e-Mola', icon: Wallet, color: 'text-blue-600' },
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
      // Simular processamento do depósito
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Criar transação pendente
      const transaction = {
        id: Date.now().toString(),
        type: 'deposit' as const,
        amount: depositAmount,
        status: 'pending' as const,
        date: new Date().toISOString(),
        description: `Depósito via ${paymentMethods.find(m => m.id === paymentMethod)?.name}`,
        paymentMethod: paymentMethod,
        phoneNumber
      };

      // Adicionar ao histórico
      updateUserData({
        transactions: [...(userData.transactions || []), transaction]
      });

      toast({
        title: "Depósito solicitado!",
        description: "Sua solicitação de depósito está sendo processada.",
      });

      // Limpar formulário
      setAmount('');
      setPaymentMethod('');
      setPhoneNumber('');
    } catch (error) {
      toast({
        title: "Erro no depósito",
        description: "Ocorreu um erro ao processar o depósito. Tente novamente.",
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
          <Loader2 className="animate-spin h-32 w-32 text-gold-400 mx-auto mb-4" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Fazer Depósito</h1>
          <p className="text-gray-300">Adicione fundos à sua conta Mine Wealth</p>
        </div>

        {/* Saldo atual */}
        <div className="max-w-md mx-auto mb-8">
          <Card className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border-gold-500/30">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Wallet className="h-6 w-6 text-gold-400" />
                <span className="text-gold-200">Saldo Atual</span>
              </div>
              <p className="text-2xl font-bold text-white">{userData.balance.toFixed(2)} MT</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de depósito */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Fazer Depósito</CardTitle>
              <CardDescription className="text-gray-300">
                Preencha os dados para fazer seu depósito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Valor (MT)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Valor mínimo: 100 MT"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  min="100"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Método de Pagamento</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Escolha o método de pagamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <SelectItem key={method.id} value={method.id} className="text-white">
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
                <Label htmlFor="phone" className="text-white">Número de Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ex: 84xxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <Button
                onClick={handleDeposit}
                disabled={loading || !amount || !paymentMethod || !phoneNumber}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700 font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Fazer Depósito'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Informações dos métodos de pagamento */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Métodos Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <div key={method.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50">
                      <IconComponent className={`h-6 w-6 ${method.color}`} />
                      <div>
                        <h4 className="text-white font-semibold">{method.name}</h4>
                        <p className="text-gray-400 text-sm">Depósito instantâneo</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Tempos de Processamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">M-Pesa</span>
                  <span className="text-green-400">Instantâneo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">e-Mola</span>
                  <span className="text-green-400">Instantâneo</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-900/20 border-blue-700/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-blue-300 font-semibold text-sm">Informação Importante</h4>
                    <p className="text-gray-300 text-xs mt-1">
                      Todos os depósitos são processados automaticamente. Mantenha seu telefone ativo para receber a confirmação.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
