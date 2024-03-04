require("dotenv").config();
const Person = require("./clientModel");
const Validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const secret = process.env.SECRET;

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

async function sendOTP(mobileNumber, otp) {
  await client.messages
    .create({
      body: `Your OTP is ${otp}`,
      from: "+1 251 564 0502",
      to: mobileNumber,
    })
    .then((message) => console.log(message))
    .catch((error) => {
      console.log(error);
    });
}

const createToken = (_id) => {
  return jwt.sign({ _id }, secret, { expiresIn: `3d` });
};

const createPerson = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      mobileNumber,
      email,
      password,
      address,
      city,
      state,
      pincode,
      school,
      Class,
      boards,
      subjectsYouStudy,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !gender ||
      !mobileNumber ||
      !email ||
      !password ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !school ||
      !Class ||
      !boards ||
      !subjectsYouStudy
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!Validator.isEmail(email)) {
      throw Error("Email is not valid");
    }

    if (!Validator.isStrongPassword(password)) {
      throw Error("Password is not strong enough");
    }

    const user = await Person.findOne({ email, mobileNumber });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();

    req.session.userDetails = {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      mobileNumber,
      email,
      password: hashedPassword,
      address,
      city,
      state,
      pincode,
      school,
      Class,
      boards,
      subjectsYouStudy,
      otp,
    };

    sendOTP(mobileNumber, otp);

    res.status(200).json({
      message:
        "User details submitted successfully. Please verify mobile number with OTP.",
    });
  } catch (error) {
    console.error("Error submitting details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;
    const userDetails = req.session.userDetails;
    if (!userDetails) {
      return res.status(400).json({
        error: "User details not found. Please submit user details first.",
      });
    }

    if (otp !== userDetails.otp || mobileNumber !== userDetails.mobileNumber) {
      return res
        .status(400)
        .json({ error: "Invalid OTP or mobile number. Please try again." });
    }
    userDetails.mobileverification = true;

    const user = await Person.create(userDetails);

    const token = createToken(user._id);

    delete req.session.userDetails;

    res.status(200).json({
      message: "Mobile number verified successfully. User details saved.",
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createPerson, verifyOtp };
