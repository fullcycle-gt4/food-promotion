
import { NotificationService } from '../notification.service';
import { Resend } from 'resend';

// Mock da biblioteca externa
jest.mock('resend');

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let mockResendInstance: any;

  beforeEach(() => {
    process.env.NOTIFICATION_API_KEY = 'test_key';
    mockResendInstance = {
      emails: {
        send: jest.fn(),
      },
    };
    (Resend as jest.Mock).mockImplementation(() => mockResendInstance);
    notificationService = new NotificationService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve enviar o e-mail com sucesso', async () => {
    mockResendInstance.emails.send.mockResolvedValueOnce({
      data: { id: 'msg_12345' },
      error: null,
    });

    const result = await notificationService.sendEmail({
      to: 'teste@email.com',
      subject: 'Teste',
      html: '<p>Olá</p>',
    });

    expect(result).toBe('msg_12345');
    expect(mockResendInstance.emails.send).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro quando a API do provedor retornar rejeição', async () => {
    mockResendInstance.emails.send.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid API Key' },
    });

    await expect(
      notificationService.sendEmail({
        to: 'teste@email.com',
        subject: 'Teste',
        html: '<p>Olá</p>',
      })
    ).rejects.toThrow('Failed to send notification: Provider Error: Invalid API Key');
  });
});