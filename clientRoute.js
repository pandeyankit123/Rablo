const express = require("express");
const router = express.Router();
const { createPerson, verifyOtp } = require("./controller");

router.post("/submit-details", createPerson);
router.post("/verify-otp", verifyOtp);

module.exports = router;
