// app/api/email/send-cancellation/route.js
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
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cleanbiz360.com',
      subject: `Cancelamento - Agendamento ${appointmentData.service}`,
      html: getAppointmentCancellationTemplate(appointmentData),
      text: getAppointmentCancellationText(appointmentData),
    };

    const response = await sgMail.send(msg);
    
    return Response.json({ 
      success: true, 
      messageId: response[0].headers['x-message-id'],
      message: 'Cancellation email sent successfully'
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
function getAppointmentCancellationTemplate(data) {
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
          <p>Email: contato@cleanbiz360.com | Telefone: (555) 123-4567</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getAppointmentCancellationText(data) {
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
Email: contato@cleanbiz360.com | Telefone: (555) 123-4567
  `;
}
