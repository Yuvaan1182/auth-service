import { Worker } from "bullmq";
import { sendEmail } from "../services/email/nodemailer.service.js";
import { MAIL_TYPE } from "#types/mail.type.js";
import { env } from "#config/env.config.js";
import { verifySMTPConn } from "#config/nodemailer.config.js";

await verifySMTPConn();

console.log("EMAIL WORKER STARTED");

/**
 * @TODO Add email templates for verification email
 * */

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("JOB RECEIVED:", job.name);

    if (job.name === "send_verification_email") {
      const { email, token } = job.data;

      /** --- verification mail end-point --- */
      const verification_email_url = `${env.client_url}/verify-email?token=${token}`;

      const mail_payload: MAIL_TYPE = {
        from: env.app_mail_from,
        to: email,
        subject: "Verify User",
        text: verification_email_url,
        html: `<a href="${verification_email_url}">Verify Email</a>`,
      };

      console.log("EMAIL:", email);
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

worker.on("completed", (job) => {
  console.log("COMPLETED:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("FAILED:", job?.id, err);
});

worker.on("error", (err) => {
  console.error("WORKER ERROR:", err);
});
