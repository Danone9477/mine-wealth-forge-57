import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Link as LinkIcon, 
  Copy, 
  TrendingUp, 
  Wallet, 
  DollarSign, 
  UserPlus, 
  Award,
  Share2,
  Gift,
  ArrowUpRight,
  CreditCard
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Affiliates = () => {
  const { userData, updateUserData } = useAuth();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [loading, setLoading] = useState(false);
  
  const affiliateCode = userData?.affiliateCode || `REF${userData?.username?.toUpperCase()}${Date.now().toString().slice(-4)}`;
  const affiliateLink = `${window.location.origin}/register?ref=${affiliateCode}`;
  
  // Estatísticas de afiliados melhoradas
  const affiliateStats = {
    totalInvited: userData?.affiliateStats?.totalInvited || 0, // Pessoas que se registraram
    activeReferralsCount: userData?.affiliateStats?.activeReferralsCount || 0, // Pessoas que fizeram depósitos
    totalCommissions: userData?.affiliateStats?.totalCommissions || 0,
    affiliateBalance: userData?.affiliateBalance || 0,
    monthlyCommissions: userData?.affiliateStats?.monthlyCommissions || 0,
    totalClicks: userData?.affiliateStats?.totalClicks || 0,
    todayClicks: userData?.affiliateStats?.todayClicks || 0,
    activeReferralsList: userData?.affiliateStats?.activeReferralsList || []
  };

  const minWithdraw = 300;

  useEffect(() => {
    // Gerar código de afiliado se não existir
    if (!userData?.affiliateCode) {
      updateUserData({
        affiliateCode,
        affiliateBalance: 0,
        affiliateStats: {
          totalInvited: 0,
          activeReferralsCount: 0,
          totalCommissions: 0,
          monthlyCommissions: 0,
          totalClicks: 0,
          todayClicks: 0,
          activeReferralsList: [],
          referralsList: []
        }
      });
    }
  }, [userData, affiliateCode, updateUserData]);

  const copyAffiliateLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Link copiado! 📋",
      description: "Seu link de afiliado foi copiado para a área de transferência",
    });
  };

  const handleAffiliateWithdraw = async () => {
    if (!userData) return;
    
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount < minWithdraw) {
      toast({
        title: "Valor inválido",
        description: `Saque mínimo de afiliado é ${minWithdraw} MT`,
        variant: "destructive",
      });
      return;
    }

    if (amount > affiliateStats.affiliateBalance) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não tem saldo suficiente para este saque",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawPhone || withdrawPhone.length !== 9) {
      toast({
        title: "Número inválido",
        description: "Por favor, insira um número de telefone válido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Processar saque de afiliado usando a API Gibra Pay
      const response = await fetch("https://gibrapay.online/v1/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "14980a4bce3524a7547214f7b874a105693491a367c746a113c20dfaf1af77cf9fb60e5898146bac57165ef2c4632267e"
        },
        body: JSON.stringify({
          wallet_id: "4c8e3fab-70a2-4b19-a23e-7b4472565c14",
          amount: amount,
          phone_number: withdrawPhone
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Atualizar saldo de afiliado
        const newAffiliateBalance = affiliateStats.affiliateBalance - amount;
        
        const affiliateWithdrawTransaction = {
          id: Date.now().toString(),
          type: 'affiliate_withdraw' as const,
          amount,
          phone: withdrawPhone,
          status: 'success' as const,
          date: new Date().toISOString(),
          description: `Saque de comissões de afiliado`,
          gibra_pay_id: result.data?.id
        };

        const updatedTransactions = [...(userData.transactions || []), affiliateWithdrawTransaction];
        
        await updateUserData({
          affiliateBalance: newAffiliateBalance,
          transactions: updatedTransactions
        });

        toast({
          title: "Saque realizado com sucesso! 🎉",
          description: `${amount} MT de comissões foram enviados para ${withdrawPhone}`,
        });

        setWithdrawAmount('');
        setWithdrawPhone('');
      } else {
        throw new Error(result.message || 'Erro no saque');
      }
    } catch (error) {
      console.error('Erro no saque de afiliado:', error);
      toast({
        title: "Erro no saque",
        description: "Erro ao processar saque. Tente novamente.",
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Programa de Afiliados Mine Wealth
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ganhe 30% de comissão sobre cada depósito dos usuários que você convidar. 
            Construa sua rede e maximize seus lucros no Mine Wealth!
          </p>
        </div>

        {/* Stats Cards - Updated with new metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-blue-300 text-xs font-medium">Cliques no Link</p>
                <p className="text-2xl font-bold text-white">{affiliateStats.totalClicks}</p>
                <p className="text-blue-400 text-xs">Hoje: {affiliateStats.todayClicks}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-purple-300 text-xs font-medium">Registros</p>
                <p className="text-2xl font-bold text-white">{affiliateStats.totalInvited}</p>
                <p className="text-purple-400 text-xs">Via seu link</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-green-300 text-xs font-medium">Usuários Ativos</p>
                <p className="text-2xl font-bold text-white">{affiliateStats.activeReferralsCount}</p>
                <p className="text-green-400 text-xs">Fizeram depósito</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold-900/50 to-gold-800/50 border-gold-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-gold-300 text-xs font-medium">Saldo Afiliado</p>
                <p className="text-2xl font-bold text-white">{affiliateStats.affiliateBalance.toFixed(2)}</p>
                <p className="text-gold-400 text-xs">MT disponível</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-orange-300 text-xs font-medium">Total Ganho</p>
                <p className="text-2xl font-bold text-white">{affiliateStats.totalCommissions.toFixed(2)}</p>
                <p className="text-orange-400 text-xs">MT em comissões</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Affiliate Link Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-gold-400" />
                  Seu Link de Afiliado Mine Wealth
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Compartilhe este link para convidar novos usuários e ganhar comissões no Mine Wealth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Código de Afiliado</Label>
                  <div className="flex gap-2">
                    <Input
                      value={affiliateCode}
                      readOnly
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(affiliateCode);
                        toast({ title: "Código copiado!" });
                      }}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Link de Convite</Label>
                  <div className="flex gap-2">
                    <Input
                      value={affiliateLink}
                      readOnly
                      className="bg-gray-700 border-gray-600 text-white text-sm"
                    />
                    <Button
                      onClick={copyAffiliateLink}
                      className="bg-gradient-gold text-gray-900 hover:bg-gold-500"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-gold-400/10 border border-gold-400/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Gift className="h-5 w-5 text-gold-400 mt-0.5" />
                    <div>
                      <h4 className="text-gold-400 font-semibold">Como Funciona no Mine Wealth:</h4>
                      <ul className="text-gray-300 text-sm space-y-1 mt-2">
                        <li>• Cada clique no seu link é contabilizado</li>
                        <li>• Quando alguém se registrar: +1 registro</li>
                        <li>• Quando essa pessoa fizer depósito: +1 usuário ativo</li>
                        <li>• Você ganha 30% do valor de cada depósito como comissão</li>
                        <li>• Saque mínimo de 300 MT das suas comissões</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commission History */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-gold-400" />
                  Histórico de Comissões
                </CardTitle>
              </CardHeader>
              <CardContent>
                {affiliateStats.activeReferralsList && affiliateStats.activeReferralsList.length > 0 ? (
                  <div className="space-y-3">
                    {affiliateStats.activeReferralsList.map((referral: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{referral.username}</p>
                          <p className="text-gray-400 text-sm">Depósito em {referral.date}</p>
                          <p className="text-gray-500 text-xs">Valor: {referral.depositAmount} MT</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">+{referral.commission.toFixed(2)} MT</p>
                          <p className="text-gray-400 text-sm">Comissão 30%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhuma comissão ainda</p>
                    <p className="text-gray-500 text-sm">Comece a compartilhar seu link!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal Section */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gold-400" />
                  Saque de Comissões
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Retire suas comissões de afiliado (mínimo {minWithdraw} MT)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Valor do Saque (MT)</Label>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={`Mínimo ${minWithdraw} MT`}
                    className="bg-gray-700 border-gray-600 text-white"
                    min={minWithdraw}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Número de Telefone</Label>
                  <Input
                    type="tel"
                    value={withdrawPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 9) {
                        setWithdrawPhone(value);
                      }
                    }}
                    placeholder="84XXXXXXX"
                    className="bg-gray-700 border-gray-600 text-white"
                    maxLength={9}
                  />
                </div>

                <Button
                  onClick={handleAffiliateWithdraw}
                  disabled={loading || !withdrawAmount || !withdrawPhone || parseFloat(withdrawAmount) < minWithdraw}
                  className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500 font-semibold"
                >
                  {loading ? 'Processando...' : `Sacar ${withdrawAmount || '0'} MT`}
                </Button>

                <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-3">
                  <p className="text-blue-300 text-sm">
                    💰 <span className="font-semibold">Saldo disponível:</span> {affiliateStats.affiliateBalance.toFixed(2)} MT
                  </p>
                </div>

                <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-3">
                  <p className="text-green-300 text-sm text-center">
                    <span className="font-semibold">Diferença importante:</span><br/>
                    <span className="text-xs">Saldo da Plataforma: {userData.balance.toFixed(2)} MT (para mineração)</span><br/>
                    <span className="text-xs">Saldo de Afiliado: {affiliateStats.affiliateBalance.toFixed(2)} MT (comissões)</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Card */}
            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                  <h3 className="text-lg font-bold text-white">Performance do Mês</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Comissões este mês:</span>
                    <span className="text-green-400 font-bold">{affiliateStats.monthlyCommissions.toFixed(2)} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Taxa de conversão:</span>
                    <span className="text-white font-bold">
                      {affiliateStats.totalInvited > 0 
                        ? `${((affiliateStats.activeReferralsCount / affiliateStats.totalInvited) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bonus Card */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="h-6 w-6 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Bônus Especiais</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300">10+ referidos ativos: +5% bônus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300">25+ referidos ativos: +10% bônus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300">50+ referidos ativos: +15% bônus</span>
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

export default Affiliates;
