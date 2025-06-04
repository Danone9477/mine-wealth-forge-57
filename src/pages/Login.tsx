
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, Eye, EyeOff, Mail } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.emailOrUsername.trim()) {
      return;
    }
    
    if (!formData.password.trim()) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Tentando fazer login...');
      await login(formData.emailOrUsername.trim(), formData.password);
      
      // Se chegou aqui, o login foi bem-sucedido
      console.log('Login bem-sucedido, navegando para dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      // O toast de erro já é mostrado pelo contexto de auth
      // Não navegar em caso de erro - ficar na tela de login
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      return;
    }
    
    setResetLoading(true);
    
    try {
      await resetPassword(resetEmail.trim());
      setShowResetPassword(false);
      setResetEmail('');
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setResetLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-4 animate-glow">
              <Mail className="w-8 h-8 text-gray-900" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Recuperar Conta
            </h1>
            <p className="text-gray-400 mt-2">
              Digite seu email para redefinir sua senha
            </p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Redefinir Senha</CardTitle>
              <CardDescription className="text-gray-400">
                Enviaremos um link para redefinir sua senha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-gray-300">Email</Label>
                  <Input
                    id="resetEmail"
                    name="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white focus:border-gold-400"
                    placeholder="Seu email de cadastro"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500 font-semibold"
                  disabled={resetLoading || !resetEmail.trim()}
                >
                  {resetLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </Button>

                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowResetPassword(false)}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Voltar ao Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-4 animate-glow">
            <Coins className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-400 mt-2">
            Acesse sua conta e continue ganhando
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Fazer Login</CardTitle>
            <CardDescription className="text-gray-400">
              Entre com seu email/usuário e senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername" className="text-gray-300">Email ou Nome de Usuário</Label>
                <Input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white focus:border-gold-400"
                  placeholder="Email ou nome de usuário"
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
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-sm text-gold-400 hover:text-gold-300"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500 font-semibold"
                disabled={loading || !formData.emailOrUsername.trim() || !formData.password.trim()}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium">
                  Registrar-se
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-blue-400/10 border border-blue-400/20 rounded-lg">
              <p className="text-sm text-blue-300 text-center">
                💡 <span className="font-semibold">Dica:</span> Use seu email ou nome de usuário para fazer login
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
