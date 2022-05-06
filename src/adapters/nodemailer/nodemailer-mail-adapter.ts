import { MailAdapter, SandMailData } from "../mail-adapter";
import nodemailer from 'nodemailer'; 

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "0b4efac65da5df",
      pass: "d4290c2a746756"
    }
  });

export class NodemailerMailAdapter implements MailAdapter {
    async sendMail({subject,body}: SandMailData) {
        await transport.sendMail({
            from: 'Equipe feedget <feedback@feedget.com>',
            to: 'Jhontas Grevink <jhontasgr@gmail.com>',
            subject,
            html: body,
        })
    }
}