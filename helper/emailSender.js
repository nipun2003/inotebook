const transporter = require('../config/emailConfig');
const senderEmail = process.env.EMAIL;
const hbs = require('nodemailer-express-handlebars');
transporter.use('compile',hbs({
   viewEngine:{
     extname:'.handlebars',
     defaultLayout:false
   },
   viewPath : './view/',
   defaultLayout:false
}));

const sendMail = (recieverEmail, otp) => {
    const message = `${otp} is the otp for your iNoteApp. \nDo not reply to this email.`
    const mailData = {
        from: `INoteBook<${senderEmail}>`,  // sender address
        to: recieverEmail,   // list of receivers
        subject: "Verification mail",
        text: message,
        template:'index'
    };
    transporter.sendMail(mailData, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}

module.exports =sendMail;