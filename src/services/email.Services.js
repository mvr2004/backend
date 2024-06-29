// src/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendConfirmationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Confirmation',
    text: `Your confirmation code is: ${code}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
