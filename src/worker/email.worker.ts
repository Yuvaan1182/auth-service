import { Worker } from "bullmq";
import { sendEmail } from "../services/email/nodemailer.service.js";
import { MAIL_TYPE } from "#types/mail.type.js";
import { env } from "#config/env.config.js";

new Worker(
  "emailQueue",
  async (job) => {
    if (job.name === "send_verification_email") {
      const { email, token } = job.data;
      const verification_email_url = `${env.client_url}/verify-email?token=${token}`;
      const mail_payload: MAIL_TYPE = {
        from: env.app_mail_user,
        to: email,
        subject: "Verify User",
        text: verification_email_url,
        html: `<a href="${verification_email_url}">Verify Email</a>`,
      };
      await sendEmail(mail_payload);
    }
  },
  {
    connection: {
      host: env.cache_host,
      port: env.cache_port,
      password: env.cache_password,
    },
  },
);
