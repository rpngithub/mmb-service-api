const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const axios = require('axios');

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

exports.sendOTP = async (phone, otp) => {
    // Implement your SMS sending logic here using Ping4SMS or any other service
    // Example using Ping4SMS:
    
    const apiUrl = process.env.PING4SMS_API_URL;
    const apiKey = process.env.PING4SMS_API_KEY;
    const senderId = process.env.PING4SMS_SENDER_ID;
    const templateId = process.env.PING4SMS_TEMPLATE_ID;
    const route = process.env.PING4SMS_ROUTE;

    // https://site.ping4sms.com/api/smsapi?key=5d32fac441d2aa1c73f0a5baff70e16d&route=2&sender=PNGOTP&number=Number(s)&sms=Dear Customer,{#var#} is your verification code -PNGOTP&templateid=1507165967974501361

    const url = `${apiUrl}?key=${apiKey}&route=${route}&sender=${senderId}&number=${phone}&sms=Dear Customer,${otp} is your verification code -${senderId}&templateid=${templateId}`;

    try {
        const response = await axios.get(url);
        console.log('OTP sent response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending OTP:', error);
        // throw new Error('Failed to send OTP');
    }
}