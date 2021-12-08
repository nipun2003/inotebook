const transporter = require('../config/emailConfig');
const senderEmail = process.env.EMAIL;

const sendMail = (recieverEmail, otp) => {
    const message = `${otp} is the otp for your iNoteApp. \nDo not reply to this email.`
    const mailData = {
        from: `INoteBook<${senderEmail}>`,  // sender address
        to: recieverEmail,   // list of receivers
        subject: "Verification mail",
        text: message,
    };
    transporter.sendMail(mailData, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}

module.exports =sendMail;