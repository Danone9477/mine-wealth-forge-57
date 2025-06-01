
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Banknote, AlertTriangle, CheckCircle, Clock, Shield, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Withdraw = () => {
  const { userData, updateUserData } = useAuth();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const minWithdraw = 50;
  // Verificar se pode sacar: tem minerador OU permissão manual do admin
  const canWithdraw = (userData?.miners?.length > 0) || userData?.canWithdraw === true;

  const handleWithdraw = async () => {
    if (!userData) {
      toast({
        title: "Erro de autenticação",
        description: "Por favor, faça login novamente",
        variant: "destructive",
      });
      return;
    }

    if (!canWithdraw) {
      toast({
        title: "Saque não permitido",
        description: "Você precisa comprar pelo menos 1 minerador ou ter autorização do administrador",
        variant: "destructive",
      });
      return;
    }
    
    const withdrawAmount = parseFloat(amount);
    
    // Validações melhoradas
    if (!amount || isNaN(withdrawAmount) || withdrawAmount < minWithdraw) {
      toast({
        title: "Valor inválido",
        description: `Saque mínimo é de ${minWithdraw} MT`,
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

    if (!phone || phone.length !== 9) {
      toast({
        title: "Número inválido",
        description: "Por favor, insira um número de telefone válido com 9 dígitos",
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

    if (!name || name.trim().length < 2) {
      toast({
        title: "Nome inválido",
        description: "Por favor, insira seu nome completo",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('Iniciando saque...', { amount: withdrawAmount, phone, name });

    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Criar transação pendente - será processada manualmente
      const transaction = {
        id: Date.now().toString(),
        type: 'withdraw' as const,
        amount: withdrawAmount,
        phone,
        name: name.trim(),
        status: 'pending' as const, // Todos os saques começam como pendentes
        date: new Date().toISOString(),
        description: `Saque para ${name.trim()}`,
        firebase_id: Date.now().toString(), // ID para rastreamento no Firebase
        processed_date: null // Será preenchido quando for processado
      };

      // Deduzir o valor do saldo imediatamente, mas o saque fica pendente
      const updatedTransactions = [...(userData.transactions || []), transaction];
      await updateUserData({
        balance: userData.balance - withdrawAmount,
        transactions: updatedTransactions
      });

      toast({
        title: "Saque solicitado com sucesso! ⏳",
        description: `${withdrawAmount} MT será processado em até 24h. Acompanhe no histórico.`,
      });

      setAmount('');
      setPhone('');
      setName('');
    } catch (error) {
      console.error('Erro no saque:', error);
      
      const failedTransaction = {
        id: Date.now().toString(),
        type: 'withdraw' as const,
        amount: withdrawAmount,
        phone,
        name: name.trim(),
        status: 'failed' as const,
        date: new Date().toISOString(),
        description: `Falha no saque para ${name.trim()}`,
        error: error instanceof Error ? error.message : 'Erro no processamento'
      };

      const updatedTransactions = [...(userData.transactions || []), failedTransaction];
      await updateUserData({
        transactions: updatedTransactions
      });

      toast({
        title: "Erro no saque",
        description: "Tente novamente ou contacte o suporte",
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

  const pendingWithdraws = userData.transactions?.filter(t => t.type === 'withdraw' && t.status === 'pending') || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Fazer Saque
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Retire seus ganhos de forma rápida e segura
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-green-500/20 border border-green-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3">
            <Banknote className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            <span className="text-green-400 font-semibold text-sm sm:text-base">Saldo disponível: {userData.balance} MT</span>
          </div>
        </div>

        {/* Pending Withdraws Alert */}
        {pendingWithdraws.length > 0 && (
          <Card className="bg-yellow-900/20 border-yellow-700 mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-yellow-400">Saques Pendentes</h3>
                  <p className="text-gray-300 text-sm">
                    Você tem {pendingWithdraws.length} saque(s) aguardando processamento. 
                    Total: {pendingWithdraws.reduce((sum, t) => sum + t.amount, 0)} MT
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!canWithdraw && (
          <Card className="bg-red-900/20 border-red-700 mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-red-400">Saque Bloqueado</h3>
                  <p className="text-gray-300 text-sm">
                    Você precisa comprar pelo menos 1 minerador ou ter autorização do administrador. 
                    <Button asChild variant="link" className="text-gold-400 hover:text-gold-300 p-0 ml-1 h-auto">
                      <a href="/miners">Compre agora</a>
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Withdraw Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Detalhes do Saque</CardTitle>
                <CardDescription className="text-gray-400">
                  Preencha os dados para processar seu saque
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-300">Valor do Saque (MT)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Mínimo ${minWithdraw} MT`}
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 focus:ring-gold-400"
                    min={minWithdraw}
                    max={userData.balance}
                    step="0.01"
                    disabled={!canWithdraw}
                  />
                  <p className="text-sm text-gray-400">
                    Saque mínimo: {minWithdraw} MT | Máximo disponível: {userData.balance} MT
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 focus:ring-gold-400"
                    disabled={!canWithdraw}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Número de Telefone</Label>
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
                    disabled={!canWithdraw}
                    maxLength={9}
                  />
                  <p className="text-sm text-gray-400">
                    O valor será transferido para este número em até 24h
                  </p>
                </div>

                {/* Processing Info */}
                <Card className="bg-blue-900/20 border-blue-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Info className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="text-blue-300 font-medium text-sm">Processo de Saque</p>
                        <p className="text-gray-300 text-xs">
                          Todos os saques são processados manualmente em até 24h para garantir segurança.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button 
                  type="button"
                  onClick={handleWithdraw}
                  disabled={!canWithdraw || loading || !amount || !phone || !name || parseFloat(amount) < minWithdraw || parseFloat(amount) > userData.balance || isNaN(parseFloat(amount))}
                  className="w-full bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 hover:from-gold-500 hover:to-gold-700 font-semibold h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Processando Saque...
                    </div>
                  ) : !canWithdraw ? (
                    'Compre um Minerador ou Solicite Autorização'
                  ) : (
                    `Solicitar Saque de ${amount || '0'} MT`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-400 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-white">Requisitos</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {canWithdraw ? (
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 border border-gray-400 rounded-full flex-shrink-0" />
                    )}
                    <span className={`text-sm ${canWithdraw ? 'text-green-400' : 'text-gray-400'}`}>
                      Ter minerador OU autorização admin
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-green-400">
                      Saldo mínimo de {minWithdraw} MT
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Time */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-white">Tempo de Processamento</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Saques são processados manualmente e transferidos em até 24 horas para garantir máxima segurança.
                </p>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-white">Segurança</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Todas as transações são verificadas manualmente e criptografadas para garantir máxima segurança.
                </p>
              </CardContent>
            </Card>

            {/* Miners Status */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Status dos Saques</CardTitle>
              </CardHeader>
              <CardContent>
                {canWithdraw ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <p className="text-green-400 font-semibold mb-2">Saques Liberados</p>
                    <p className="text-gray-400 text-sm">
                      {userData.miners?.length > 0 ? 
                        `Você tem ${userData.miners.length} minerador(es) ativo(s)` : 
                        'Autorizado pelo administrador'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                    <p className="text-red-400 font-semibold mb-2">Saques Bloqueados</p>
                    <p className="text-gray-400 text-sm mb-3">Compre um minerador primeiro</p>
                    <Button asChild className="bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 hover:from-gold-500 hover:to-gold-700 text-sm">
                      <a href="/miners">Comprar Minerador</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
