import { transporter } from "#config/nodemailer.config.js";
import { MAIL_TYPE } from "#types/mail.type.js";
import { AppError } from "#utils/app_error.util.js";

export const sendEmail = async (data: MAIL_TYPE) => {
  const info = await transporter.sendMail({
    from: data.from,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  if (!info.accepted.length || info.rejected.length) {
    throw new AppError(`Email rejected by the server`, 502, "AUTH_FAILURE_002");
  }

  return info;
};
