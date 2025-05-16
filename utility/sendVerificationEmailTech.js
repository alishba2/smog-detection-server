// utils/sendVerificationEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationTech = async (to, email, password) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'You are added to a shop on Smog Detection',
        html: `
        <h2>Hello, ${email}!</h2>
        <p>You have been added to a shop on Smog Detection.</p>
        <p>Login using the following password: ${password}</p>
      `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationTech;
