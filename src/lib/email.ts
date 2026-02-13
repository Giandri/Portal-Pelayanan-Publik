
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
    to: string;
    trackingId: string;
    name: string;
    type: string;
}

export const sendPermitEmail = async ({ to, trackingId, name, type }: EmailParams) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Balai Wilayah Sungai (BWS) Bangka Belitung <onboarding@resend.dev>',
            to: [to],
            subject: `Nomor Lacak Pengajuan`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #fcc800; padding: 20px; text-align: center; color: white;">
                        <h2 style="margin: 0;">Sistem Pelayanan Publik</h2>
                    </div>
                    
                    <div style="padding: 24px;">
                        <p>Halo <strong>${name}</strong>,</p>
                        
                        <p>Permohonan izin Anda dengan perihal "<strong>${type}</strong>" telah kami terima.</p>
                        
                        <p>Berikut adalah Nomor Lacak (Tracking ID) Anda:</p>
                        
                        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; text-align: center; margin: 20px 0;">
                            <span style="font-family: monospace; font-size: 24px; font-weight: bold; color: #1e293b; letter-spacing: 2px;">
                                ${trackingId}
                            </span>
                        </div>
                        
                        <p>Silakan gunakan nomor tersebut untuk melacak status permohonan Anda melalui tautan di bawah ini:</p>
                        
                        <div style="text-align: center; margin: 24px 0;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/lacak/${trackingId}" 
                               style="background-color: #fcc800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                Lacak Permohonan
                            </a>
                        </div>
                        
                        <p style="color: #64748b; font-size: 14px;">
                            Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut di browser Anda:<br>
                            ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/lacak/${trackingId}
                        </p>
                    </div>
                    
                    <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e0e0e0; color: #64748b; font-size: 12px;">
                        <p style="margin: 0;">Email ini dikirim secara otomatis. Mohon jangan membalas email ini.</p>
                        <p style="margin: 5px 0 0;">&copy; ${new Date().getFullYear()} Balai Wilayah Sungai (BWS) Bangka Belitung</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }

        console.log('Email sent successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Exception sending email:', error);
        return { success: false, error };
    }
};
