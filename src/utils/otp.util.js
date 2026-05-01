const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

exports.generateOTP = (length = 6) => {
    return otpGenerator.generate(length, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
}

exports.hashOTP = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
}

exports.verifyOTP = async (otp, hashedOTP) => {
    return bcrypt.compare(otp, hashedOTP);
}