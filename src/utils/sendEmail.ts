import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { __prod__ } from "../constants";
import { IUser } from "../models/users/users.types";
import pug from "pug";

export class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;
  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Binh Trinh <${process.env.EMAIL_FROM}>`;
  }

  newTransport(): Mail {
    if (!__prod__) {
      console.log("caall");
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: process.env.DEV_EMAIL_USERNAME,
          pass: process.env.DEV_EMAIL_PASS,
        },
      });
    }
    // TODO: work on email for prod
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: "apikey",
        pass: "supersecret",
      },
    });
  }

  // TODO: work on template
  async send(_template: string, subject: string, html: string) {
    const email = await this.newTransport().sendMail({
      from: this.from,
      to: this.to,
      subject,
      html,
    });
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(email));
  }
}
