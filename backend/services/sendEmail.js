const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, 
  auth: {
    user: "vitali_voloc@outlook.com",
    pass: "AB123456abc",
  },
});


async function sendEmail(data) {

    const { userName, userEmail, userMessage } = data

    const email = `
    <p>You take email get from ${userName}</p>
    <p>contact email: ${userEmail}</p>
    <p>message: ${userMessage}</p>
    `

    
  const info = await transporter.sendMail({
    from: "vitali_voloc@outlook.com", 
    to: "vitaliy.bliskun@ukr.net", 
    subject: "April 2024, Notification from 'pretty boy'", 
    text: userMessage, 
    html: email, 
  });

  console.log("Message sent: %s", info.messageId);
}


module.exports = sendEmail