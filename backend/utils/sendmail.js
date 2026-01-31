import nodemailer from 'nodemailer'

const SendmailTransport = async (email,otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // your gmail
            pass: process.env.EMAIL_PASS, // app password
        },
    });

    await transporter.sendMail({
        from: `"Auth Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset OTP",
        html: `
      <h3>Password Reset</h3>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `,
    });
}

export default SendmailTransport;