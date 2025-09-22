import { SendMailClient } from "zeptomail";
import { EmailAddress } from "zeptomail/types";
import config from "../config/env.config";

export type SendMail = {
  subject: string;
  from: EmailAddress;
  receipts: Record<"email_address", EmailAddress[]>;
};

export async function sendMail(
  subject: string,
  from: EmailAddress,
  receipts: Record<"email_address", EmailAddress[]>,
) {
  const url = config.ZEPTO_API_URL;
  const token = config.ZEPTO_TOKEN;

  const client = new SendMailClient({ url, token });
  await client.sendMail({
    from,
    to: receipts,
    subject,
    htmlbody: "<div><b> Test email sent successfully.</b></div>",
  });
}
