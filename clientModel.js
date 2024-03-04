const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  guardianNumber: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
  referralCode: { type: String },
  school: { type: String, required: true },
  class: { type: String, required: true },
  boards: { type: String, required: true },
  subjectsYouStudy: [{ type: String, required: true }],
  mobileVerification: { type: Boolean, required: true }
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
