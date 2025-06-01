
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

interface AffiliateStats {
  totalInvited: number;
  activeReferrals: number;
  totalCommissions: number;
  monthlyCommissions: number;
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
  miners: any[];
  lastTaskDate?: string;
  transactions?: any[];
  affiliateCode?: string;
  affiliateBalance?: number;
  affiliateStats?: AffiliateStats;
  referredBy?: string;
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

  // Function to find email by username
  const findEmailByUsername = async (username: string): Promise<string | null> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return userDoc.data().email;
      }
      return null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      return null;
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      // Check if username already exists
      const existingEmail = await findEmailByUsername(username);
      if (existingEmail) {
        toast({
          title: "Nome de usuário já existe",
          description: "Escolha outro nome de usuário",
          variant: "destructive",
        });
        return;
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUserData: UserData = {
        uid: result.user.uid,
        username,
        email,
        balance: 0,
        totalEarnings: 0,
        miners: [],
        transactions: [],
        affiliateBalance: 0,
        affiliateStats: {
          totalInvited: 0,
          activeReferrals: 0,
          totalCommissions: 0,
          monthlyCommissions: 0,
          referralsList: []
        }
      };
      
      await setDoc(doc(db, 'users', result.user.uid), newUserData);
      setUserData(newUserData);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao MineWealth Forge!",
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = "Erro ao criar conta";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este email já está em uso";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Senha muito fraca";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido";
      }
      
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const login = async (emailOrUsername: string, password: string) => {
    try {
      let email = emailOrUsername;
      
      // Check if it's a username (no @ symbol)
      if (!emailOrUsername.includes('@')) {
        const foundEmail = await findEmailByUsername(emailOrUsername);
        if (!foundEmail) {
          toast({
            title: "Usuário não encontrado",
            description: "Nome de usuário não existe",
            variant: "destructive",
          });
          return;
        }
        email = foundEmail;
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = "Email/username ou senha incorretos";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Usuário não encontrado";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Senha incorreta";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Muitas tentativas. Tente novamente mais tarde";
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error: any) {
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Email de recuperação enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    } catch (error: any) {
      let errorMessage = "Verifique se o email está correto";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Email não encontrado";
      }
      
      toast({
        title: "Erro no envio",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user || !userData) return;
    
    try {
      const updatedData = { ...userData, ...data };
      await setDoc(doc(db, 'users', user.uid), updatedData);
      setUserData(updatedData);
    } catch (error: any) {
      console.error('Update user data error:', error);
      toast({
        title: "Erro ao atualizar dados",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
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
