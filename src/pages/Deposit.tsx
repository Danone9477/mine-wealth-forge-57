
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Smartphone, Shield, Clock, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Deposit = () => {
  const { userData, updateUserData } = useAuth();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'emola' | 'mpesa'>('emola');

  const minDeposit = 100;
  const WALLET_ID = "1741243147134x615195806040850400";

  const processAffiliateCommission = async (depositAmount: number, userUID: string) => {
    try {
      if (!userData?.referredBy) return;

      const commission = depositAmount * 0.30; // 30% de comissão
      
      // Buscar o afiliado que fez a referência
      const affiliateQuery = query(
        collection(db, 'users'),
        where('affiliateCode', '==', userData.referredBy)
      );
      
      const affiliateSnapshot = await getDocs(affiliateQuery);
      
      if (!affiliateSnapshot.empty) {
        const affiliateDoc = affiliateSnapshot.docs[0];
        const affiliateData = affiliateDoc.data();
        
        // Atualizar dados do afiliado
        const newAffiliateBalance = (affiliateData.affiliateBalance || 0) + commission;
        const newTotalCommissions = (affiliateData.affiliateStats?.totalCommissions || 0) + commission;
        const newMonthlyCommissions = (affiliateData.affiliateStats?.monthlyCommissions || 0) + commission;
        
        // Adicionar à lista de referidos ativos
        const newActiveReferral = {
          username: userData.username,
          date: new Date().toLocaleDateString('pt-BR'),
          commission: commission,
          depositAmount: depositAmount
        };
        
        const updatedActiveReferrals = [
          ...(affiliateData.affiliateStats?.activeReferrals || []),
          newActiveReferral
        ];
        
        // Incrementar contadores
        const updatedStats = {
          ...affiliateData.affiliateStats,
          totalCommissions: newTotalCommissions,
          monthlyCommissions: newMonthlyCommissions,
          activeReferralsCount: updatedActiveReferrals.length,
          activeReferrals: updatedActiveReferrals
        };
        
        await updateDoc(doc(db, 'users', affiliateDoc.id), {
          affiliateBalance: newAffiliateBalance,
          affiliateStats: updatedStats
        });
        
        console.log(`Comissão de ${commission} MT creditada ao afiliado ${userData.referredBy}`);
      }
    } catch (error) {
      console.error('Erro ao processar comissão do afiliado:', error);
    }
  };

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
      const endpoint = selectedMethod === 'emola' 
        ? 'https://mozpayment.co.mz/api/1.1/wf/pagamentorotativoemola'
        : 'https://mozpayment.co.mz/api/1.1/wf/pagamentorotativompesa';

      console.log('Iniciando depósito com MozPayment:', {
        endpoint,
        amount: depositAmount,
        phone: phone,
        carteira: WALLET_ID
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          carteira: WALLET_ID,
          numero: phone,
          "quem comprou": userData.username,
          valor: depositAmount
        })
      });

      console.log('Response status:', response.status);
      const result = await response.text(); // MozPayment returns text responses

      console.log('MozPayment response:', result);

      let status: 'success' | 'failed' = 'failed';
      let message = result;

      // Check response for success indicators
      if (response.status === 200 || result.toLowerCase().includes('success = yes') || result.toLowerCase().includes('pagamento aprovado')) {
        status = 'success';
        message = 'Pagamento aprovado';
      } else if (response.status === 201) {
        status = 'failed';
        message = 'Erro na transação';
      } else if (response.status === 422) {
        status = 'failed';
        message = 'Saldo insuficiente';
      } else if (response.status === 400) {
        status = 'failed';
        message = 'PIN errado';
      }

      const transaction = {
        id: Date.now().toString(),
        type: 'deposit' as const,
        amount: depositAmount,
        method: selectedMethod,
        phone,
        status,
        date: new Date().toISOString(),
        description: `Depósito via ${selectedMethod.toUpperCase()} - MozPayment`,
        mozpayment_response: result,
        mozpayment_status_code: response.status
      };

      if (status === 'success') {
        // Processar comissão de afiliado se aplicável
        await processAffiliateCommission(depositAmount, userData.uid);

        const updatedTransactions = [...(userData.transactions || []), transaction];
        await updateUserData({
          balance: userData.balance + depositAmount,
          transactions: updatedTransactions
        });

        toast({
          title: "Depósito realizado com sucesso! 🎉",
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
          description: message || "A transferência falhou. Verifique os dados e tente novamente.",
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

      let errorMessage = "Erro de conexão com o serviço de pagamento";
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "Erro de conectividade. Verifique sua internet";
        }
      }

      toast({
        title: "Erro no depósito",
        description: errorMessage,
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
              Fazer Depósito
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Adicione fundos à sua conta de forma rápida e segura
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
                  Preencha os dados para processar seu depósito via MozPayment
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
                  Todos os depósitos são processados através da API segura da MozPayment com máxima segurança.
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
                  Depósitos são processados rapidamente via MozPayment e o saldo é creditado automaticamente.
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

            {/* API Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Powered by MozPayment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">✓</div>
                  <div>
                    <p className="text-white font-medium">API Segura</p>
                    <p className="text-gray-400 text-sm">Integração oficial MozPayment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">✓</div>
                  <div>
                    <p className="text-white font-medium">Suporte 24/7</p>
                    <p className="text-gray-400 text-sm">Assistência completa</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">✓</div>
                  <div>
                    <p className="text-white font-medium">Comissão de Afiliado</p>
                    <p className="text-gray-400 text-sm">30% para quem te convidou</p>
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
