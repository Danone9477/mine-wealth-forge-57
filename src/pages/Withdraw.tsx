
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Smartphone, Wallet, AlertCircle, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Withdraw = () => {
  const { userData, updateUserData } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'from-green-500 to-green-600' },
    { id: 'emola', name: 'e-Mola', icon: Wallet, color: 'from-blue-500 to-blue-600' },
  ];

  const handleWithdraw = async () => {
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

    const withdrawAmount = parseFloat(amount);
    
    // Verificar valor mínimo de 500 MT
    if (withdrawAmount < 500) {
      toast({
        title: "Valor mínimo",
        description: "O valor mínimo de saque é 500 MT",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > userData.balance) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não tem saldo suficiente para este saque",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Criar transação de saque pendente
      const transaction = {
        id: Date.now().toString(),
        type: 'withdrawal' as const,
        amount: withdrawAmount,
        status: 'pending' as const,
        date: new Date().toISOString(),
        description: `Saque via ${paymentMethods.find(m => m.id === paymentMethod)?.name}`,
        paymentMethod,
        phoneNumber,
        method: paymentMethods.find(m => m.id === paymentMethod)?.name || paymentMethod,
        phone: phoneNumber,
        pixKey: phoneNumber
      };

      // Debitar o valor do saldo
      const newBalance = userData.balance - withdrawAmount;

      await updateUserData({
        balance: newBalance,
        transactions: [...(userData.transactions || []), transaction]
      });

      toast({
        title: "Saque solicitado com sucesso! 🎉",
        description: `Saque de ${withdrawAmount} MT será processado em até 24h. Novo saldo: ${newBalance.toFixed(2)} MT`,
      });

      // Limpar formulário
      setAmount('');
      setPhoneNumber('');
      setPaymentMethod('');

    } catch (error) {
      console.error('Erro ao processar saque:', error);
      toast({
        title: "Erro no sistema",
        description: "Erro interno no processamento. Tente novamente.",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Sacar Fundos
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Retire seus ganhos de forma rápida e segura
            </p>
          </div>

          {/* Current Balance */}
          <div className="max-w-md mx-auto mb-8">
            <Card className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border-gold-500/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Wallet className="h-8 w-8 text-gold-400" />
                  <div>
                    <p className="text-gold-200 font-medium">Saldo Disponível</p>
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
          {/* Withdraw Form */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-xl sm:text-2xl">Informações do Saque</CardTitle>
              <CardDescription className="text-gray-300">
                Preencha os dados para realizar seu saque
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white font-medium">Valor (MT)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Valor mínimo: 500 MT"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  min="500"
                  max={userData.balance}
                />
                <p className="text-sm text-gray-400">Valor mínimo: 500 MT • Disponível: {userData.balance.toFixed(2)} MT</p>
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
                <p className="text-sm text-gray-400">Número da conta para receber o pagamento</p>
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={loading || !amount || !paymentMethod || !phoneNumber || parseFloat(amount || '0') < 500}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 font-semibold h-12 text-base sm:text-lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Processando saque...
                  </div>
                ) : (
                  `Sacar ${amount ? parseFloat(amount).toFixed(2) : '0.00'} MT`
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
                  Métodos de Saque
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
                        <p className="text-gray-400 text-sm">Processamento em até 24 horas</p>
                      </div>
                      <Badge className="ml-auto bg-green-600 text-white">Ativo</Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Processing Time */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-6 w-6 text-blue-400" />
                  Tempo de Processamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-gray-300 text-sm">Solicitação enviada instantaneamente</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-gray-300 text-sm">Análise e aprovação em até 2 horas</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-300 text-sm">Pagamento processado em até 24 horas</span>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-yellow-400 font-semibold mb-2">Informações Importantes</h3>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Valor mínimo: 500 MT</li>
                      <li>• Processamento: até 24 horas</li>
                      <li>• Horário: 24/7 (processamento em dias úteis)</li>
                      <li>• Taxa: Gratuito</li>
                      <li>• Suporte: contato@minewealth.co.mz</li>
                    </ul>
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

export default Withdraw;
