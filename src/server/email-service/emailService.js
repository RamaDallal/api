import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import config from '../../../config';
import { EmailTemplate } from 'email-templates';
import jwt from 'jsonwebtoken';

const nodeMailerOptions = {
  auth: {
    api_key: config.nodeMailer.apiKey
  }
};
const transporter = nodemailer.createTransport(sgTransport(nodeMailerOptions));
export const signUpConfirmEmail = (user, callback) => {
  const { email } = user;
  const link = `http://${config.apiHost}:${config.apiPort}/api/graphql/confirm?id=${user.id}`;
  const sendPwdReminder = transporter.templateSender(
    new EmailTemplate('src/server/email-service/template/sign-up-confirm'), {
      from: 'sender@example.com'
    });
  sendPwdReminder({
    to: [email, 'sammour.ma7moud@gmail.com'],
    subject: 'SignUp Confirmation Email'
  }, { email, link }, callback);
};
export const forgottenPasswordEmail = (user, callback) => {
  const { email } = user;
  const token = jwt.sign({ email: user.email }, config.jwt.secretKey);
  const link = `http://${config.frontendHost}:${config.frontendPort}/api/graphql/confirm?id=${token}`;
  const sendPwdReminder = transporter.templateSender(
    new EmailTemplate('src/server/email-service/template/forgotten-password'), {
      from: 'sender@example.com'
    });
  sendPwdReminder({
    to: [email, 'sammour.ma7moud@gmail.com'],
    subject: 'Forgotten Password Email'
  }, { email, link }, callback);
};
