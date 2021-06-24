import nodemailer from 'nodemailer';
import config from '../config/config';

module.exports.sendEmailByNodemailer = (receipent, message, attachment) =>
  new Promise((resolve, reject) => {
    console.log('coming upto here', config.nodemailerConfig);
    const smtpTransport = nodemailer.createTransport(config.nodemailerConfig);
    /* var mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' }; */

    const data = {
      from: 'no-reply@deqode.com',
      to: receipent,
      cc: message.cc,
      subject: message.subject,
      text: message.text,
      inline: attachment,
      html: `${message.html}   \n  ${message.text}`,
    };

    smtpTransport.sendMail(data, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(`Message sent:  + ${response.message}`);
      }
    });
  });
