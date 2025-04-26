const sendSMS = require('../utility/sendSMS');

exports.sendFormLink = async (req, res) => {
    const { phone, formLink } = req.body;
    console.log(req.body);

    if (!phone || !formLink) {
        return res.status(400).json({ msg: 'Phone number and form link are required.' });
    }

    const message = `Please fill out this form to register your service: ${formLink}`;

    try {
        await sendSMS(phone, message);
        res.status(200).json({ msg: 'Form link sent successfully via SMS.' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to send SMS.', error: err.message });
    }
};
