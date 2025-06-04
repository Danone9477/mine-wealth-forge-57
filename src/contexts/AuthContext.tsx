
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

interface AffiliateStats {
  totalInvited: number;
  activeReferralsCount: number;
  totalCommissions: number;
  monthlyCommissions: number;
  totalClicks: number;
  todayClicks: number;
  lastClickDate?: string;
  activeReferralsList: Array<{
    username: string;
    date: string;
    commission: number;
    depositAmount: number;
    timestamp: string;
  }>;
  referralsList: Array<{
    username: string;
    date: string;
    commission: number;
  }>;
}

interface UserData {
  uid: string;
  username: string;
  email: string;
  balance: number;
  totalEarnings: number;
  monthlyEarnings?: number;
  miners: any[];
  lastTaskDate?: string;
  transactions?: any[];
  affiliateCode?: string;
  affiliateBalance?: number;
  affiliateStats?: AffiliateStats;
  referredBy?: string | null;
  canWithdraw?: boolean;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para encontrar email por username
  const findEmailByUsername = async (username: string): Promise<string | null> => {
    try {
      console.log('Procurando email para username:', username);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const email = userDoc.data().email;
        console.log('Email encontrado para username:', email);
        return email;
      }
      console.log('Username não encontrado');
      return null;
    } catch (error) {
      console.error('Erro ao buscar username:', error);
      return null;
    }
  };

  // Função para verificar se username já existe
  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar username:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    console.log('=== INICIANDO PROCESSO DE REGISTRO ===');
    console.log('Email:', email);
    console.log('Username:', username);
    
    try {
      // Validações básicas
      if (!email?.trim()) {
        throw new Error('Email é obrigatório');
      }
      
      if (!password || password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }
      
      if (!username?.trim() || username.trim().length < 3) {
        throw new Error('Nome de usuário deve ter pelo menos 3 caracteres');
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanUsername = username.trim().toLowerCase();

      // Verificar se username já existe
      console.log('Verificando se username já existe...');
      const usernameExists = await checkUsernameExists(cleanUsername);
      if (usernameExists) {
        throw new Error('Nome de usuário já está em uso');
      }

      // Verificar código de afiliado
      let referralCode: string | null = null;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        referralCode = urlParams.get('ref');
        if (referralCode) {
          console.log('Código de afiliado detectado:', referralCode);
        }
      } catch (error) {
        console.log('Erro ao verificar código de afiliado (não crítico):', error);
      }

      // Criar conta no Firebase Auth
      console.log('Criando conta no Firebase Auth...');
      const result = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      console.log('Conta Firebase criada com sucesso, UID:', result.user.uid);
      
      // Gerar código de afiliado único
      const affiliateCode = `REF${cleanUsername.toUpperCase().substring(0, 4)}${Date.now().toString().slice(-4)}`;
      console.log('Código de afiliado gerado:', affiliateCode);
      
      // Criar dados do usuário - CORRIGINDO PROBLEMA DE UNDEFINED
      const newUserData: UserData = {
        uid: result.user.uid,
        username: cleanUsername,
        email: cleanEmail,
        balance: 0,
        totalEarnings: 0,
        monthlyEarnings: 0,
        miners: [],
        transactions: [],
        affiliateCode,
        affiliateBalance: 0,
        // Só incluir o referredBy se o código existir e for válido
        ...(referralCode ? { referredBy: referralCode } : {}),
        canWithdraw: false,
        isAdmin: false,
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
      };
      
      // Salvar dados no Firestore
      console.log('Salvando dados do usuário no Firestore...');
      await setDoc(doc(db, 'users', result.user.uid), newUserData);
      console.log('Dados salvos com sucesso no Firestore');
      
      setUserData(newUserData);

      // Processar referral se existir
      if (referralCode) {
        try {
          console.log('Processando código de afiliado...');
          const affiliateQuery = query(
            collection(db, 'users'),
            where('affiliateCode', '==', referralCode)
          );
          
          const affiliateSnapshot = await getDocs(affiliateQuery);
          
          if (!affiliateSnapshot.empty) {
            const affiliateDoc = affiliateSnapshot.docs[0];
            const affiliateData = affiliateDoc.data();
            console.log('Afiliado encontrado:', affiliateData.username);
            
            const currentStats = affiliateData.affiliateStats || {};
            const updatedStats = {
              ...currentStats,
              totalInvited: (currentStats.totalInvited || 0) + 1,
              lastInviteDate: new Date().toISOString()
            };
            
            await updateDoc(doc(db, 'users', affiliateDoc.id), {
              affiliateStats: updatedStats
            });
            
            console.log('Estatísticas do afiliado atualizadas');
          }
        } catch (error) {
          console.log('Erro ao processar afiliado (não crítico):', error);
          // Não interrompe o fluxo se houver erro no processamento do afiliado
        }
      }
      
      console.log('=== REGISTRO COMPLETADO COM SUCESSO ===');
      
      toast({
        title: "Conta criada com sucesso! 🎉",
        description: referralCode ? 
          `Bem-vindo ao Mine Wealth! Você foi convidado por ${referralCode}` : 
          "Bem-vindo ao Mine Wealth!",
      });
      
    } catch (error: any) {
      console.error('=== ERRO NO REGISTRO ===', error);
      
      let errorMessage = "Erro ao criar conta";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este email já está cadastrado. Tente fazer login ou use outro email.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao criar conta ❌",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw new Error(errorMessage);
    }
  };

  const login = async (emailOrUsername: string, password: string) => {
    console.log('=== INICIANDO PROCESSO DE LOGIN ===');
    console.log('Email/Username:', emailOrUsername);
    
    try {
      // Validações básicas
      if (!emailOrUsername?.trim()) {
        throw new Error('Email ou nome de usuário é obrigatório');
      }
      
      if (!password?.trim()) {
        throw new Error('Senha é obrigatória');
      }

      let email = emailOrUsername.trim().toLowerCase();
      
      // Se não contém @, é um username
      if (!email.includes('@')) {
        console.log('Detectado username, buscando email...');
        const foundEmail = await findEmailByUsername(email);
        if (!foundEmail) {
          throw new Error('Nome de usuário não encontrado');
        }
        email = foundEmail;
        console.log('Email encontrado para username:', email);
      }
      
      console.log('Tentando fazer login com email:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      console.log('=== LOGIN REALIZADO COM SUCESSO ===');
      toast({
        title: "Login realizado com sucesso! ✅",
        description: "Bem-vindo de volta!",
      });
      
    } catch (error: any) {
      console.error('=== ERRO NO LOGIN ===', error);
      
      let errorMessage = "Email/usuário ou senha incorretos";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Usuário não encontrado. Verifique seu email/usuário.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Senha incorreta. Tente novamente.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "Esta conta foi desabilitada. Entre em contato com o suporte.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Credenciais inválidas. Verifique email/usuário e senha.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro no login ❌",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      toast({
        title: "Logout realizado ✅",
        description: "Até logo!",
      });
    } catch (error: any) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout ❌",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!email?.trim()) {
        throw new Error('Email é obrigatório');
      }
      
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      toast({
        title: "Email enviado! 📧",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    } catch (error: any) {
      console.error('Erro no reset de senha:', error);
      
      let errorMessage = "Erro ao enviar email de recuperação";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Email não encontrado";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro no envio ❌",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw new Error(errorMessage);
    }
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user || !userData) return;
    
    try {
      const updatedData = { ...userData, ...data };
      await setDoc(doc(db, 'users', user.uid), updatedData);
      setUserData(updatedData);
    } catch (error: any) {
      console.error('Erro ao atualizar dados:', error);
      toast({
        title: "Erro ao atualizar dados ❌",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log('Configurando listener de autenticação...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Estado de autenticação mudou:', user ? 'Logado' : 'Deslogado');
      setUser(user);
      
      if (user) {
        try {
          console.log('Carregando dados do usuário...');
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            console.log('Dados do usuário carregados:', data.username);
            setUserData(data);
          } else {
            console.log('Documento do usuário não encontrado');
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userData,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
