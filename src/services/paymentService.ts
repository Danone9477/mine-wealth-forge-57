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
        valor: amount.toString() // Converter para string conforme a API requer
      })
    });

    console.log('MozPayment Response Status:', response.status);

    if (method === 'mpesa') {
      // Processar resposta M-Pesa baseada no status HTTP
      let success = false;
      let message = '';

      switch (response.status) {
        case 200:
          success = true;
          message = 'Pagamento realizado com sucesso';
          break;
        case 201:
          message = 'Erro na transação';
          break;
        case 422:
          message = 'Saldo insuficiente';
          break;
        case 400:
          message = 'PIN errado ou dados inválidos';
          break;
        default:
          message = `Erro desconhecido: ${response.status}`;
      }

      console.log('M-Pesa Result:', { success, message, status: response.status });

      return {
        success,
        message,
        transactionId: success ? Date.now().toString() : undefined,
        rawResponse: `Status: ${response.status}`
      };

    } else if (method === 'emola') {
      // Processar resposta e-Mola baseada no JSON
      try {
        const result = await response.json();
        console.log('e-Mola JSON Response:', result);

        const success = result.success === 'yes';
        const message = success ? 'Pagamento aprovado' : 'Pagamento reprovado';

        return {
          success,
          message,
          transactionId: success ? Date.now().toString() : undefined,
          rawResponse: JSON.stringify(result)
        };
      } catch (jsonError) {
        // Se não conseguir fazer parse do JSON, tentar como texto
        const textResult = await response.text();
        console.log('e-Mola Text Response:', textResult);

        const success = textResult.toLowerCase().includes('success = yes') || 
                       textResult.toLowerCase().includes('pagamento aprovado');
        const message = success ? 'Pagamento aprovado' : 'Pagamento reprovado';

        return {
          success,
          message,
          transactionId: success ? Date.now().toString() : undefined,
          rawResponse: textResult
        };
      }
    }

    return {
      success: false,
      message: 'Método de pagamento não suportado',
      rawResponse: 'Invalid method'
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
