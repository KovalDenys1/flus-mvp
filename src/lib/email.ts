import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using the configured transporter
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP credentials not configured, skipping email send');
      return false;
    }

    const mailOptions = {
      from: `"FLUS" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send notification email to employer about new application
 */
export async function sendNewApplicationEmail(
  employerEmail: string,
  employerName: string,
  jobTitle: string,
  applicantName: string,
  applicationMessage?: string
): Promise<boolean> {
  const subject = `Ny søknad på "${jobTitle}"`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Ny søknad mottatt!</h1>
        </div>
        <div class="content">
          <h2>Hei ${employerName}!</h2>
          <p><strong>${applicantName}</strong> har søkt på din jobb "<strong>${jobTitle}</strong>".</p>

          ${applicationMessage ? `
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h4>Melding fra søker:</h4>
              <p style="margin: 0; font-style: italic;">"${applicationMessage}"</p>
            </div>
          ` : ''}

          <p>Logg inn på FLUS for å se søknaden og kontakte kandidaten.</p>

          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://flus.app'}/mine-jobber" class="button">
            Se søknad →
          </a>

          <p style="margin-top: 30px;">
            <small>Hvis du har spørsmål, kan du svare direkte på denne e-posten.</small>
          </p>
        </div>
        <div class="footer">
          <p>Med vennlig hilsen,<br>FLUS-teamet</p>
          <p>📧 <a href="mailto:support@flus.app">support@flus.app</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: employerEmail,
    subject,
    html,
  });
}

/**
 * Send notification email to worker about application status change
 */
export async function sendApplicationStatusEmail(
  workerEmail: string,
  workerName: string,
  jobTitle: string,
  status: 'approved' | 'rejected',
  employerName: string
): Promise<boolean> {
  const statusText = status === 'approved' ? 'godkjent' : 'avslått';
  const statusEmoji = status === 'approved' ? '✅' : '❌';
  const subject = `Din søknad er ${statusText}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${status === 'approved' ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: ${status === 'approved' ? '#4CAF50' : '#f44336'}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusEmoji} Søknad ${statusText}</h1>
        </div>
        <div class="content">
          <h2>Hei ${workerName}!</h2>
          <p>Din søknad på "<strong>${jobTitle}</strong>" har blitt <strong>${statusText}</strong> av ${employerName}.</p>

          ${status === 'approved' ? `
            <p>🎉 Gratulerer! Du kan nå starte arbeidet og kontakte arbeidsgiveren via chat.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://flus.app'}/samtaler" class="button">
              Start chat →
            </a>
          ` : `
            <p>Vi beklager at søknaden din ikke ble godkjent denne gangen. Ikke gi opp - det finnes mange andre muligheter!</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://flus.app'}/jobber" class="button">
              Finn nye jobber →
            </a>
          `}

          <p style="margin-top: 30px;">
            <small>Hvis du har spørsmål, kan du kontakte arbeidsgiveren direkte eller svare på denne e-posten.</small>
          </p>
        </div>
        <div class="footer">
          <p>Med vennlig hilsen,<br>FLUS-teamet</p>
          <p>📧 <a href="mailto:support@flus.app">support@flus.app</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: workerEmail,
    subject,
    html,
  });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string,
  role: 'worker' | 'employer' | 'admin'
): Promise<boolean> {
  const roleText = role === 'worker' ? 'jobbsøker' : role === 'employer' ? 'arbeidsgiver' : 'administrator';
  const subject = `Velkommen til FLUS, ${userName}!`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Velkommen til FLUS!</h1>
        </div>
        <div class="content">
          <h2>Hei ${userName}!</h2>
          <p>Velkommen som ${roleText} på FLUS - Norges ledende plattform for lokale småjobber.</p>

          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Kom i gang:</h3>
            <ul>
              ${role === 'worker' ? `
                <li>📋 <strong>Opprett din CV</strong> - Legg til ferdigheter og erfaring</li>
                <li>🔍 <strong>Finn jobber</strong> - Søk blant tusenvis av lokale muligheter</li>
                <li>💬 <strong>Søk og chat</strong> - Kontakt arbeidsgivere direkte</li>
              ` : role === 'employer' ? `
                <li>➕ <strong>Opprett jobb</strong> - Legg ut din første jobbannonse</li>
                <li>👥 <strong>Motta søknader</strong> - Få kvalifiserte kandidater</li>
                <li>💼 <strong>Administrer</strong> - Følg opp og betal for utført arbeid</li>
              ` : `
                <li>👑 <strong>Admin panel</strong> - Tilgang til administrasjonsverktøy</li>
                <li>📊 <strong>Statistikk</strong> - Se plattformstatistikk og analyser</li>
                <li>⚙️ <strong>Brukerhåndtering</strong> - Administrer brukere og innhold</li>
              `}
            </ul>
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://flus.app'}/${role === 'admin' ? 'admin' : role === 'worker' ? 'jobber' : 'jobber/ny'}" class="button">
            Kom i gang →
          </a>

          <p style="margin-top: 30px;">
            <small>Har du spørsmål? Kontakt oss på <a href="mailto:support@flus.app">support@flus.app</a></small>
          </p>
        </div>
        <div class="footer">
          <p>Med vennlig hilsen,<br>FLUS-teamet</p>
          <p>🌐 <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://flus.app'}">flus.app</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: userEmail,
    subject,
    html,
  });
}