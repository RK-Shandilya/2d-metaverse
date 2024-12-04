import mongoose from "mongoose";
import mailSender from "../utils/mailSender";

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
})

async function sendVerifiactionEmail(email: string, otp: string) {
    try {
        const mail = mailSender({
            from: 'rudrasharma405@gmail.com',
            to: email,
            subject: "Verification Email",
            text: `Your verification code is ${otp}`
        })
        console.log(`Verification email sent to ${email}`,mail);
    } catch (error) {
        console.log(error)
    }
}

OtpSchema.pre('save',async function (next) {
    console.log('New document saved to Database');
    if(this && this.isNew) {
        await sendVerifiactionEmail(this.email, this.otp);
    }
    next();
})

const Otp = mongoose.model('Otp', OtpSchema);
export default Otp;