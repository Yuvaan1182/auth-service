import nodemailer from "nodemailer";
import { env } from "./env.config.js";

export const transporter = nodemailer.createTransport({
  host: env.app_mail_host,
  port: env.app_mail_port,
  secure: env.app_mail_secure,
  auth: {
    user: env.app_mail_user,
    pass: env.app_mail_pass,
  },
});

export const verifySMTPConn = async () => {
  try {
    await transporter.verify();

    console.log(
      `✅ SMTP connected (${process.env.NODE_ENV}) -> ${env.app_mail_host}:${env.app_mail_port}`,
    );
  } catch (err) {
    console.error("❌ Failed to connect to SMTP", err);
    process.exit(1);
  }
};
