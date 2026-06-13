export function generateOtpEmail({ name, code, expireMinutes = 10, appName = 'Metube' }) {
  const safeName = name || 'User';
  const digits = code.trim().split('');

  return `<!doctype html>
<html lang="eng">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName} - Verification Code</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 48px 16px;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #121212; border: 1px solid #222222; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 36px; text-align: left;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase;">
                      ${appName} - Account
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin: 10px 0 20px 0; font-size: 14px; color: white; line-height: 1.5;">
                Hi ${safeName}<br>
                Please use the OPT code to verify your account. It will expire in ${expireMinutes} minutes.
              </p>

              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 20px auto;">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        ${digits.map((d, index) => `
                          <td align="center" valign="middle" style="background-color: #1c1c1e; width: 48px; height: 52px; border: 1px solid #2c2c2e; border-radius: 8px; font-size: 22px; font-weight: 700; color: #ffffff; text-align: center;">
                            ${d}
                          </td>
                          ${index < digits.length - 1 ? '<td width="8" style="font-size:0; line-height:0;">&nbsp;</td>' : ''}
                        `).join('')}
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1c1c1e; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; font-size: 13px; color: white; line-height: 1.5;">
                      <span style="color: red; font-weight: 600;">DO NOT</span> share this code with anyone as you could lose your account.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; font-size: 12px; color: white; line-height: 1.5; text-align: left;">
                - Ignore mail if you DID NOT request code.<br>
                - Thank you & have a nice day.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 36px 32px 36px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #3a3a3c; font-family: -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing: 0.3px;">
                © ${new Date().getFullYear()} ${appName.toUpperCase()} K13T & L0C.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}