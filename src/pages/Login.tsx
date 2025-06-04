
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, Eye, EyeOff, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

// Define schemas para validação
const loginFormSchema = z.object({
  emailOrUsername: z.string().min(1, "Email ou nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória")
});

const resetPasswordSchema = z.object({
  email: z.string().email("Digite um email válido")
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Configuração do hook de formulário para login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailOrUsername: '',
      password: ''
    }
  });

  // Configuração do hook de formulário para resetar senha
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    
    try {
      console.log('Iniciando processo de login...');
      await login(values.emailOrUsername, values.password);
      
      // Se chegou aqui, o login foi bem-sucedido - navegar para dashboard
      console.log('Login bem-sucedido, navegando para dashboard...');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro no login, mantendo na tela de login:', error);
      // Erro já é tratado pelo contexto com toast - não é necessário fazer nada aqui
    } finally {
      setLoading(false);
    }
  };

  const onResetSubmit = async (values: ResetPasswordFormValues) => {
    setResetLoading(true);
    
    try {
      await resetPassword(values.email);
      setShowResetPassword(false);
      resetForm.reset();
      toast({
        title: "Email enviado! 📧",
        description: "Verifique sua caixa de entrada para redefinir sua senha"
      });
    } catch (error: any) {
      // Erro já tratado pelo contexto
      console.error('Erro no reset de senha:', error);
    } finally {
      setResetLoading(false);
    }
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

          <Card className="bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Redefinir Senha</CardTitle>
              <CardDescription className="text-gray-400">
                Enviaremos um link para redefinir sua senha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 transition-colors"
                            placeholder="seu@email.com"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-sm" />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500 font-semibold transition-all"
                    disabled={resetLoading || !resetForm.formState.isValid}
                  >
                    {resetLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </div>
                    ) : (
                      'Enviar Link de Recuperação'
                    )}
                  </Button>

                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowResetPassword(false)}
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Voltar ao Login
                  </Button>
                </form>
              </Form>
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

        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Fazer Login</CardTitle>
            <CardDescription className="text-gray-400">
              Entre com seu email/usuário e senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="emailOrUsername"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-300">Email ou Nome de Usuário</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 transition-colors"
                          placeholder="Email ou nome de usuário"
                          autoComplete="username"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-300">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 pr-10 transition-colors"
                            placeholder="Sua senha"
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500 font-semibold transition-all disabled:opacity-50"
                  disabled={loading || !loginForm.formState.isValid}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                      Entrando...
                    </div>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
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
