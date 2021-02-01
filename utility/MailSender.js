const nodemailer =  require('nodemailer');

let transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: process.env['SENDGRID_USER'],
      pass: process.env['SENDGRID_PASSWORD']
    },
  });

  module.exports = transporter;