
import { processDailyMinerRewards } from './minerService';

class CronService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private lastProcessingDate: string | null = null;

  start() {
    if (this.isRunning) {
      console.log('Cron service já está rodando');
      return;
    }

    console.log('Iniciando serviço de processamento automático de mineradores - Pagamentos às 10h');
    
    // Verificar a cada 30 minutos se é hora de processar (10h)
    this.intervalId = setInterval(async () => {
      await this.checkAndProcess();
    }, 1800000); // 30 minutos

    this.isRunning = true;
    
    // Verificar imediatamente ao iniciar
    this.checkAndProcess();
  }

  private async checkAndProcess() {
    try {
      const now = new Date();
      const currentHour = now.getHours();
      const today = now.toDateString();
      
      // SEGURANÇA: Processar apenas às 10h e somente uma vez por dia
      if (currentHour === 10 && this.lastProcessingDate !== today) {
        console.log('Processando recompensas automáticas dos mineradores às 10h...');
        await processDailyMinerRewards();
        this.lastProcessingDate = today;
        console.log('Recompensas processadas com sucesso às 10h');
      }
    } catch (error) {
      console.error('Erro no processamento automático às 10h:', error);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.lastProcessingDate = null;
    console.log('Serviço de processamento automático parado');
  }

  async processNow() {
    try {
      console.log('Processamento manual iniciado...');
      await processDailyMinerRewards();
      this.lastProcessingDate = new Date().toDateString();
      console.log('Processamento manual concluído');
    } catch (error) {
      console.error('Erro no processamento manual:', error);
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalId: this.intervalId,
      lastProcessingDate: this.lastProcessingDate,
      nextProcessingTime: '10:00 AM daily'
    };
  }
}

export const cronService = new CronService();

// Iniciar automaticamente quando o serviço for importado
if (typeof window !== 'undefined') {
  cronService.start();
}
