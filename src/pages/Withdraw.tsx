
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Banknote, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Withdraw = () => {
  const { userData, updateUserData } = useAuth();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const minWithdraw = 50;
  const canWithdraw = userData?.miners?.length > 0;

  const handleWithdraw = async () => {
    if (!userData || !canWithdraw) return;
    
    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount < minWithdraw) {
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

    if (!phone || phone.length < 9) {
      toast({
        title: "Número inválido",
        description: "Por favor, insira um número de telefone válido",
        variant: "destructive",
      });
      return;
    }

    if (!name || name.length < 2) {
      toast({
        title: "Nome inválido",
        description: "Por favor, insira seu nome completo",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Adicionar ao histórico
      const transaction = {
        id: Date.now().toString(),
        type: 'withdraw',
        amount: withdrawAmount,
        phone,
        name,
        status: 'success',
        date: new Date().toISOString(),
        description: `Saque para ${name}`
      };

      await updateUserData({
        balance: userData.balance - withdrawAmount,
        transactions: [...(userData.transactions || []), transaction]
      });

      toast({
        title: "Saque processado com sucesso! 🎉",
        description: `${withdrawAmount} MT serão transferidos para ${phone}`,
      });

      setAmount('');
      setPhone('');
      setName('');
    } catch (error) {
      const failedTransaction = {
        id: Date.now().toString(),
        type: 'withdraw',
        amount: withdrawAmount,
        phone,
        name,
        status: 'failed',
        date: new Date().toISOString(),
        description: `Falha no saque para ${name}`
      };

      await updateUserData({
        transactions: [...(userData.transactions || []), failedTransaction]
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Fazer Saque
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Retire seus ganhos de forma rápida e segura
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3">
            <Banknote className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-semibold">Saldo disponível: {userData.balance} MT</span>
          </div>
        </div>

        {!canWithdraw && (
          <Card className="bg-red-900/20 border-red-700 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <div>
                  <h3 className="text-lg font-bold text-red-400">Saque Bloqueado</h3>
                  <p className="text-gray-300">
                    Você precisa comprar pelo menos 1 minerador antes de poder fazer saques. 
                    <a href="/miners" className="text-gold-400 hover:underline ml-1">Compre agora</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400"
                    min={minWithdraw}
                    max={userData.balance}
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
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400"
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
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="84/85/86/87 XXXXXXX"
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400"
                    disabled={!canWithdraw}
                  />
                  <p className="text-sm text-gray-400">
                    O valor será transferido para este número
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleWithdraw}
                  disabled={!canWithdraw || loading || !amount || !phone || !name || parseFloat(amount) < minWithdraw || parseFloat(amount) > userData.balance}
                  className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500 font-semibold h-12"
                >
                  {loading ? 'Processando Saque...' : 
                   !canWithdraw ? 'Compre um Minerador Primeiro' :
                   `Sacar ${amount || '0'} MT`}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                  <h3 className="text-lg font-bold text-white">Requisitos</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {userData.miners?.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <div className="h-4 w-4 border border-gray-400 rounded-full" />
                    )}
                    <span className={`text-sm ${userData.miners?.length > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                      Ter pelo menos 1 minerador
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-green-400">
                      Saldo mínimo de {minWithdraw} MT
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Time */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-8 w-8 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Tempo de Processamento</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Saques são processados automaticamente e transferidos em até 30 minutos.
                </p>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-green-400" />
                  <h3 className="text-lg font-bold text-white">Segurança</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Todas as transações são criptografadas e verificadas para garantir máxima segurança.
                </p>
              </CardContent>
            </Card>

            {/* Miners Status */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Seus Mineradores</CardTitle>
              </CardHeader>
              <CardContent>
                {userData.miners?.length > 0 ? (
                  <div className="space-y-3">
                    {userData.miners.map((miner, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{miner.name}</p>
                          <p className="text-sm text-gray-400">{miner.dailyReturn} MT/dia</p>
                        </div>
                        <Badge className="bg-green-600 text-white">Ativo</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 mb-3">Nenhum minerador ativo</p>
                    <Button asChild className="bg-gradient-gold text-gray-900 hover:bg-gold-500">
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
