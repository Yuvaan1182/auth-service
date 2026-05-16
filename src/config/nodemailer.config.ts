import nodemailer from "nodemailer";
import { env } from "./env.config.js";

export const transporter = nodemailer.createTransport({
  host: env.app_mail_host,
  port: env.app_mail_port,
  secure: env.app_mail_port === 465 ? true : false,
  service: env.app_mail_service_provider,
  auth: {
    user: env.app_mail_user,
    pass: env.app_mail_pass,
  },
});
