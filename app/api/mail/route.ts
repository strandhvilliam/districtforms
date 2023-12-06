import "dotenv/config";
import { transporter } from "@/lib/smtp";
import { InsertSentEmail, PostBody, Target } from "@/lib/types";
import { db } from "@/lib/db";
import { sentEmails } from "@/lib/db/schema";
import { ExecutedQuery } from "@planetscale/database";

export async function POST(request: Request) {
  const body = await request.json();
  const { targets } = body as PostBody;

  const insertTargets: InsertSentEmail[] = targets.map((target) => ({
    email: target.email,
    district: target.distrikt,
    createdAt: new Date().toISOString(),
    completed: false,
  }));

  const promises = insertTargets.map((target) => {
    return db.insert(sentEmails).values(target);
  });

  const queryResult: ExecutedQuery[] = await Promise.all(promises);

  const ids = queryResult.map((res) => +res.insertId);

  const emails = targets.map((target, index) => {
    const link = `https://uppsalars1.vercel.app/form/${target.distrikt}?namn=${target.namn}&aterlamnad=${target.aterlamnad}&id=${ids[index]}`;
    const subject = `Tack för att du har bearbetat distrikt: ${target.distrikt}`;
    return transporter.sendMail({
      from: "Distriktgruppen Uppsala Södra, <uppsalars1@gmail.com>",
      to: target.email,
      subject,
      html: generateEmailTemplate(target, link, subject),
    });
  });

  const res = await Promise.all(emails);

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function generateEmailTemplate(
  { distrikt, namn }: Target,
  link: string,
  subject: string,
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">

    <h2 style="color: #333333;">Hej ${namn}!</h2>
    <p style="color: #666666;">Tack för att du har bearbetat distriktet: ${distrikt}.</p>

    <p style="color: #666666;">Tryck på länken för att komma till ett formulär för att svara på frågor om distriktet.</p>

    <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: ; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 15px;">Visa formulär</a>

    <p style="color: #666666;">Länken är giltig i 7 dagar.</p>
    <p style="color: #666666;">Om du har några frågor eller funderingar, kontakta oss gärna!</p>

    <p style="color: #666666;">Med vänliga hälsningar,</p>
    <p style="color: #666666;">Distriktsgruppen, Uppsala Södra Församling av Jehovas Vittnen</p>


  </div>

</body>
</html>
`;
}
