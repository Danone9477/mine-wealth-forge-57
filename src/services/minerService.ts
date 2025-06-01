
import { doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ActiveMiner {
  id: string;
  name: string;
  dailyReturn: number;
  purchaseDate: string;
  expiryDate: string;
  totalEarned: number;
  isActive: boolean;
  userId: string;
  price: number;
  lastProcessed?: string;
  active: boolean;
  lastCollection?: string;
  daysRemaining?: number;
}

export const processDailyMinerRewards = async () => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      const miners = userData.miners || [];
      let hasChanges = false;
      let dailyEarnings = 0;
      
      const updatedMiners = miners.map((miner: ActiveMiner) => {
        if (!miner.isActive && !miner.active) return miner;
        
        const expiryDate = new Date(miner.expiryDate);
        const lastProcessed = new Date(miner.lastProcessed || miner.purchaseDate);
        
        // Verificar se o minerador expirou
        if (today >= expiryDate) {
          hasChanges = true;
          return { ...miner, isActive: false, active: false };
        }
        
        // Verificar se já foi processado hoje
        if (lastProcessed.toDateString() === today.toDateString()) {
          return miner;
        }
        
        // Adicionar ganho diário
        dailyEarnings += miner.dailyReturn;
        hasChanges = true;
        
        return {
          ...miner,
          totalEarned: (miner.totalEarned || 0) + miner.dailyReturn,
          lastProcessed: today.toISOString(),
          active: true,
          isActive: true
        };
      });
      
      if (hasChanges) {
        const newBalance = (userData.balance || 0) + dailyEarnings;
        const newTotalEarnings = (userData.totalEarnings || 0) + dailyEarnings;
        
        await updateDoc(doc(db, 'users', userDoc.id), {
          miners: updatedMiners,
          balance: newBalance,
          totalEarnings: newTotalEarnings,
          lastMinerUpdate: today.toISOString()
        });
        
        console.log(`Processado ${dailyEarnings} MT para usuário ${userData.username}`);
      }
    }
  } catch (error) {
    console.error('Erro ao processar recompensas dos mineradores:', error);
  }
};

export const addMinerToUser = async (userId: string, miner: any) => {
  try {
    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(purchaseDate.getDate() + 30);
    
    const activeMiner: ActiveMiner = {
      id: Date.now().toString(),
      name: miner.name,
      dailyReturn: miner.dailyReturn,
      purchaseDate: purchaseDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      totalEarned: 0,
      isActive: true,
      active: true,
      userId,
      price: miner.price,
      lastProcessed: purchaseDate.toISOString(),
      lastCollection: null,
      daysRemaining: 30
    };
    
    return activeMiner;
  } catch (error) {
    console.error('Erro ao adicionar minerador:', error);
    throw error;
  }
};

// Função para liberar saques automaticamente ao comprar minerador
export const unlockWithdrawalsForUser = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      canWithdraw: true
    });
    console.log(`Saques liberados automaticamente para usuário ${userId}`);
  } catch (error) {
    console.error('Erro ao liberar saques:', error);
    throw error;
  }
};
