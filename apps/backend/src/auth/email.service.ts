import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter with Gmail or custom SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMagicLinkEmail(email: string, magicLink: string, type: 'login' | 'signup') {
    const subject = type === 'login' ? 'Your Magic Link to Sign In' : 'Your Magic Link to Sign Up';
    const action = type === 'login' ? 'sign in' : 'sign up';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .logo .bizz {
            color: #f97316;
          }
          h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 18px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            margin: 20px 0;
            font-size: 17px;
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .button:hover {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.5);
            transform: translateY(-3px);
          }
          .info {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <span class="bizz">Bizz</span><span>CRM</span>
          </div>
          
          <h1>Magic Link to ${action === 'sign in' ? 'Sign In' : 'Sign Up'} ✨</h1>
          
          <p>Hello!</p>
          
          <p>Click the button below to ${action} to your BizzCRM account. This link will expire in 15 minutes.</p>
          
          <a href="${magicLink}" class="button">
            ${action === 'sign in' ? 'Sign In Now' : 'Sign Up Now'}
          </a>
          
          <div class="info">
            <strong>⚠️ Security Notice:</strong><br>
            • This link will expire in 15 minutes<br>
            • Can only be used once<br>
            • If you didn't request this, please ignore this email
          </div>
          
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #3b82f6; font-size: 14px;">${magicLink}</p>
          
          <div class="footer">
            <p>BizzCRM © ${new Date().getFullYear()}</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"BizzCRM" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: subject,
        html: htmlContent,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send magic link email');
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string) {
    const subject = 'Reset Your Password - BizzCRM';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .logo .bizz {
            color: #f97316;
          }
          h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 18px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            margin: 20px 0;
            font-size: 17px;
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .button:hover {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.5);
            transform: translateY(-3px);
          }
          .info {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
            border-left: 4px solid #ffc107;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <span class="bizz">Bizz</span><span>CRM</span>
          </div>
          
          <h1>Reset Your Password 🔒</h1>
          
          <p>Hello!</p>
          
          <p>We received a request to reset your password for your BizzCRM account. Click the button below to create a new password.</p>
          
          <a href="${resetLink}" class="button">
            Reset Password
          </a>
          
          <div class="info">
            <strong>⚠️ Important:</strong><br>
            • This link will expire in 15 minutes<br>
            • Can only be used once<br>
            • If you didn't request this, please ignore this email and your password will remain unchanged
          </div>
          
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #3b82f6; font-size: 14px;">${resetLink}</p>
          
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            For security reasons, we never send passwords via email. If you didn't request this reset, someone may be trying to access your account. Consider changing your password immediately.
          </p>
          
          <div class="footer">
            <p>BizzCRM © ${new Date().getFullYear()}</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"BizzCRM" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: subject,
        html: htmlContent,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Test email connection
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}
