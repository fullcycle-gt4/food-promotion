// src/services/http-notification.service.ts

export interface SendEmailHttpDto {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class HttpNotificationService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    // Parâmetros via variáveis de ambiente
    const env = (globalThis as {
      process?: {
        env?: Record<string, string | undefined>;
      };
    }).process?.env ?? {};

    this.apiUrl = env.PROVIDER_API_URL || 'https://api.provedor-exemplo.com/v1/emails';
    this.apiKey = env.PROVIDER_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('PROVIDER_API_KEY is not defined in environment variables.');
    }
  }

  async sendEmail(data: SendEmailHttpDto): Promise<string> {
    try {
      // Disparando a requisição HTTP POST para o provedor externo
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`, // Autenticação padrão via Token
        },
        body: JSON.stringify({
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text,
        }),
      });

      // Se a resposta HTTP não for bem-sucedida (ex: 400, 401, 500)
      if (!response.ok) {
        // Tenta capturar o corpo do erro retornado pelo provedor
        const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Provider API Error (${response.status}): ${JSON.stringify(errorBody)}`);
      }

      // Converte a resposta de sucesso
      const result = (await response.json()) as { id: string };
      return result.id;
    } catch (error: any) {
      // Repassa o erro para que a fila saiba que a tentativa falhou e aplique o retry
      throw new Error(`Failed HTTP notification request: ${error.message}`);
    }
  }
}