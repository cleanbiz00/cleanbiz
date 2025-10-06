// app/api/email/send-reminder/route.js
export async function POST(request) {
  try {
    const { appointmentData, clientEmail } = await request.json();

    if (!appointmentData || !clientEmail) {
      return Response.json({ error: 'Appointment data and client email are required' }, { status: 400 });
    }

    const sgMail = (await import('@sendgrid/mail')).default;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: clientEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cleanbiz.com',
      subject: `Lembrete - Agendamento ${appointmentData.service}`,
      html: getAppointmentReminderTemplate(appointmentData),
      text: getAppointmentReminderText(appointmentData),
    };

    const response = await sgMail.send(msg);
    
    return Response.json({ 
      success: true, 
      messageId: response[0].headers['x-message-id'],
      message: 'Reminder email sent successfully'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// Email template functions
function getAppointmentReminderTemplate(data) {
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

function getAppointmentReminderText(data) {
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
