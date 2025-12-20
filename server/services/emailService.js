
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


console.log(process.env.EMAIL_USER)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
    rejectUnauthorized: false
  }
});

/**
 * Enviar cotización por correo
 */
export async function sendQuoteEmail(recipientEmail, quoteData) {
    
    try {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
                    .header h1 { margin: 0; color: #2c3e50; }
                    .details { margin: 20px 0; }
                    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .detail-label { font-weight: bold; }
                    .amount { font-size: 24px; color: #27ae60; font-weight: bold; }
                    .button { display: inline-block; margin-top: 20px; padding: 12px 30px; background-color: #27ae60; color: white; text-decoration: none; border-radius: 5px; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Your Cleaning Service Quote</h1>
                    </div>

                    <p>Hello ${quoteData.customerName || quoteData.customer_name},</p>

                    <p>Thank you for requesting a quote! Here are your service details:</p>

                    <div class="details">
                        <div class="detail-row">
                            <span class="detail-label">Quote ID:</span>
                            <span>${quoteData.quoteId}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Service Type:</span>
                            <span>${quoteData.serviceCode}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Property Size:</span>
                            <span>${quoteData.beds} bed(s), ${quoteData.baths} bath(s)</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Frequency:</span>
                            <span>${quoteData.frequency}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span>${quoteData.address}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Scheduled Date:</span>
                            <span>${quoteData.date}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Scheduled Time:</span>
                            <span>${quoteData.time}</span>
                        </div>
                        <div class="detail-row" style="border: none; margin-top: 20px;">
                            <span class="detail-label">Quote Amount:</span>
                            <span class="amount">$${quoteData.quoteAmount}</span>
                        </div>
                    </div>

                    <p>If you would like to confirm this service, please click the button below:</p>

                    <center>
                        <a href="${quoteData.confirmUrl}" class="button">Confirm Service</a>
                    </center>

                    <p>If the button doesn't work, copy and paste this link in your browser:</p>
                    <p><small>${quoteData.confirmUrl}</small></p>

                    <p>If you have any questions or need to modify your service details, please reply to this email.</p>

                    <div class="footer">
                        <p>Pristine Homes Cleaning Service</p>
                        <p>This is an automated message. Please do not reply directly to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: `Your Pristine Homes Cleaning Quote #${quoteData.quoteId.slice(0, 8)}`,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Quote email sent to ${recipientEmail}`);

    } catch (error) {
        console.error('Error sending quote email:', error);
        throw error;
    }
}


/**
 * Enviar confirmación de servicio
 */
export async function sendConfirmationEmail(recipientEmail, bookingData) {
    try {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #27ae60; padding: 20px; text-align: center; color: white; border-radius: 5px; }
                    .header h1 { margin: 0; }
                    .details { margin: 20px 0; }
                    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .detail-label { font-weight: bold; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Service Confirmed! ✓</h1>
                    </div>

                    <p>Hello ${bookingData.customerName || bookingData.customer_name},</p>

                    <p>Great news! Your cleaning service has been confirmed and added to our system.</p>

                    <div class="details">
                        <div class="detail-row">
                            <span class="detail-label">Booking ID:</span>
                            <span>${bookingData.bookingId}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Service Type:</span>
                            <span>${bookingData.serviceCode}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Scheduled Date:</span>
                            <span>${bookingData.scheduledDate}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Scheduled Time:</span>
                            <span>${bookingData.scheduledTime}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span>${bookingData.address}</span>
                        </div>
                    </div>

                    <p>Our team will contact you shortly to confirm the final details and discuss any special requirements.</p>

                    <p>Thank you for choosing Pristine Homes!</p>

                    <div class="footer">
                        <p>Pristine Homes Cleaning Service</p>
                        <p>Booking Reference: ${bookingData.bookingId}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: `Service Confirmed - Booking #${bookingData.bookingId.slice(0, 8)}`,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${recipientEmail}`);

    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw error;
    }
}


export const sendAdminNotification = async (bookingData) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, 
        subject: `🚨 NEW JOB CONFIRMED: ${bookingData.service_date} @ ${bookingData.service_time}`,
        html: `
            <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px;">
                <h2 style="color: #2c3e50;">New Cleaning Service Confirmed</h2>
                <p><strong>Customer:</strong> ${bookingData.customer_name || bookingData.name || 'Not provided'}</p>
                <p><strong>Phone:</strong> ${bookingData.phone || 'Not provided'}</p>
                <hr />
                <p><strong>Service:</strong> ${bookingData.service_code}</p>
                <p><strong>Date:</strong> ${new Date(bookingData.service_date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${bookingData.service_time}</p>
                <p><strong>Address:</strong> ${bookingData.address}</p>
                <p><strong>Details:</strong> ${bookingData.beds} Beds, ${bookingData.baths} Baths</p>
                <p><strong>Frequency:</strong> ${bookingData.frequency}</p>
                <hr />
                <h3 style="color: #27ae60;">Total to Collect: $${Math.round(bookingData.quote_amount)}</h3>
            </div>
        `
    };
    return transporter.sendMail(mailOptions);
};

