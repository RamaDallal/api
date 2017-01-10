import EmailTemplate from 'email-templates';
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import config from '../../../../../config.js';

function emailConfirmation() => {
  const transporter = nodemailer.createTransport(sgTransport(nodeMailerOptions));
  const link = 'http://' + config.apiHost + ':' + config.apiPort + '/api/graphql/confirm?id=' + user.id;
  var sendPwdReminder = transporter.templateSender(new EmailTemplate('template/email'), {
    from: 'sender@example.com',
  });
  sendPwdReminder({
    to: [args.username, 'sammour.ma7moud@gmail.com'],
    subject: 'Hello',
    context: {
      variable1 : '<b><a href="' + link + '">Confirm Link</a> </b>',
    }
  })
}

export default emailConfirmation;
