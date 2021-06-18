import nodemailer from 'nodemailer';

module.exports.sendEmailByNodemailer = (receipent, message, attachment) =>
  new Promise((resolve, reject) => {
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'a345nik435et345345tiko534534ne4435454@gmail.com',
        pass: '3333342342425',
      },
    });

    const data = {
      from: 'anikettikone44@gmail.com',
      to: receipent,
      cc: message.cc,
      subject: message.subject,
      text: message.text,
      inline: attachment,
      html: message.html + '  ' + message.text,
    };

    smtpTransport.sendMail(data, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(`Message sent:  + ${response.message}`);
      }
    });
  });
