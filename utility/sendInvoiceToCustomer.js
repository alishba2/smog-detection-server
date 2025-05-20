const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendInvoiceEmail = async (to, file) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Smog Pay Invoice',
        text: 'Please find the attached invoice.',
        attachments: [
            {
                filename: 'invoice.pdf',
                path: file.path,
            },
        ],
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendInvoiceEmail;

