
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { trackAffiliateClick } from '@/services/paymentService';
import { Coins, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há código de afiliado na URL e rastrear clique
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      
      if (refCode) {
        setReferralCode(refCode);
        console.log('Código de afiliado detectado:', refCode);
        
        // Rastrear clique no link de afiliado
        try {
          trackAffiliateClick(refCode);
        } catch (error) {
          console.log('Erro ao rastrear clique de afiliado (não crítico):', error);
        }
      }
    } catch (error) {
      console.log('Erro ao verificar código de afiliado:', error);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.username.trim()) {
      return;
    }
    
    if (!formData.email.trim()) {
      return;
    }
    
    if (!formData.password.trim()) {
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (formData.password.length < 6) {
      return;
    }

    setLoading(true);
    try {
      console.log('Iniciando processo de registro...');
      await signup(formData.email.trim(), formData.password, formData.username.trim());
      
      // Se chegou aqui, o registro foi bem-sucedido
      console.log('Registro bem-sucedido, navegando para dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no registro:', error);
      // O toast de erro já é mostrado pelo contexto de auth
      // Não navegar em caso de erro - ficar na tela de registro
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const isFormValid = () => {
    return (
      formData.username.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.password === formData.confirmPassword &&
      formData.password.length >= 6
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-4 animate-glow">
            <Coins className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
            Criar Conta
          </h1>
          <p className="text-gray-400 mt-2">
            Comece a ganhar dinheiro automaticamente
          </p>
          {referralCode && (
            <div className="mt-4 p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
              <p className="text-green-300 text-sm">
                🎉 Você foi convidado por um afiliado Mine Wealth!
              </p>
              <p className="text-green-400 text-xs">
                Código: {referralCode}
              </p>
            </div>
          )}
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Registrar-se</CardTitle>
            <CardDescription className="text-gray-400">
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Nome de Usuário</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white focus:border-gold-400"
                  placeholder="Seu nome de usuário"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white focus:border-gold-400"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 pr-10"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && formData.password.length < 6 && (
                  <p className="text-red-400 text-sm">A senha deve ter pelo menos 6 caracteres</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 pr-10"
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-sm">As senhas não coincidem</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500 font-semibold"
                disabled={loading || !isFormValid()}
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium">
                  Fazer login
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-gold-400/10 border border-gold-400/20 rounded-lg">
              <p className="text-sm text-gold-300 text-center">
                🎉 <span className="font-semibold">Bônus de Boas-vindas:</span> Receba 50 MT grátis ao fazer seu primeiro depósito!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
