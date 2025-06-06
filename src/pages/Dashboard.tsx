
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, TrendingUp, Users, Award, Zap, DollarSign, Plus, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InvestmentStats from '@/components/InvestmentStats';
import Testimonials from '@/components/Testimonials';
import InvestmentBenefits from '@/components/InvestmentBenefits';

const Dashboard = () => {
  const { userData } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando seus investimentos...</p>
        </div>
      </div>
    );
  }

  const totalInvested = userData.transactions
    ?.filter(t => t.type === 'deposit' && t.status === 'success')
    ?.reduce((sum, t) => sum + t.amount, 0) || 0;

  const monthlyReturn = totalInvested * 0.158; // 15.8% monthly return

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Dashboard Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600/10 to-green-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23fbbf24" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bem-vindo de volta, <span className="text-gold-400">{userData.username}!</span>
            </h1>
            <p className="text-gray-300">
              {currentTime.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} - {currentTime.toLocaleTimeString('pt-BR')}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Balance Card */}
            <Card className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border-gold-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Wallet className="h-8 w-8 text-gold-400" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gold-400 hover:text-gold-300"
                  >
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
                <div>
                  <p className="text-gold-200 font-medium text-sm">Saldo Total</p>
                  <p className="text-3xl font-bold text-white">
                    {showBalance ? `${userData.balance.toFixed(2)} MT` : '••••••'}
                  </p>
                  <p className="text-gold-300 text-xs mt-1">💰 Seu patrimônio digital</p>
                </div>
              </CardContent>
            </Card>

            {/* Invested Card */}
            <Card className="bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                  <Badge className="bg-green-600 text-white">Ativo</Badge>
                </div>
                <div>
                  <p className="text-green-200 font-medium text-sm">Total Investido</p>
                  <p className="text-3xl font-bold text-white">
                    {showBalance ? `${totalInvested.toFixed(2)} MT` : '••••••'}
                  </p>
                  <p className="text-green-300 text-xs mt-1">📈 Gerando retornos</p>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Return Card */}
            <Card className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="h-8 w-8 text-blue-400" />
                  <Badge className="bg-blue-600 text-white">Projetado</Badge>
                </div>
                <div>
                  <p className="text-blue-200 font-medium text-sm">Retorno Mensal</p>
                  <p className="text-3xl font-bold text-white">
                    {showBalance ? `${monthlyReturn.toFixed(2)} MT` : '••••••'}
                  </p>
                  <p className="text-blue-300 text-xs mt-1">🚀 ROI de 15.8%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Grid */}
          <InvestmentStats />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">Visão Geral</TabsTrigger>
            <TabsTrigger value="invest" className="text-gray-300 data-[state=active]:text-white">Investir</TabsTrigger>
            <TabsTrigger value="testimonials" className="text-gray-300 data-[state=active]:text-white">Testemunhos</TabsTrigger>
            <TabsTrigger value="benefits" className="text-gray-300 data-[state=active]:text-white">Vantagens</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userData.transactions && userData.transactions.length > 0 ? (
                    <div className="space-y-3">
                      {userData.transactions.slice(-5).reverse().map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <div>
                            <p className="text-white font-medium text-sm">
                              {transaction.type === 'deposit' ? '💰 Depósito' : '💸 Saque'}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toFixed(2)} MT
                            </p>
                            <Badge 
                              variant={transaction.status === 'success' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {transaction.status === 'success' ? 'Sucesso' : 
                               transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">Nenhuma transação ainda</p>
                      <Link to="/deposit">
                        <Button className="bg-gold-600 hover:bg-gold-700 text-white">
                          <Plus className="mr-2 h-4 w-4" />
                          Fazer Primeiro Depósito
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">🚀 Ações Rápidas</CardTitle>
                  <CardDescription className="text-gray-300">
                    Comece a investir e multiplique seu patrimônio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/deposit" className="block">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-12">
                      <Plus className="mr-2 h-5 w-5" />
                      Depositar e Investir
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  
                  <Link to="/miners" className="block">
                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:text-white h-12">
                      <Award className="mr-2 h-5 w-5" />
                      Ver Mineradores
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  
                  <Link to="/affiliates" className="block">
                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:text-white h-12">
                      <Users className="mr-2 h-5 w-5" />
                      Programa de Afiliados
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invest">
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-white mb-4">💎 Pronto para Investir?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de investidores que já estão construindo riqueza com Mine Wealth. 
                Comece hoje e veja seu patrimônio crescer exponencialmente!
              </p>
              <Link to="/deposit">
                <Button size="lg" className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-8 py-4 text-lg">
                  <TrendingUp className="mr-2 h-6 w-6" />
                  Começar a Investir Agora
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <Testimonials />
          </TabsContent>

          <TabsContent value="benefits">
            <InvestmentBenefits />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
