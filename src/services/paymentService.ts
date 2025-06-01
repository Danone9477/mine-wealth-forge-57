
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const WALLET_ID = "1741243147134x615195806040850400";

interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  rawResponse?: string;
}

export const processPayment = async (
  method: 'emola' | 'mpesa',
  phone: string,
  amount: number,
  username: string
): Promise<PaymentResponse> => {
  try {
    const endpoint = method === 'emola' 
      ? 'https://mozpayment.co.mz/api/1.1/wf/pagamentorotativoemola'
      : 'https://mozpayment.co.mz/api/1.1/wf/pagamentorotativompesa';

    console.log('Iniciando pagamento MozPayment:', {
      endpoint,
      amount,
      phone,
      carteira: WALLET_ID,
      username
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        carteira: WALLET_ID,
        numero: phone,
        "quem comprou": username,
        valor: amount
      })
    });

    const result = await response.text();
    
    console.log('MozPayment Response:', {
      status: response.status,
      result
    });

    // Análise mais detalhada da resposta
    let success = false;
    let message = result;

    if (response.status === 200) {
      // Verificar conteúdo da resposta para sucesso
      const lowerResult = result.toLowerCase();
      if (lowerResult.includes('success = yes') || 
          lowerResult.includes('pagamento aprovado') ||
          lowerResult.includes('transação aprovada') ||
          lowerResult.includes('approved')) {
        success = true;
        message = 'Pagamento aprovado com sucesso';
      } else if (lowerResult.includes('saldo insuficiente')) {
        message = 'Saldo insuficiente na carteira';
      } else if (lowerResult.includes('pin errado') || lowerResult.includes('pin incorreto')) {
        message = 'PIN incorreto';
      } else if (lowerResult.includes('numero invalido')) {
        message = 'Número de telefone inválido';
      } else {
        message = 'Erro na transação - verifique os dados';
      }
    } else if (response.status === 201) {
      message = 'Erro na transação';
    } else if (response.status === 422) {
      message = 'Saldo insuficiente';
    } else if (response.status === 400) {
      message = 'PIN errado ou dados inválidos';
    } else {
      message = 'Erro de comunicação com MozPayment';
    }

    return {
      success,
      message,
      transactionId: success ? Date.now().toString() : undefined,
      rawResponse: result
    };

  } catch (error) {
    console.error('Erro no processamento do pagamento:', error);
    return {
      success: false,
      message: 'Erro de conectividade com MozPayment',
      rawResponse: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

export const processAffiliateCommission = async (depositAmount: number, userUID: string, userData: any) => {
  try {
    if (!userData?.referredBy) return;

    const commission = depositAmount * 0.30; // 30% de comissão
    
    console.log('Processando comissão de afiliado:', {
      referredBy: userData.referredBy,
      commission,
      depositAmount
    });
    
    // Buscar o afiliado que fez a referência
    const affiliateQuery = query(
      collection(db, 'users'),
      where('affiliateCode', '==', userData.referredBy)
    );
    
    const affiliateSnapshot = await getDocs(affiliateQuery);
    
    if (!affiliateSnapshot.empty) {
      const affiliateDoc = affiliateSnapshot.docs[0];
      const affiliateData = affiliateDoc.data();
      
      // Atualizar dados do afiliado
      const newAffiliateBalance = (affiliateData.affiliateBalance || 0) + commission;
      const currentStats = affiliateData.affiliateStats || {};
      const newTotalCommissions = (currentStats.totalCommissions || 0) + commission;
      const newMonthlyCommissions = (currentStats.monthlyCommissions || 0) + commission;
      
      // Adicionar à lista de referidos ativos
      const newActiveReferral = {
        username: userData.username,
        date: new Date().toLocaleDateString('pt-BR'),
        commission: commission,
        depositAmount: depositAmount,
        timestamp: new Date().toISOString()
      };
      
      const activeReferrals = currentStats.activeReferrals || [];
      const updatedActiveReferrals = [...activeReferrals, newActiveReferral];
      
      // Atualizar estatísticas
      const updatedStats = {
        ...currentStats,
        totalCommissions: newTotalCommissions,
        monthlyCommissions: newMonthlyCommissions,
        activeReferralsCount: updatedActiveReferrals.length,
        activeReferrals: updatedActiveReferrals,
        lastCommissionDate: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'users', affiliateDoc.id), {
        affiliateBalance: newAffiliateBalance,
        affiliateStats: updatedStats
      });
      
      console.log(`Comissão de ${commission} MT creditada ao afiliado ${userData.referredBy}`);
      return true;
    } else {
      console.log('Afiliado não encontrado:', userData.referredBy);
      return false;
    }
  } catch (error) {
    console.error('Erro ao processar comissão do afiliado:', error);
    return false;
  }
};
