import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import config from '../../../config';
import {EmailTemplate} from 'email-templates';

const nodeMailerOptions = {
  auth: {
    api_key: config.nodeMailer.apiKey
  }
};
const transporter = nodemailer.createTransport(sgTransport(nodeMailerOptions));
export const signUpConfirmEmail = (user, callback) => {
  const { email } = user;
  const link = 'http://' + config.apiHost + ':' + config.apiPort + '/api/graphql/confirm?id=' + user.id;
  const sendPwdReminder = transporter.templateSender(new EmailTemplate('src/server/email-service/template/sign-up-confirm'), {
    from: 'sender@example.com'
  });
  // use template based sender to send a message
  console.log(link);
  sendPwdReminder({
    to: [email, 'sammour.ma7moud@gmail.com'],
    // EmailTemplate renders html and text but no subject so we need to
    // set it manually either here or in the defaults section of templateSender()
    subject: 'SignUp Confirmation Email'
  }, { email, link }, callback);
};
export const forgottenPasswordEmail = (user, callback) => {
  const { email } = user;
  var link = 'http://' + config.frontendHost + ':' + config.frontendPort + '/resetPassword?email=' + user.email;
  const sendPwdReminder = transporter.templateSender(new EmailTemplate('src/server/email-service/template/forgotten-password'), {
    from: 'sender@example.com'
  });
  sendPwdReminder({
    to: [email, 'sammour.ma7moud@gmail.com'],
    subject: 'Forgotten Password Email'
  }, { email, link }, callback);
};
