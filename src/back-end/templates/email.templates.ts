

export interface NotificationPayload {
  recipientEmail: string;
  userName: string;
  templateType: 'WELCOME' | 'PASSWORD_RESET';
}

export function getWelcomeEmailTemplate(name: string): { subject: string; html: string; text: string } {
  return {
    subject: 'Bem-vindo à nossa plataforma!',
    html: `<h1>Olá, ${name}!</h1><p>Estamos muito felizes em ter você conosco.</p>`,
    text: `Olá, ${name}! Estamos muito felizes em ter você conosco.`,
  };
}