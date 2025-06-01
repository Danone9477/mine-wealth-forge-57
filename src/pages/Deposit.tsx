
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Smartphone, Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Deposit = () => {
  const { userData, updateUserData } = useAuth();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'emola' | 'mpesa'>('emola');

  const minDeposit = 100;

  // Credenciais atualizadas da Gibra Pay
  const GIBRA_PAY_API_KEY = "14980a4bce3524a7547214f7b874a105693491a367c746a113c20dfaf1af77cf9fb60e5898146bac57165ef2c4fac50fd74180b8345bc3bba0504a5d4632267e";
  const WALLET_ID = "9d2cd54d-720b-490f-b0a9-5c9eace02ff4";

  const handleDeposit = async () => {
    if (!userData) return;
    
    const depositAmount = parseFloat(amount);
    
    if (depositAmount < minDeposit) {
      toast({
        title: "Valor inválido",
        description: `Depósito mínimo é de ${minDeposit} MT`,
        variant: "destructive",
      });
      return;
    }

    if (!phone || phone.length < 9) {
      toast({
        title: "Número inválido",
        description: "Por favor, insira um número de telefone válido",
        variant: "destructive",
      });
      return;
    }

    // Validar formato do número (deve começar com 84, 85, 86, ou 87)
    const phoneRegex = /^(84|85|86|87)\d{7}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Número inválido",
        description: "O número deve começar com 84, 85, 86 ou 87 e ter 9 dígitos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Integração real com a API da Gibra Pay
      const response = await fetch("https://gibrapay.online/v1/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": GIBRA_PAY_API_KEY
        },
        body: JSON.stringify({
          "wallet_id": WALLET_ID,
          "amount": depositAmount,
          "phone_number": phone
        })
      });

      const result = await response.json();
      
      console.log('Gibra Pay Response:', result);

      // Criar transação baseada na resposta da API
      const transaction = {
        id: result.data?.id || Date.now().toString(),
        type: 'deposit',
        amount: depositAmount,
        method: selectedMethod,
        phone,
        status: result.status === 'success' ? 'success' : 'failed',
        date: new Date().toISOString(),
        description: `Depósito via ${selectedMethod.toUpperCase()}`,
        gibra_pay_id: result.data?.id,
        gibra_pay_status: result.data?.status
      };

      if (result.status === 'success') {
        // Atualizar saldo apenas se o pagamento foi bem-sucedido
        await updateUserData({
          balance: userData.balance + depositAmount,
          transactions: [...(userData.transactions || []), transaction]
        });

        toast({
          title: "Depósito realizado com sucesso! 🎉",
          description: `${depositAmount} MT foram adicionados à sua conta`,
        });
      } else {
        // Adicionar transação falhada ao histórico
        await updateUserData({
          transactions: [...(userData.transactions || []), transaction]
        });

        toast({
          title: "Erro no depósito",
          description: result.message || "Falha na transferência. Verifique os dados e tente novamente.",
          variant: "destructive",
        });
      }

      setAmount('');
      setPhone('');
    } catch (error) {
      console.error('Deposit error:', error);
      
      // Adicionar transação falhada em caso de erro de rede
      const failedTransaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: depositAmount,
        method: selectedMethod,
        phone,
        status: 'failed',
        date: new Date().toISOString(),
        description: `Falha no depósito via ${selectedMethod.toUpperCase()}`,
        error: 'Erro de conexão'
      };

      await updateUserData({
        transactions: [...(userData.transactions || []), failedTransaction]
      });

      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao serviço de pagamento. Tente novamente.",
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
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Fazer Depósito
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Adicione fundos à sua conta de forma rápida e segura
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-green-500/20 border border-green-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            <span className="text-green-400 font-semibold text-sm sm:text-base">Saldo atual: {userData.balance} MT</span>
          </div>
        </div>

        {/* API Key Warning */}
        {GIBRA_PAY_API_KEY === "SUA_API_KEY_AQUI" && (
          <Card className="bg-red-900/20 border-red-700 mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-red-400">Configuração Necessária</h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Configure sua API Key da Gibra Pay no código para habilitar depósitos reais.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Deposit Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Detalhes do Depósito</CardTitle>
                <CardDescription className="text-gray-400">
                  Preencha os dados para processar seu depósito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Methods */}
                <div className="space-y-3">
                  <Label className="text-gray-300">Método de Pagamento</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={selectedMethod === 'emola' ? 'default' : 'outline'}
                      onClick={() => setSelectedMethod('emola')}
                      className={`h-14 sm:h-16 ${selectedMethod === 'emola' 
                        ? 'bg-gradient-gold text-gray-900' 
                        : 'border-gray-600 text-gray-300'}`}
                    >
                      <div className="text-center">
                        <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1" />
                        <span className="font-semibold text-sm sm:text-base">e-Mola</span>
                      </div>
                    </Button>
                    <Button
                      variant={selectedMethod === 'mpesa' ? 'default' : 'outline'}
                      onClick={() => setSelectedMethod('mpesa')}
                      className={`h-14 sm:h-16 ${selectedMethod === 'mpesa' 
                        ? 'bg-gradient-gold text-gray-900' 
                        : 'border-gray-600 text-gray-300'}`}
                    >
                      <div className="text-center">
                        <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1" />
                        <span className="font-semibold text-sm sm:text-base">M-Pesa</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-300">Valor do Depósito (MT)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Mínimo ${minDeposit} MT`}
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400"
                    min={minDeposit}
                  />
                  <p className="text-sm text-gray-400">
                    Depósito mínimo: {minDeposit} MT
                  </p>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    Número de Telefone ({selectedMethod === 'emola' ? 'e-Mola' : 'M-Pesa'})
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="84/85/86/87 XXXXXXX"
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400"
                    maxLength={9}
                  />
                  <p className="text-xs text-gray-400">
                    Formato: 84XXXXXXX, 85XXXXXXX, 86XXXXXXX ou 87XXXXXXX
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleDeposit}
                  disabled={loading || !amount || !phone || parseFloat(amount) < minDeposit}
                  className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500 font-semibold h-12"
                >
                  {loading ? 'Processando Depósito...' : `Depositar ${amount || '0'} MT`}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Security Info */}
            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-white">100% Seguro</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Todos os depósitos são processados através da API segura da Gibra Pay com criptografia de ponta.
                </p>
              </CardContent>
            </Card>

            {/* Processing Time */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-white">Processamento Rápido</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Depósitos são processados instantaneamente e o saldo é creditado imediatamente na sua conta.
                </p>
              </CardContent>
            </Card>

            {/* Minimum Deposit */}
            <Card className="bg-gradient-to-br from-gold-900/50 to-gold-800/50 border-gold-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-gold-400 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-white">Depósito Mínimo</h3>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Valor mínimo de {minDeposit} MT para começar a investir nos nossos mineradores.
                </p>
                <Badge className="bg-gold-400 text-gray-900">
                  {minDeposit} MT Mínimo
                </Badge>
              </CardContent>
            </Card>

            {/* Steps */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Como Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="text-white font-medium">Escolha o método</p>
                    <p className="text-gray-400 text-sm">e-Mola ou M-Pesa</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="text-white font-medium">Insira o valor</p>
                    <p className="text-gray-400 text-sm">Mínimo 100 MT</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="text-white font-medium">Confirme</p>
                    <p className="text-gray-400 text-sm">Saldo creditado instantaneamente</p>
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
