// app/api/email/send-confirmation/route.js
export async function POST(request) {
  try {
    const { appointmentData, clientEmail } = await request.json();

    if (!appointmentData || !clientEmail) {
      return Response.json({ error: 'Appointment data and client email are required' }, { status: 400 });
    }

    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'your_sendgrid_api_key_here') {
      console.log('SendGrid not configured, simulating email send...');
      console.log('Would send email to:', clientEmail);
      console.log('Appointment data:', appointmentData);
      
      return Response.json({ 
        success: true, 
        messageId: 'simulated-' + Date.now(),
        message: 'Email simulation successful (SendGrid not configured)'
      });
    }

    const sgMail = (await import('@sendgrid/mail')).default;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: clientEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cleanbiz.com',
      subject: `Confirmação de Agendamento - ${appointmentData.service}`,
      html: getAppointmentConfirmationTemplate(appointmentData),
      text: getAppointmentConfirmationText(appointmentData),
    };

    const response = await sgMail.send(msg);
    
    return Response.json({ 
      success: true, 
      messageId: response[0].headers['x-message-id'],
      message: 'Confirmation email sent successfully'
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
function getAppointmentConfirmationTemplate(data) {
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

function getAppointmentConfirmationText(data) {
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
