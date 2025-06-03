
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
  active: boolean; // Para compatibilidade
  userId: string;
  price: number;
  lastProcessed?: string;
  lastCollection?: string;
  daysRemaining?: number;
}

export const processDailyMinerRewards = async () => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const now = new Date();
    // Definir horário fixo às 10h para processamento diário
    const processingTime = new Date();
    processingTime.setHours(10, 0, 0, 0);
    
    const today = processingTime.toDateString();
    
    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      const miners = userData.miners || [];
      let hasChanges = false;
      let dailyEarnings = 0;
      
      const updatedMiners = miners.map((miner: ActiveMiner) => {
        if (!miner.isActive && !miner.active) return miner;
        
        const expiryDate = new Date(miner.expiryDate);
        const lastProcessed = miner.lastProcessed ? new Date(miner.lastProcessed).toDateString() : null;
        
        // Calcular dias restantes
        const daysRemaining = Math.max(0, Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        
        // Verificar se o minerador expirou
        if (now >= expiryDate || daysRemaining <= 0) {
          hasChanges = true;
          return { 
            ...miner, 
            isActive: false, 
            active: false,
            daysRemaining: 0
          };
        }
        
        // SEGURANÇA: Verificar se já foi processado hoje - comparar apenas a data, não o horário
        if (lastProcessed === today) {
          return {
            ...miner,
            daysRemaining,
            isActive: true,
            active: true
          };
        }
        
        // SEGURANÇA: Verificar se já existe transação de mineração hoje para este usuário
        const todayTransactions = userData.transactions || [];
        const hasTodayMiningTransaction = todayTransactions.some((transaction: any) => {
          const transactionDate = new Date(transaction.date).toDateString();
          return transactionDate === today && 
                 (transaction.type === 'mining_reward' || transaction.type === 'mining') &&
                 transaction.description?.includes(miner.name);
        });
        
        if (hasTodayMiningTransaction) {
          return {
            ...miner,
            daysRemaining,
            isActive: true,
            active: true
          };
        }
        
        // Adicionar ganho diário somente se não foi processado hoje
        dailyEarnings += miner.dailyReturn;
        hasChanges = true;
        
        return {
          ...miner,
          totalEarned: (miner.totalEarned || 0) + miner.dailyReturn,
          lastProcessed: processingTime.toISOString(),
          lastCollection: processingTime.toISOString(),
          daysRemaining,
          isActive: true,
          active: true
        };
      });
      
      if (hasChanges && dailyEarnings > 0) {
        const newBalance = (userData.balance || 0) + dailyEarnings;
        const newTotalEarnings = (userData.totalEarnings || 0) + dailyEarnings;
        
        // Calcular ganhos mensais (últimos 30 dias)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const monthlyEarnings = (userData.transactions || [])
          .filter((transaction: any) => 
            (transaction.type === 'mining_reward' || transaction.type === 'mining' || transaction.type === 'task') && 
            new Date(transaction.date) >= thirtyDaysAgo
          )
          .reduce((sum: number, transaction: any) => sum + transaction.amount, 0) + dailyEarnings;
        
        // SEGURANÇA: Criar transação única com timestamp específico
        const miningTransaction = {
          id: `mining_${Date.now()}_${userDoc.id}`,
          type: 'mining_reward',
          amount: dailyEarnings,
          status: 'success',
          date: processingTime.toISOString(),
          description: `Ganhos automáticos diários - ${dailyEarnings} MT às 10h`
        };
        
        const updatedTransactions = [...(userData.transactions || []), miningTransaction];
        
        await updateDoc(doc(db, 'users', userDoc.id), {
          miners: updatedMiners,
          balance: newBalance,
          totalEarnings: newTotalEarnings,
          monthlyEarnings: monthlyEarnings,
          lastMinerUpdate: processingTime.toISOString(),
          transactions: updatedTransactions
        });
        
        console.log(`SEGURO: Processado ${dailyEarnings} MT para usuário ${userData.username} às 10h do dia ${today}`);
      } else if (hasChanges) {
        // Atualizar apenas os mineradores sem adicionar transações
        await updateDoc(doc(db, 'users', userDoc.id), {
          miners: updatedMiners,
          lastMinerUpdate: now.toISOString()
        });
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
    
    const daysRemaining = 30;
    
    const activeMiner: ActiveMiner = {
      id: Date.now().toString(),
      name: miner.name,
      dailyReturn: miner.dailyReturn,
      purchaseDate: purchaseDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      totalEarned: miner.dailyReturn, // Começar com o primeiro ganho
      isActive: true,
      active: true,
      userId,
      price: miner.price,
      lastProcessed: purchaseDate.toISOString(),
      lastCollection: purchaseDate.toISOString(),
      daysRemaining
    };
    
    return activeMiner;
  } catch (error) {
    console.error('Erro ao adicionar minerador:', error);
    throw error;
  }
};
