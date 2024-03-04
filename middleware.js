const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const verification = async (toPhoneNumber) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: toPhoneNumber,
    });
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

module.exports = { verification };
