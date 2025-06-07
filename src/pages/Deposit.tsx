
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Smartphone, Wallet, CheckCircle, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Deposit = () => {
  const { userData } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState(userData?.email || '');

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'from-green-500 to-green-600' },
    { id: 'emola', name: 'e-Mola', icon: Wallet, color: 'from-blue-500 to-blue-600' },
  ];

  const handleSendToWhatsApp = () => {
    if (!amount || !paymentMethod || !phoneNumber || !email) {
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

    const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
    
    // Criar mensagem para WhatsApp
    const message = `🏦 *SOLICITAÇÃO DE DEPÓSITO - MINE WEALTH*

👤 *DADOS DO CLIENTE:*
• Nome: ${userData?.username || 'N/A'}
• Email: ${email}
• Telefone de Pagamento: ${phoneNumber}

💰 *DETALHES DO DEPÓSITO:*
• Valor: ${depositAmount} MT
• Método: ${selectedMethod?.name}
• Data/Hora: ${new Date().toLocaleString('pt-PT')}

📋 *INSTRUÇÕES:*
O cliente deseja fazer um depósito de ${depositAmount} MT via ${selectedMethod?.name} para a conta ${email}.

Por favor, processar este depósito e confirmar quando concluído.

Mine Wealth - Sistema de Mineração`;

    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/258853816787?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Pedido enviado! 📱",
      description: "Seu pedido foi enviado para o WhatsApp. Nossa equipe processará em breve.",
    });

    // Limpar formulário
    setAmount('');
    setPhoneNumber('');
    setPaymentMethod('');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-32 w-32 border-4 border-gold-400 border-t-transparent rounded-full mx-auto mb-4"></div>
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
              Solicite seu depósito via WhatsApp - Processamento manual e seguro
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
              <CardTitle className="text-white text-xl sm:text-2xl flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-green-400" />
                Solicitação de Depósito
              </CardTitle>
              <CardDescription className="text-gray-300">
                Preencha os dados e envie sua solicitação via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email da Conta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <p className="text-sm text-gray-400">Email que receberá o saldo</p>
              </div>

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
                onClick={handleSendToWhatsApp}
                disabled={!amount || !paymentMethod || !phoneNumber || !email}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 font-semibold h-12 text-base sm:text-lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Enviar Solicitação via WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* Instructions and Info */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-green-400" />
                  Como Funciona
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-gray-300 text-sm">Preencha todos os dados do depósito</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-gray-300 text-sm">Clique para enviar via WhatsApp</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-gray-300 text-sm">Nossa equipe processará manualmente</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-300 text-sm">Saldo creditado após confirmação</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods Info */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  Métodos Aceitos
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
                        <p className="text-gray-400 text-sm">Processamento via WhatsApp</p>
                      </div>
                      <Badge className="ml-auto bg-green-600 text-white">Ativo</Badge>
                    </div>
                  );
                })}
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
                      <li>• Valor mínimo: 100 MT</li>
                      <li>• Processamento manual via WhatsApp</li>
                      <li>• Tempo de processamento: até 24h</li>
                      <li>• Confirme seus dados antes de enviar</li>
                      <li>• Suporte: +258 85 381 6787</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <MessageCircle className="h-8 w-8 text-blue-400" />
                  <div>
                    <h3 className="text-blue-400 font-semibold">Suporte WhatsApp</h3>
                    <p className="text-white font-bold text-lg">+258 85 381 6787</p>
                    <p className="text-gray-400 text-sm">Disponível 24/7 para processar depósitos</p>
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
