
import { processDailyMinerRewards } from './minerService';

class CronService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  start() {
    if (this.isRunning) {
      console.log('Cron service já está rodando');
      return;
    }

    console.log('Iniciando serviço de processamento automático de mineradores');
    
    // Processar a cada hora (3600000 ms)
    this.intervalId = setInterval(async () => {
      try {
        console.log('Processando recompensas automáticas dos mineradores...');
        await processDailyMinerRewards();
        console.log('Recompensas processadas com sucesso');
      } catch (error) {
        console.error('Erro no processamento automático:', error);
      }
    }, 3600000); // 1 hora

    this.isRunning = true;
    
    // Processar uma vez imediatamente ao iniciar
    this.processNow();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Serviço de processamento automático parado');
  }

  async processNow() {
    try {
      console.log('Processamento manual iniciado...');
      await processDailyMinerRewards();
      console.log('Processamento manual concluído');
    } catch (error) {
      console.error('Erro no processamento manual:', error);
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalId: this.intervalId
    };
  }
}

export const cronService = new CronService();

// Iniciar automaticamente quando o serviço for importado
if (typeof window !== 'undefined') {
  cronService.start();
}
