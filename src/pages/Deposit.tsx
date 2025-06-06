
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Smartphone, Wallet, CheckCircle, Clock, AlertCircle, Loader2, MessageCircle, Send, Mail, Phone, Users, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const Deposit = () => {
  const { userData, updateUserData } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showManualDeposit, setShowManualDeposit] = useState(false);
  const [depositNotes, setDepositNotes] = useState('');
  const SUPPORT_WHATSAPP = "853816787";

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'from-green-500 to-green-600' },
    { id: 'emola', name: 'e-Mola', icon: Wallet, color: 'from-blue-500 to-blue-600' },
    { id: 'manual', name: 'Depósito Manual (Suporte)', icon: MessageCircle, color: 'from-purple-500 to-purple-600' },
  ];

  const handleManualDeposit = () => {
    if (!userData) {
      toast({
        title: "Erro de autenticação",
        description: "Por favor, faça login novamente",
        variant: "destructive",
      });
      return;
    }

    if (!amount || !userEmail || !phoneNumber) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
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

    // Criar mensagem para WhatsApp
    const message = `🏦 *NOVA SOLICITAÇÃO DE DEPÓSITO*

👤 *Cliente:* ${userData.username}
📧 *Email para receber:* ${userEmail}
📱 *Telefone:* ${phoneNumber}
💰 *Valor:* ${depositAmount.toFixed(2)} MT
🎯 *Método escolhido:* ${paymentMethods.find(m => m.id === paymentMethod)?.name}

📝 *Observações:*
${depositNotes || 'Nenhuma observação adicional'}

⏰ *Data/Hora:* ${new Date().toLocaleString('pt-BR')}

_Solicitação enviada via Mine Wealth Platform_`;

    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodedMessage}`;

    // Criar transação pendente
    const transaction = {
      id: Date.now().toString(),
      type: 'deposit' as const,
      amount: depositAmount,
      status: 'pending' as const,
      date: new Date().toISOString(),
      description: `Solicitação de depósito manual - ${userEmail}`,
      paymentMethod: paymentMethod,
      phoneNumber,
      userEmail,
      notes: depositNotes
    };

    // Adicionar ao histórico
    updateUserData({
      transactions: [...(userData.transactions || []), transaction]
    });

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');

    toast({
      title: "Solicitação enviada! 🚀",
      description: "Sua solicitação foi enviada para o suporte. Aguarde o processamento.",
    });

    // Limpar formulário
    setAmount('');
    setUserEmail('');
    setPhoneNumber('');
    setDepositNotes('');
    setPaymentMethod('');
    setShowManualDeposit(false);
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

    // Mostrar toast de processamento
    toast({
      title: "Processando pagamento...",
      description: `Conectando com ${paymentMethods.find(m => m.id === paymentMethod)?.name}`,
    });

    try {
      console.log('Iniciando depósito:', {
        method: paymentMethod,
        phone: phoneNumber,
        amount: depositAmount,
        username: userData.username
      });

      const paymentResult = await processPayment(
        paymentMethod as 'emola' | 'mpesa',
        phoneNumber,
        depositAmount,
        userData.username
      );

      console.log('Resultado completo do pagamento:', paymentResult);

      // Criar transação no histórico
      const transaction = {
        id: Date.now().toString(),
        type: 'deposit' as const,
        amount: depositAmount,
        status: paymentResult.success ? 'success' as const : 'failed' as const,
        date: new Date().toISOString(),
        description: `Depósito via ${paymentMethods.find(m => m.id === paymentMethod)?.name} - ${phoneNumber}`,
        paymentMethod,
        phoneNumber,
        transactionId: paymentResult.transactionId
      };

      if (paymentResult.success) {
        // Processar comissão de afiliado se aplicável
        if (userData.referredBy) {
          console.log('Processando comissão para:', userData.referredBy);
          await processAffiliateCommission(depositAmount, userData.uid, userData);
        }

        const newBalance = userData.balance + depositAmount;
        console.log('Atualizando saldo:', { oldBalance: userData.balance, newBalance, depositAmount });

        await updateUserData({
          balance: newBalance,
          transactions: [...(userData.transactions || []), transaction]
        });

        toast({
          title: "Depósito realizado com sucesso! 🎉",
          description: `${depositAmount} MT foram adicionados à sua conta. Novo saldo: ${newBalance.toFixed(2)} MT`,
        });

        // Limpar formulário
        setAmount('');
        setPhoneNumber('');
        setPaymentMethod('');
      } else {
        // Adicionar transação falhada ao histórico
        await updateUserData({
          transactions: [...(userData.transactions || []), transaction]
        });

        toast({
          title: "Depósito não aprovado",
          description: paymentResult.message,
          variant: "destructive",
        });
        
        // Log detalhado para debug
        console.error('Pagamento falhou:', {
          message: paymentResult.message,
          rawResponse: paymentResult.rawResponse
        });
      }

    } catch (error) {
      console.error('Erro crítico no processamento do depósito:', error);
      
      // Adicionar transação de erro ao histórico
      const errorTransaction = {
        id: Date.now().toString(),
        type: 'deposit' as const,
        amount: depositAmount,
        status: 'failed' as const,
        date: new Date().toISOString(),
        description: `Erro no depósito via ${paymentMethods.find(m => m.id === paymentMethod)?.name} - ${phoneNumber}`,
        paymentMethod,
        phoneNumber
      };

      await updateUserData({
        transactions: [...(userData.transactions || []), errorTransaction]
      });

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
      {/* Hero Section with Investment Appeal */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gold-400/5 to-transparent opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Investir é o Seu Futuro
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              💎 Comece hoje a construir sua riqueza com Mine Wealth - A plataforma que transforma seus depósitos em lucros reais
            </p>
            
            {/* Investment Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-4 rounded-lg border border-green-500/30">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-green-300 font-semibold">ROI Garantido</p>
                <p className="text-xs text-gray-400">Retorno sobre investimento</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-lg border border-blue-500/30">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-blue-300 font-semibold">+1000 Investidores</p>
                <p className="text-xs text-gray-400">Confiaram em nós</p>
              </div>
              <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 p-4 rounded-lg border border-gold-500/30">
                <Wallet className="h-8 w-8 text-gold-400 mx-auto mb-2" />
                <p className="text-sm text-gold-300 font-semibold">100% Seguro</p>
                <p className="text-xs text-gray-400">Depósitos protegidos</p>
              </div>
            </div>
          </div>

          {/* Current Balance with Enhanced Design */}
          <div className="max-w-md mx-auto mb-8">
            <Card className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border-gold-500/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400/10 to-transparent"></div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Wallet className="h-8 w-8 text-gold-400" />
                  <div>
                    <p className="text-gold-200 font-medium">💰 Seu Patrimônio</p>
                    <p className="text-3xl font-bold text-white">{userData.balance.toFixed(2)} MT</p>
                    <p className="text-xs text-gold-300">Pronto para crescer ainda mais</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Deposit Form */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-xl sm:text-2xl flex items-center gap-2">
                <Send className="h-6 w-6 text-green-400" />
                Fazer Depósito
              </CardTitle>
              <CardDescription className="text-gray-300">
                Escolha entre depósito automático ou manual com suporte personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white font-medium">💰 Valor (MT)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Valor mínimo: 100 MT"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-lg font-semibold"
                  min="100"
                />
                <p className="text-sm text-gray-400">💡 Quanto mais investir, maior será seu retorno</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">🏦 Método de Pagamento</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Escolha como deseja depositar" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <SelectItem key={method.id} value={method.id} className="text-white hover:bg-gray-700">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {method.name}
                            {method.id === 'manual' && <Badge className="bg-purple-600 text-white text-xs">Recomendado</Badge>}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-medium">📱 Número de Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ex: 84xxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {paymentMethod === 'manual' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-medium">📧 Email para Receber o Depósito</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu-email@exemplo.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    <p className="text-sm text-gray-400">Email onde receberá as instruções de pagamento</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-white font-medium">📝 Observações (Opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Alguma informação adicional..."
                      value={depositNotes}
                      onChange={(e) => setDepositNotes(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </>
              )}

              {paymentMethod === 'manual' ? (
                <Button
                  onClick={handleManualDeposit}
                  disabled={loading || !amount || !phoneNumber || !userEmail}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 font-semibold h-12 text-base sm:text-lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Solicitar Depósito via Suporte
                </Button>
              ) : (
                <Button
                  disabled={true}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 font-semibold h-12 text-base sm:text-lg opacity-50"
                >
                  Depósito Automático (Em Breve)
                </Button>
              )}

              {paymentMethod === 'manual' && (
                <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-purple-300 font-semibold text-sm">Atendimento Personalizado</h4>
                      <p className="text-gray-300 text-xs mt-1">
                        Ao clicar em "Solicitar", você será redirecionado para o WhatsApp do nosso suporte especializado. 
                        Você receberá instruções detalhadas e acompanhamento pessoal do seu depósito.
                      </p>
                      <p className="text-purple-400 text-xs font-medium mt-2">📞 Suporte: +258 {SUPPORT_WHATSAPP}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Right Sidebar */}
          <div className="space-y-6">
            {/* Payment Methods Enhanced */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  Métodos Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <div key={method.id} className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${method.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{method.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {method.id === 'manual' ? 'Suporte personalizado via WhatsApp' : 'Transferência automática'}
                        </p>
                      </div>
                      <Badge className={method.id === 'manual' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'}>
                        {method.id === 'manual' ? 'Disponível' : 'Em Breve'}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Why Invest Section */}
            <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                  Por Que Investir Hoje?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">💎</div>
                  <span className="text-gray-300 text-sm">Retornos consistentes e crescentes</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">🛡️</div>
                  <span className="text-gray-300 text-sm">Plataforma 100% segura e regulamentada</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">🚀</div>
                  <span className="text-gray-300 text-sm">Tecnologia de mineração avançada</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">👥</div>
                  <span className="text-gray-300 text-sm">Suporte 24/7 especializado</span>
                </div>
              </CardContent>
            </Card>

            {/* Support Contact Enhanced */}
            <Card className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MessageCircle className="h-8 w-8 text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-blue-400 font-semibold mb-2">Suporte Especializado</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Nossa equipe está pronta para ajudar você a maximizar seus investimentos
                    </p>
                    <Button 
                      onClick={() => window.open(`https://wa.me/${SUPPORT_WHATSAPP}`, '_blank')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Falar com Especialista
                    </Button>
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
