// src/services/notification.service.ts
import { Resend } from 'resend';                                           

export interface SendEmailDto {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class NotificationService {
  private client: Resend;

  constructor() {
    // Chaves parametrizadas via variáveis de ambiente
    const apiKey = process.env.NOTIFICATION_API_KEY;
    if (!apiKey) {
      throw new Error('NOTIFICATION_API_KEY is not defined in environment variables.');
    }
    this.client = new Resend(apiKey);
  }

  async sendEmail(data: SendEmailDto): Promise<string> {
    try {
      const response = await this.client.emails.send({
        from: process.env.EMAIL_FROM || 'no-reply@seudominio.com',
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      });

      if (response.error) {
        // Erro retornado pela API do provedor (ex: domínio não verificado, rejeição)
        throw new Error(`Provider Error: ${response.error.message}`);
      }

      return response.data?.id || 'unknown_id';
    } catch (error: any) {
      // Propaga o erro para que a camada de fila saiba que deve tentar novamente
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }
}