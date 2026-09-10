import nodemailer from "nodemailer";

export interface QuotationEmailData {
  toEmail: string;
  travelerName: string;
  subject: string;
  quotePrice: string;
  packageTitle?: string;
  travelDates?: string;
  pax?: number | string;
  rooms?: number | string;
  hotelCategory?: string[];
  mealPlan?: string[];
  customPlaces?: string[];
  messageContent: string;
}

export async function sendQuotationEmail(data: QuotationEmailData): Promise<{ success: boolean; messageId?: string; simulated?: boolean; error?: string }> {
  const {
    toEmail,
    travelerName,
    subject,
    quotePrice,
    packageTitle = "Custom Tailor-Made Private Tour",
    travelDates,
    pax,
    rooms,
    hotelCategory = [],
    mealPlan = [],
    customPlaces = [],
    messageContent,
  } = data;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM || "SunHaven Lanka Concierge <concierge@sunhavenlanka.com>";

  const placesHtml =
    customPlaces.length > 0
      ? customPlaces
          .map(
            (p) =>
              `<span style="display:inline-block; background-color:#102c21; color:#cca45b; padding:4px 10px; margin:2px 4px 2px 0; border-radius:6px; font-size:12px; font-weight:600; border:1px solid rgba(204,164,91,0.3);">&#9873; ${p}</span>`
          )
          .join(" ")
      : `<span style="color:#94a3b8; font-size:13px;">Bespoke island-wide customized route</span>`;

  const hotelStyleHtml =
    hotelCategory.length > 0 ? hotelCategory.join(", ") : "Standard / As Preferred";
  const mealPlanHtml = mealPlan.length > 0 ? mealPlan.join(", ") : "Bed & Breakfast / Half Board";

  // Luxury HTML Email Template
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color:#05110b; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#05110b; padding:30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:650px; background-color:#0a2118; border:1px solid #cca45b; border-radius:18px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #07160f 0%, #0d2e21 100%); padding:35px 30px; text-align:center; border-bottom:2px solid #cca45b;">
              <div style="font-size:11px; font-weight:bold; letter-spacing:3px; color:#cca45b; text-transform:uppercase; margin-bottom:6px;">
                SUNHAVEN LANKA TOURS
              </div>
              <h1 style="margin:0; font-family:Georgia, serif; font-size:26px; color:#ffffff; letter-spacing:1px; font-weight:normal;">
                Bespoke Travel Proposal & Quotation
              </h1>
              <div style="width:50px; height:2px; background-color:#cca45b; margin:12px auto 0;"></div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:35px 30px;">
              <p style="font-size:16px; line-height:1.6; margin-top:0; color:#f8fafc;">
                Dear <strong style="color:#cca45b;">${travelerName}</strong>,
              </p>
              
              <p style="font-size:14px; line-height:1.7; color:#cbd5e1;">
                Thank you for your interest in discovering Sri Lanka with <strong>SunHaven Lanka</strong>. Our private travel curators have crafted the following customized itinerary proposal and official price quotation for your party.
              </p>

              <!-- Quotation Price Card -->
              <table role="presentation" width="100%" style="background-color:#071710; border:1px solid rgba(204,164,91,0.4); border-radius:14px; margin:25px 0; padding:20px;">
                <tr>
                  <td>
                    <table width="100%">
                      <tr>
                        <td valign="middle">
                          <span style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#94a3b8; font-weight:bold;">
                            Tour Package Reference
                          </span>
                          <h3 style="margin:4px 0 0; color:#ffffff; font-size:17px; font-family:Georgia, serif;">
                            ${packageTitle}
                          </h3>
                        </td>
                        <td align="right" valign="middle">
                          <span style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#cca45b; font-weight:bold; display:block;">
                            Total Quoted Price
                          </span>
                          <span style="font-size:24px; font-weight:bold; color:#4ade80; font-family:Georgia, serif; display:block; margin-top:2px;">
                            ${quotePrice || "Custom Quote"}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Journey Overview Grid -->
              <table role="presentation" width="100%" style="background-color:#0d261c; border-radius:12px; margin-bottom:25px; padding:18px; border:1px solid rgba(255,255,255,0.05);">
                <tr>
                  <td width="50%" style="padding:6px 10px;" valign="top">
                    <span style="font-size:11px; color:#94a3b8; text-transform:uppercase; font-weight:bold;">Travel Dates</span>
                    <div style="font-size:13px; color:#f1f5f9; font-weight:600; margin-top:2px;">
                      ${travelDates || "Flexible Dates"}
                    </div>
                  </td>
                  <td width="50%" style="padding:6px 10px;" valign="top">
                    <span style="font-size:11px; color:#94a3b8; text-transform:uppercase; font-weight:bold;">Group / Rooms</span>
                    <div style="font-size:13px; color:#f1f5f9; font-weight:600; margin-top:2px;">
                      ${pax ? `${pax} Guests` : "Private Party"} ${rooms ? `• ${rooms} Room(s)` : ""}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:6px 10px;" valign="top">
                    <span style="font-size:11px; color:#94a3b8; text-transform:uppercase; font-weight:bold;">Accommodation Category</span>
                    <div style="font-size:13px; color:#cca45b; font-weight:600; margin-top:2px;">
                      ${hotelStyleHtml}
                    </div>
                  </td>
                  <td width="50%" style="padding:6px 10px;" valign="top">
                    <span style="font-size:11px; color:#94a3b8; text-transform:uppercase; font-weight:bold;">Meal Arrangement</span>
                    <div style="font-size:13px; color:#cca45b; font-weight:600; margin-top:2px;">
                      ${mealPlanHtml}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:10px 10px 4px;" valign="top">
                    <span style="font-size:11px; color:#94a3b8; text-transform:uppercase; font-weight:bold; display:block; margin-bottom:6px;">
                      Destinations & Key Route Highlights
                    </span>
                    <div>
                      ${placesHtml}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Personalized Message Content from Admin -->
              <div style="background-color:#071710; border-left:3px solid #cca45b; padding:18px 20px; border-radius:0 10px 10px 0; margin-bottom:30px;">
                <span style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#cca45b; font-weight:bold; display:block; margin-bottom:8px;">
                  Curator's Notes & Itinerary Details
                </span>
                <div style="font-size:14px; line-height:1.7; color:#e2e8f0; white-space:pre-wrap;">
${messageContent}
                </div>
              </div>

              <!-- Next Steps Call to Action -->
              <div style="text-align:center; padding:20px 0 10px;">
                <p style="font-size:13px; color:#94a3b8; margin-bottom:15px;">
                  To accept this proposal, adjust any details, or speak directly with your dedicated travel designer, please reply directly to this email or reach us on WhatsApp.
                </p>
                <a href="mailto:${emailFrom}?subject=${encodeURIComponent(`Re: ${subject}`)}" style="display:inline-block; background-color:#cca45b; color:#07160f; text-decoration:none; padding:14px 32px; font-size:13px; font-weight:bold; text-transform:uppercase; letter-spacing:1.5px; border-radius:10px; box-shadow:0 4px 15px rgba(204,164,91,0.3);">
                  Reply & Confirm Itinerary
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#06140e; padding:25px 30px; text-align:center; border-top:1px solid rgba(255,255,255,0.08); font-size:12px; color:#64748b; line-height:1.6;">
              <strong style="color:#cbd5e1;">SunHaven Lanka (Pvt) Ltd.</strong><br>
              Luxury Bespoke Tours & Private Chauffeur Services Sri Lanka<br>
              WhatsApp Concierge: +94 77 123 4567 | Web: www.sunhavenlanka.com
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  // If SMTP is configured, send real email
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: emailFrom,
        to: toEmail,
        subject,
        html: htmlContent,
      });

      console.log(`[Email Dispatched] Message ID: ${info.messageId} to ${toEmail}`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error("[Email Error] Failed to send via SMTP:", err);
      return { success: false, error: err.message };
    }
  }

  // Graceful development mode simulation
  console.log(`\n=============================================================`);
  console.log(`[SIMULATED EMAIL DISPATCH - SMTP not set in .env]`);
  console.log(`To: ${toEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`Quoted Price: ${quotePrice}`);
  console.log(`Places: ${customPlaces.join(", ")}`);
  console.log(`=============================================================\n`);

  return { success: true, simulated: true };
}
