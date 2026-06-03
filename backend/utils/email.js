const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // For development/testing - use Ethereal (fake SMTP)
  // For production - use real SMTP service (Gmail, SendGrid, etc.)
  
  if (process.env.NODE_ENV === 'production' && process.env.EMAIL_HOST) {
    // Production - Real email service
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  // Development/Testing - Log email to console
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER || 'test@ethereal.email',
      pass: process.env.EMAIL_PASSWORD || 'test'
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'New Koshi A/C Yatayat'} <${process.env.EMAIL_FROM || 'noreply@newkoshi.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    // Log for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email sent:', info.messageId);
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

// Send verification email
const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f0f4f8;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0f4f8; padding: 20px;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    🚌 New Koshi A/C Yatayat
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 14px;">
                    न्यू कोशी सुपर यातायात प्रा. लि.
                  </p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: bold;">
                    Verify Your Email Address
                  </h2>
                  
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Hello <strong>${user.name}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Thank you for registering with New Koshi A/C Yatayat! To complete your registration and start booking bus tickets, please verify your email address.
                  </p>
                  
                  <!-- Button -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);">
                          ✅ Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    Or copy and paste this link into your browser:
                  </p>
                  
                  <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; word-break: break-all;">
                    <a href="${verificationUrl}" style="color: #3b82f6; text-decoration: none; font-size: 13px;">
                      ${verificationUrl}
                    </a>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 13px; line-height: 1.6;">
                    <strong>Note:</strong> This verification link will expire in 24 hours.
                  </p>
                </td>
              </tr>
              
              <!-- Features -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 8px;">
                    <p style="margin: 0 0 15px 0; color: #1e40af; font-size: 14px; font-weight: bold;">
                      Once verified, you can:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
                      <li>Book AC bus tickets online</li>
                      <li>Choose your preferred seats</li>
                      <li>Track your bookings</li>
                      <li>Get instant confirmations</li>
                    </ul>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px; text-align: center;">
                    If you didn't create an account with New Koshi A/C Yatayat, please ignore this email.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                    © 2026 New Koshi A/C Yatayat Pvt. Ltd. | Dharan-8, Sunsari, Nepal
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  const text = `
    Hello ${user.name},
    
    Thank you for registering with New Koshi A/C Yatayat!
    
    Please verify your email address by clicking the link below:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create an account, please ignore this email.
    
    Best regards,
    New Koshi A/C Yatayat Team
  `;
  
  return sendEmail({
    email: user.email,
    subject: 'Verify Your Email - New Koshi A/C Yatayat',
    html,
    text
  });
};

// Send welcome email after verification
const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f0f4f8;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0f4f8; padding: 20px;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px;">
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">✅ Email Verified!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">
                    Welcome to New Koshi A/C Yatayat, ${user.name}! 🎉
                  </h2>
                  <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Your email has been successfully verified. You can now start booking bus tickets for Kathmandu-Dharan routes!
                  </p>
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/buses" 
                     style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
                    🎫 Book Your First Ticket
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  return sendEmail({
    email: user.email,
    subject: 'Welcome to New Koshi A/C Yatayat! 🎉',
    html,
    text: `Welcome ${user.name}! Your email has been verified. Start booking at ${process.env.FRONTEND_URL}/buses`
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendWelcomeEmail
};
