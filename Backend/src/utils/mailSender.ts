import nodemailer from 'nodemailer';
import { z } from 'zod';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,

})

const emailSchema = z.object({
    from: z.string().email("Invalid sender email"),
    to: z.string().email("Invalid recipient email"),
    subject: z.string().min(1, "Subject is required"),
    text: z.string().min(1, "Email body is required"),
});

const mailSender = async ({from , to, subject, text}: z.infer<typeof emailSchema>) => {
    
    emailSchema.parse({ from, to, subject, text });
    try {
        const info = transporter.sendMail({
            from : `${from}`,
            to : `${to}`,
            subject : `${subject}`,
            text : `${text}`,
        },()=>{
            console.log('Email Sent Successfully');
        })
    } catch (error) {
        console.error("Failed to send email:", error);
        throw new Error("Unable to send email. Please try again later.");
    }
}

export default mailSender;