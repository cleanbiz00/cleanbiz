import sgMail from '@sendgrid/mail';

class EmailService {
  constructor() {
    // Initialize SendGrid with API key
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  // Send appointment confirmation email
  async sendAppointmentConfirmation(appointmentData, clientEmail) {
    try {
      const msg = {
        to: clientEmail,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cleanbiz.com',
        subject: `Confirmação de Agendamento - ${appointmentData.service}`,
        html: this.getAppointmentConfirmationTemplate(appointmentData),
        text: this.getAppointmentConfirmationText(appointmentData),
      };

      const response = await sgMail.send(msg);
      return {
        success: true,
        messageId: response[0].headers['x-message-id']
      };
    } catch (error) {
      console.error('Error sending appointment confirmation email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send appointment reminder email
  async sendAppointmentReminder(appointmentData, clientEmail) {
    try {
      const msg = {
        to: clientEmail,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cleanbiz.com',
        subject: `Lembrete - Agendamento ${appointmentData.service}`,
        html: this.getAppointmentReminderTemplate(appointmentData),
        text: this.getAppointmentReminderText(appointmentData),
      };

      const response = await sgMail.send(msg);
      return {
        success: true,
        messageId: response[0].headers['x-message-id']
      };
    } catch (error) {
      console.error('Error sending appointment reminder email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send appointment cancellation email
  async sendAppointmentCancellation(appointmentData, clientEmail) {
    try {
      const msg = {
        to: clientEmail,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cleanbiz.com',
        subject: `Cancelamento - Agendamento ${appointmentData.service}`,
        html: this.getAppointmentCancellationTemplate(appointmentData),
        text: this.getAppointmentCancellationText(appointmentData),
      };

      const response = await sgMail.send(msg);
      return {
        success: true,
        messageId: response[0].headers['x-message-id']
      };
    } catch (error) {
      console.error('Error sending appointment cancellation email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // HTML template for appointment confirmation
  getAppointmentConfirmationTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmação de Agendamento</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #666; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Agendamento Confirmado!</h1>
            <p>CleanBiz - Serviços de Limpeza</p>
          </div>
          
          <div class="content">
            <p>Olá! Seu agendamento foi confirmado com sucesso.</p>
            
            <div class="appointment-details">
              <h3>Detalhes do Agendamento</h3>
              <div class="detail-row">
                <span class="label">Serviço:</span> ${data.service}
              </div>
              <div class="detail-row">
                <span class="label">Data:</span> ${data.date}
              </div>
              <div class="detail-row">
                <span class="label">Horário:</span> ${data.time}
              </div>
              <div class="detail-row">
                <span class="label">Valor:</span> $${data.price}
              </div>
              <div class="detail-row">
                <span class="label">Status:</span> ${data.status}
              </div>
            </div>
            
            <p>Nossa equipe entrará em contato antes do agendamento para confirmar os detalhes.</p>
            <p>Se precisar fazer alguma alteração, entre em contato conosco.</p>
          </div>
          
          <div class="footer">
            <p>CleanBiz - Serviços de Limpeza Profissional</p>
            <p>Email: contato@cleanbiz.com | Telefone: (555) 123-4567</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Text template for appointment confirmation
  getAppointmentConfirmationText(data) {
    return `
Confirmação de Agendamento - CleanBiz

Olá! Seu agendamento foi confirmado com sucesso.

Detalhes do Agendamento:
- Serviço: ${data.service}
- Data: ${data.date}
- Horário: ${data.time}
- Valor: $${data.price}
- Status: ${data.status}

Nossa equipe entrará em contato antes do agendamento para confirmar os detalhes.

Se precisar fazer alguma alteração, entre em contato conosco.

CleanBiz - Serviços de Limpeza Profissional
Email: contato@cleanbiz.com | Telefone: (555) 123-4567
    `;
  }

  // HTML template for appointment reminder
  getAppointmentReminderTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Lembrete de Agendamento</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #666; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Lembrete de Agendamento</h1>
            <p>CleanBiz - Serviços de Limpeza</p>
          </div>
          
          <div class="content">
            <p>Este é um lembrete sobre seu agendamento que está próximo.</p>
            
            <div class="appointment-details">
              <h3>Detalhes do Agendamento</h3>
              <div class="detail-row">
                <span class="label">Serviço:</span> ${data.service}
              </div>
              <div class="detail-row">
                <span class="label">Data:</span> ${data.date}
              </div>
              <div class="detail-row">
                <span class="label">Horário:</span> ${data.time}
              </div>
              <div class="detail-row">
                <span class="label">Valor:</span> $${data.price}
              </div>
            </div>
            
            <p>Por favor, confirme se ainda deseja manter este agendamento.</p>
            <p>Se precisar reagendar ou cancelar, entre em contato conosco.</p>
          </div>
          
          <div class="footer">
            <p>CleanBiz - Serviços de Limpeza Profissional</p>
            <p>Email: contato@cleanbiz.com | Telefone: (555) 123-4567</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Text template for appointment reminder
  getAppointmentReminderText(data) {
    return `
Lembrete de Agendamento - CleanBiz

Este é um lembrete sobre seu agendamento que está próximo.

Detalhes do Agendamento:
- Serviço: ${data.service}
- Data: ${data.date}
- Horário: ${data.time}
- Valor: $${data.price}

Por favor, confirme se ainda deseja manter este agendamento.

Se precisar reagendar ou cancelar, entre em contato conosco.

CleanBiz - Serviços de Limpeza Profissional
Email: contato@cleanbiz.com | Telefone: (555) 123-4567
    `;
  }

  // HTML template for appointment cancellation
  getAppointmentCancellationTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Cancelamento de Agendamento</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #666; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Agendamento Cancelado</h1>
            <p>CleanBiz - Serviços de Limpeza</p>
          </div>
          
          <div class="content">
            <p>Seu agendamento foi cancelado conforme solicitado.</p>
            
            <div class="appointment-details">
              <h3>Detalhes do Agendamento Cancelado</h3>
              <div class="detail-row">
                <span class="label">Serviço:</span> ${data.service}
              </div>
              <div class="detail-row">
                <span class="label">Data:</span> ${data.date}
              </div>
              <div class="detail-row">
                <span class="label">Horário:</span> ${data.time}
              </div>
              <div class="detail-row">
                <span class="label">Valor:</span> $${data.price}
              </div>
            </div>
            
            <p>Se precisar reagendar, entre em contato conosco.</p>
            <p>Obrigado por escolher nossos serviços!</p>
          </div>
          
          <div class="footer">
            <p>CleanBiz - Serviços de Limpeza Profissional</p>
            <p>Email: contato@cleanbiz.com | Telefone: (555) 123-4567</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Text template for appointment cancellation
  getAppointmentCancellationText(data) {
    return `
Cancelamento de Agendamento - CleanBiz

Seu agendamento foi cancelado conforme solicitado.

Detalhes do Agendamento Cancelado:
- Serviço: ${data.service}
- Data: ${data.date}
- Horário: ${data.time}
- Valor: $${data.price}

Se precisar reagendar, entre em contato conosco.

Obrigado por escolher nossos serviços!

CleanBiz - Serviços de Limpeza Profissional
Email: contato@cleanbiz.com | Telefone: (555) 123-4567
    `;
  }
}

export default new EmailService();
