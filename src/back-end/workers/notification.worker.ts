// src/workers/notification.worker.ts
import { NotificationService } from '../services/notification.service.ts';
import { getWelcomeEmailTemplate, NotificationPayload } from '../templates/email.templates.ts';

export class NotificationWorker {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  // Método acionado pelo consumer da fila a cada nova mensagem recebida
  async handleMessage(payload: NotificationPayload): Promise<void> {
    try {
      let emailContent;

      // Seleção do template com base no payload
      if (payload.templateType === 'WELCOME') {
        emailContent = getWelcomeEmailTemplate(payload.userName);
      } else {
        throw new Error(`Unknown template type: ${payload.templateType}`);
      }

      // Disparando o envio via provedor externo
      const messageId = await this.notificationService.sendEmail({
        to: payload.recipientEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      console.log(`[Worker] Notificação enviada com sucesso. ID Externo: ${messageId}`);
    } catch (error) {
      console.error(`[Worker] Erro ao processar notificação:`, error);
      
      // Lançar o erro novamente garante que o mecanismo de filas (ex: BullMQ / SQS) 
      // entenda que a tarefa falhou e aplique o Exponential Backoff / Dead Letter Queue (DLQ)
      throw error;
    }
  }
}