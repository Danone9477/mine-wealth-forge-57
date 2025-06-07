
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Smartphone, Wallet, CheckCircle, Clock, AlertCircle, MessageCircle, Copy, Phone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Deposit = () => {
  const { userData } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [email, setEmail] = useState(userData?.email || '');

  const paymentMethods = [
    { 
      id: 'mpesa', 
      name: 'M-Pesa', 
      icon: Smartphone, 
      color: 'from-green-500 to-green-600',
      number: '853816787',
      accountName: 'COSSINATE JOAQUIM FUMO'
    },
    { 
      id: 'emola', 
      name: 'e-Mola', 
      icon: Wallet, 
      color: 'from-blue-500 to-blue-600',
      number: '863823659',
      accountName: 'NOÉ PEDRO MACIE'
    },
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado! 📋",
      description: `${label} copiado para a área de transferência`,
    });
  };

  const handleSendToWhatsApp = () => {
    if (!amount || !paymentMethod || !transactionId || !email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos incluindo o ID de transação",
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
    const message = `🏦 *CONFIRMAÇÃO DE DEPÓSITO - MINE WEALTH*

👤 *DADOS DO CLIENTE:*
• Nome: ${userData?.username || 'N/A'}
• Email: ${email}

💰 *DETALHES DO DEPÓSITO:*
• Valor: ${depositAmount} MT
• Método: ${selectedMethod?.name}
• Número de Destino: ${selectedMethod?.number}
• Nome da Conta: ${selectedMethod?.accountName}
• ID de Transação: ${transactionId}
• Data/Hora: ${new Date().toLocaleString('pt-PT')}

✅ *CONFIRMAÇÃO:*
Acabei de enviar ${depositAmount} MT via ${selectedMethod?.name} para o número ${selectedMethod?.number} (${selectedMethod?.accountName}).

O ID da transação é: ${transactionId}

Por favor, confirmar o recebimento e creditar o saldo na minha conta (${email}).

Obrigado!
Mine Wealth - Sistema de Mineração`;

    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/258853816787?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Confirmação enviada! 📱",
      description: "Sua confirmação foi enviada para o WhatsApp. Aguarde a verificação.",
    });

    // Limpar formulário
    setAmount('');
    setTransactionId('');
    setPaymentMethod('');
  };

  const selectedMethodData = paymentMethods.find(m => m.id === paymentMethod);

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
              Faça seu depósito via M-Pesa ou e-Mola e confirme via WhatsApp
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step by Step Instructions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-blue-400" />
                  Como Fazer Depósito
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <p className="text-white font-semibold">Escolha o método</p>
                      <p className="text-gray-300 text-sm">Selecione M-Pesa ou e-Mola abaixo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <p className="text-white font-semibold">Copie o número</p>
                      <p className="text-gray-300 text-sm">Use o botão copiar para o número da conta</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <p className="text-white font-semibold">Envie o dinheiro</p>
                      <p className="text-gray-300 text-sm">Transfira via app do seu banco</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <p className="text-white font-semibold">Anote o ID</p>
                      <p className="text-gray-300 text-sm">Copie o ID de transação que recebeu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✓</div>
                    <div>
                      <p className="text-white font-semibold">Confirme aqui</p>
                      <p className="text-gray-300 text-sm">Preencha o formulário e envie via WhatsApp</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods Display */}
            {paymentMethod && selectedMethodData && (
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Phone className="h-6 w-6 text-green-400" />
                    Dados para Transferência
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-300 text-sm">Número da Conta</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(selectedMethodData.number, 'Número')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-white font-bold text-xl">{selectedMethodData.number}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-300 text-sm">Nome da Conta</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(selectedMethodData.accountName, 'Nome')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-white font-semibold">{selectedMethodData.accountName}</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded-lg">
                    <p className="text-yellow-200 text-sm">
                      💡 <strong>Dica:</strong> Guarde o ID de transação que receber após enviar o dinheiro
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Deposit Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl sm:text-2xl flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-green-400" />
                  Confirmação de Depósito
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Primeiro envie o dinheiro, depois preencha este formulário
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
                  <Label className="text-white font-medium">Método de Pagamento</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Escolha como enviou o dinheiro" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {paymentMethods.map((method) => {
                        const IconComponent = method.icon;
                        return (
                          <SelectItem key={method.id} value={method.id} className="text-white hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {method.name} - {method.number}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white font-medium">Valor Enviado (MT)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Quanto enviou? (mínimo: 100 MT)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    min="100"
                  />
                  <p className="text-sm text-gray-400">Valor exato que transferiu</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionId" className="text-white font-medium">ID de Transação</Label>
                  <Input
                    id="transactionId"
                    type="text"
                    placeholder="Ex: MP240607.1234.A12345 ou EM240607.5678.B67890"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <p className="text-sm text-gray-400">ID que recebeu após a transferência (obrigatório)</p>
                </div>

                <Button
                  onClick={handleSendToWhatsApp}
                  disabled={!amount || !paymentMethod || !transactionId || !email}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 font-semibold h-12 text-base sm:text-lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Confirmar Depósito via WhatsApp
                </Button>

                <div className="bg-green-900/30 border border-green-700/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-400 font-semibold text-sm">Importante:</p>
                      <p className="text-gray-300 text-sm">
                        Só clique em "Confirmar" depois de ter enviado o dinheiro e ter o ID de transação em mãos.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Contact Info */}
          <Card className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <MessageCircle className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="text-blue-400 font-semibold">Suporte WhatsApp</h3>
                  <p className="text-white font-bold text-lg">+258 85 381 6787</p>
                  <p className="text-gray-400 text-sm">Disponível para confirmar depósitos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-yellow-400 font-semibold mb-2">Tempo de Processamento</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Verificação: até 2 horas</li>
                    <li>• Valor mínimo: 100 MT</li>
                    <li>• ID de transação obrigatório</li>
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
