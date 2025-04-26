const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


const sendResetPasswordEmail = async (to, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`; 

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetPasswordEmail;
