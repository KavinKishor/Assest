import nodemailer from "nodemailer";
import type { Ticket, AssetRequest } from "@/types/types";

export async function sendOTPEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
  });

  const mailOptions = {
    from: `"AMS Assets" <${process.env.SMTP_FROM || "no-reply@amshealthcare.com"}>`,
    to: email,
    subject: "Your Verification Code - AMS Assets",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #2563eb; margin: 0;">AMS Asset Management System</h2>
        </div>
        <div style="padding: 24px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
          <p style="color: #475569; font-size: 16px; margin-bottom: 24px;">Please use the following code to verify your account:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b; margin-bottom: 24px;">${otp}</div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error sending OTP email:", error);
    return false;
  }
}

export async function sendTicketEmail(
  email: string,
  subject: string,
  ticketDetails: Ticket,
  action: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const { ticketId, currentStatus, priority, createdAt, issue, description } = ticketDetails;
  const formattedDate = new Date(createdAt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const statusColors: Record<string, { bg: string; text: string }> = {
    'Open': { bg: '#eff6ff', text: '#2563eb' },
    'In Progress': { bg: '#fffbeb', text: '#d97706' },
    'Resolved': { bg: '#ecfdf5', text: '#059669' },
    'Closed': { bg: '#f8fafc', text: '#64748b' },
    'Unsolved': { bg: '#fef2f2', text: '#dc2626' }
  };
  const colors = statusColors[currentStatus] || { bg: '#f8fafc', text: '#64748b' };

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fa; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">AMS Support Center</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700;">${subject}</h2>
          <p style="color: #64748b; line-height: 1.6; font-size: 15px; margin-bottom: 24px;">${action}</p>
          
          <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f8fafc;">
                <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; width: 35%;">Ticket ID</td>
                <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px; font-weight: 700;">${ticketId}</td>
              </tr>
              <tr>
                <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase;">Issue Type</td>
                <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px; font-weight: 600;">${issue}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase;">Status</td>
                <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0;">
                  <span style="padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; background-color: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.text}20;">
                    ${currentStatus}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase;">Priority</td>
                <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: ${priority === 'Urgent' ? '#dc2626' : '#1e293b'}; font-size: 14px; font-weight: 700;">${priority}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 14px 16px; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase;">Created At</td>
                <td style="padding: 14px 16px; color: #1e293b; font-size: 14px; font-weight: 600;">${formattedDate}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase;">Description</p>
            <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.5;">${description}</p>
          </div>

          <div style="margin-top: 32px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/ticket" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);">Track Ticket Status</a>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} AMS Healthcare. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"AMS Assets" <${process.env.SMTP_FROM || "no-reply@amshealthcare.com"}>`,
      to: email,
      subject: `${subject} - ${ticketId}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error sending ticket email:", error);
    return false;
  }
}

export async function sendAssetRequestEmail(
  email: string,
  subject: string,
  requestDetails: AssetRequest,
  action: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const { reqId, type, category, status, creator, managerComment, assetData } = requestDetails;

  const dataRows = assetData ? Object.entries(assetData)
    .filter(([key]) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key))
    .map(([key, value]) => `
            <div style="padding: 10px; border-bottom: 1px solid #f1f5f9;">
                <span style="color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px;">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                <span style="color: #1e293b; font-size: 13px; font-weight: 600;">${typeof value === 'object' ? JSON.stringify(value) : value || 'N/A'}</span>
            </div>
        `).join('') : '';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fa; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px;">AMS Assets</h1>
          <p style="color: rgba(255,255,255,0.7); margin-top: 8px; font-size: 12px; font-weight: 600; letter-spacing: 1px;">MANAGEMENT SYSTEM</p>
        </div>
        
        <div style="padding: 40px;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700;">${subject}</h2>
          <p style="color: #64748b; line-height: 1.6; font-size: 15px; margin-bottom: 24px;">${action}</p>
          
          <div style="background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 24px;">
            <div style="padding: 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block;">Request ID</span>
                    <span style="color: #1e293b; font-size: 15px; font-weight: 800;">#${reqId}</span>
                </div>
                <div style="text-align: right;">
                    <span style="padding: 5px 12px; border-radius: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; background-color: ${status === 'Approved' ? '#ecfdf5' : status === 'Rejected' ? '#fef2f2' : '#fffbeb'}; color: ${status === 'Approved' ? '#059669' : status === 'Rejected' ? '#dc2626' : '#d97706'}; border: 1px solid currentColor;">
                        ${status}
                    </span>
                </div>
            </div>
            
            <div style="display: grid; grid-template-cols: 1fr 1fr; padding: 20px; gap: 20px; border-bottom: 1px solid #e2e8f0;">
                <div style="margin-bottom: 15px;">
                    <span style="color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block;">Type / Category</span>
                    <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${type} - ${category.replace('_', ' ')}</span>
                </div>
                <div>
                    <span style="color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block;">Created By</span>
                    <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${creator.name}</span>
                </div>
            </div>

            ${dataRows ? `
            <div style="padding: 20px; background-color: #ffffff;">
                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Technical Specifications</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                    ${dataRows}
                </div>
            </div>
            ` : ''}
          </div>

          ${managerComment ? `
          <div style="background-color: #eff6ff; border-left: 5px solid #4f46e5; padding: 24px; border-radius: 0 16px 16px 0; margin-top: 32px; position: relative;">
            <p style="margin: 0 0 8px 0; color: #4338ca; font-size: 11px; font-weight: 800; text-transform: uppercase;">Manager's Comment</p>
            <p style="margin: 0; color: #3730a3; font-size: 14px; font-style: italic; line-height: 1.5;">"${managerComment}"</p>
          </div>
          ` : ''}
          
          <div style="margin-top: 40px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/ticket" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 16px 40px; border-radius: 14px; text-decoration: none; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.25);">Manage Request</a>
          </div>
        </div>
        
        <div style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0; letter-spacing: 0.5px;">This is an automated security protocol notification.</p>
          <p style="color: #cbd5e1; font-size: 11px; margin: 10px 0 0 0; font-weight: 600;">&copy; ${new Date().getFullYear()} AMS HEALTHCARE. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"AMS Assets" <${process.env.SMTP_FROM || "no-reply@amshealthcare.com"}>`,
      to: email,
      subject: `${subject} - ${reqId}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error sending asset request email:", error);
    return false;
  }
}
