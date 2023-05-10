const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io', // SMTP host of your email service provider
  port: 587, // SMTP port of your email service provider
  secure: false, // Use SSL (true for 465, false for other ports)
  auth: {
    user: process.env.MAILTRAP_USERNAME, // Your email address
    pass: process.env.MAILTRAP_PASSWORD // Your email password
  }
});