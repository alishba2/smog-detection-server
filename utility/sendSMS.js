const twilio = require('twilio');

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; 

const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
    console.log(message, 'message here');
  // try {
  //   const res = await client.messages.create({
  //     body: message,
  //     from: twilioPhoneNumber,
  //     to: '+923495752290' 
  //   });
  //   console.log('SMS sent successfully:', res.sid);
  //   return res;
  // } catch (error) {
  //   console.error('Error sending SMS:', error.message);
  //   throw error;
  // }
};

module.exports = sendSMS;
