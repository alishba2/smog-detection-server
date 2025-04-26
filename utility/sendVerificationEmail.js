// utils/sendVerificationEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (to,  token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`; 

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify your email',
    html: `
      <h2>Hello,Welome to Smog Detection!</h2>
      <p>Thanks for registering. Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}" target="_blank">Verify Email</a>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
