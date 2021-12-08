const nodemailer = require('nodemailer');
const senderEmail = process.env.EMAIL
const password = process.env.EPASSWORD

const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
        user: senderEmail,
        pass: password,
    },
    secure: true,
});



module.exports = transporter;