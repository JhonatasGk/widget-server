const API_KEY = 'fe066263-e23fb429';
const DOMAIN = 'sandbox03253c70a66545e79985bd7a9d5fa458.mailgun.org';
import {Request, Response,} from 'express'
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: API_KEY});

const messageData = {
  from: 'Excited User <jhonatas@gmail.com',
  to: 'foo@example.com, bar@example.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!'
};

client.messages.create(DOMAIN, messageData)
 .then((res:Request) => {
   console.log(res);
 })
 .catch((err: Error) => {
   console.error(err);
 });
