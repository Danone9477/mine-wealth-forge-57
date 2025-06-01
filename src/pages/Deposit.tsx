
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Smartphone, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { processPayment, processAffiliateCommission } from '@/services/paymentService';

const Deposit = () => {
  const { userData, updateUserData } = useAuth();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'emola' | 'mpesa'>('emola');

  const minDeposit = 100;

  const handleDeposit = async () => {
    if (!userData) {
      toast({
        title: "Erro de autenticação",
        description: "Por favor, faça login novamente",
        variant: "destructive",
      });
      return;
    }
    
    const depositAmount = parseFloat(amount);
    
    if (!amount || isNaN(depositAmount) || depositAmount < minDeposit) {
      toast({
        title: "Valor inválido",
        description: `Depósito mínimo é de ${minDeposit} MT`,
        variant: "destructive",
      });
      return;
    }

    if (!phone || phone.length !== 9) {
      toast({
        title: "Número inválido",
        description: "Por favor, insira um número de telefone válido com 9 dígitos",
        variant: "destructive",
      });
      return;
    }

    // Validar prefixo do número
    const validPrefixes = ['84', '85', '86', '87'];
    const phonePrefix = phone.substring(0, 2);
    
    if (!validPrefixes.includes(phonePrefix)) {
      toast({
        title: "Número inválido",
        description: "O número deve começar com 84, 85, 86 ou 87",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Iniciando depósito melhorado:', {
        method: selectedMethod,
        amount: depositAmount,
        phone: phone,
        username: userData.username
      });

      // Usar o novo serviço de pagamento
      const paymentResult = await processPayment(
        selectedMethod,
        phone,
        depositAmount,
        userData.username
      );

      const transaction = {
        id: Date.now().toString(),
        type: 'deposit' as const,
        amount: depositAmount,
        method: selectedMethod,
        phone,
        status: paymentResult.success ? 'success' as const : 'failed' as const,
        date: new Date().toISOString(),
        description: `Depósito via ${selectedMethod.toUpperCase()} - MozPayment`,
        mozpayment_response: paymentResult.rawResponse,
        mozpayment_message: paymentResult.message,
        transactionId: paymentResult.transactionId
      };

      if (paymentResult.success) {
        // Processar comissão de afiliado se aplicável
        await processAffiliateCommission(depositAmount, userData.uid, userData);

        const updatedTransactions = [...(userData.transactions || []), transaction];
        await updateUserData({
          balance: userData.balance + depositAmount,
          transactions: updatedTransactions
        });

        toast({
          title: "🎉 Depósito realizado com sucesso!",
          description: `${depositAmount} MT foram adicionados à sua conta`,
        });

        setAmount('');
        setPhone('');
      } else {
        const updatedTransactions = [...(userData.transactions || []), transaction];
        await updateUserData({
          transactions: updatedTransactions
        });

        toast({
          title: "Falha no depósito",
          description: paymentResult.message,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Erro completo no depósito:', error);
      
      const failedTransaction = {
        id: Date.now().toString(),
        type: 'deposit' as const,
        amount: depositAmount,
        method: selectedMethod,
        phone,
        status: 'failed' as const,
        date: new Date().toISOString(),
        description: `Falha no depósito via ${selectedMethod.toUpperCase()} - MozPayment`,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };

      const updatedTransactions = [...(userData.transactions || []), failedTransaction];
      await updateUserData({
        transactions: updatedTransactions
      });

      toast({
        title: "Erro no depósito",
        description: "Erro de conectividade. Tente novamente.",
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
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
              Depósito Seguro e Rápido
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Sistema de pagamento MozPayment integrado e otimizado
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-green-500/20 border border-green-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            <span className="text-green-400 font-semibold text-sm sm:text-base">Saldo atual: {userData.balance.toFixed(2)} MT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Deposit Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Detalhes do Depósito</CardTitle>
                <CardDescription className="text-gray-400">
                  Sistema integrado MozPayment - Processamento otimizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Methods */}
                <div className="space-y-3">
                  <Label className="text-gray-300">Método de Pagamento</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={selectedMethod === 'emola' ? 'default' : 'outline'}
                      onClick={() => setSelectedMethod('emola')}
                      className={`h-14 sm:h-16 ${selectedMethod === 'emola' 
                        ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 hover:from-gold-500 hover:to-gold-700' 
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                    >
                      <div className="text-center">
                        <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1" />
                        <span className="font-semibold text-sm sm:text-base">e-Mola</span>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant={selectedMethod === 'mpesa' ? 'default' : 'outline'}
                      onClick={() => setSelectedMethod('mpesa')}
                      className={`h-14 sm:h-16 ${selectedMethod === 'mpesa' 
                        ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 hover:from-gold-500 hover:to-gold-700' 
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
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
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 focus:ring-gold-400"
                    min={minDeposit}
                    step="0.01"
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
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 9) {
                        setPhone(value);
                      }
                    }}
                    placeholder="84XXXXXXX"
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 focus:ring-gold-400"
                    maxLength={9}
                  />
                  <p className="text-xs text-gray-400">
                    Formato: 84XXXXXXX, 85XXXXXXX, 86XXXXXXX ou 87XXXXXXX
                  </p>
                </div>

                {/* Status Indicator */}
                <Card className="bg-green-900/20 border-green-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-green-300 font-medium text-sm">Sistema MozPayment Ativo</p>
                        <p className="text-gray-300 text-xs">
                          API integrada e otimizada para processamento rápido
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button 
                  type="button"
                  onClick={handleDeposit}
                  disabled={loading || !amount || !phone || parseFloat(amount) < minDeposit || isNaN(parseFloat(amount))}
                  className="w-full bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 hover:from-gold-500 hover:to-gold-700 font-semibold h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Processando via MozPayment...
                    </div>
                  ) : (
                    `Depositar ${amount || '0'} MT`
                  )}
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
                  Sistema MozPayment integrado com verificação avançada e processamento otimizado.
                </p>
              </CardContent>
            </Card>

            {/* Processing Time */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-white">Processamento Instantâneo</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  API MozPayment otimizada para aprovação rápida e creditação automática do saldo.
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

            {/* Enhanced API Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Sistema MozPayment Avançado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">✓</div>
                  <div>
                    <p className="text-white font-medium">API Otimizada</p>
                    <p className="text-gray-400 text-sm">Integração oficial MozPayment melhorada</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">✓</div>
                  <div>
                    <p className="text-white font-medium">Verificação Avançada</p>
                    <p className="text-gray-400 text-sm">Sistema de validação inteligente</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">✓</div>
                  <div>
                    <p className="text-white font-medium">Comissão Automática</p>
                    <p className="text-gray-400 text-sm">30% para quem te indicou</p>
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
