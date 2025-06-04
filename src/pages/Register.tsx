
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { trackAffiliateClick } from '@/services/paymentService';
import { Coins, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

// Define schema para validação com Zod
const registerFormSchema = z.object({
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres")
    .regex(/^[a-zA-Z0-9]+$/, "Apenas letras e números são permitidos"),
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Configurar o hook de formulário com validação
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
  });

  useEffect(() => {
    // Verificar se há código de afiliado na URL
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

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      console.log('Iniciando processo de registro...');
      await signup(values.email, values.password, values.username);
      
      // Se chegou aqui, o registro foi bem-sucedido
      console.log('Registro bem-sucedido, navegando para dashboard...');
      toast({
        title: "Conta criada com sucesso! 🎉",
        description: "Você será redirecionado para o dashboard."
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro no registro, mantendo na tela de registro:', error);
      // Erro já tratado pelo contexto, não precisa fazer nada aqui
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 'weak', color: 'text-red-400' };
    if (password.length < 6) return { strength: 'weak', color: 'text-red-400' };
    if (password.length < 8) return { strength: 'medium', color: 'text-yellow-400' };
    return { strength: 'strong', color: 'text-green-400' };
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
              <p className="text-green-400 text-xs font-mono">
                Código: {referralCode}
              </p>
            </div>
          )}
        </div>

        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Registrar-se</CardTitle>
            <CardDescription className="text-gray-400">
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-300">Nome de Usuário</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 transition-colors pr-10"
                            placeholder="Mínimo 3 caracteres (apenas letras e números)"
                            autoComplete="username"
                          />
                          {field.value && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {field.value.trim().length >= 3 ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-400" />
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="email"
                            className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 transition-colors pr-10"
                            placeholder="seu@email.com"
                            autoComplete="email"
                          />
                          {field.value && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {field.value.trim().includes('@') ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-400" />
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                            placeholder="Mínimo 6 caracteres"
                            autoComplete="new-password"
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
                      {field.value && (
                        <div className="flex items-center gap-2">
                          <div className={`text-sm ${getPasswordStrength(field.value).color}`}>
                            Força: {getPasswordStrength(field.value).strength === 'weak' ? 'Fraca' : 
                                    getPasswordStrength(field.value).strength === 'medium' ? 'Média' : 'Forte'}
                          </div>
                        </div>
                      )}
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-300">Confirmar Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="bg-gray-700 border-gray-600 text-white focus:border-gold-400 pr-10 transition-colors"
                            placeholder="Confirme sua senha"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                      {form.getValues("confirmPassword") && 
                       form.getValues("password") === form.getValues("confirmPassword") && 
                       form.getValues("password") && (
                        <p className="text-green-400 text-sm flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Senhas coincidem
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-gold text-gray-900 hover:bg-gold-500 font-semibold transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                      Criando conta...
                    </div>
                  ) : (
                    'Criar Conta'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
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
