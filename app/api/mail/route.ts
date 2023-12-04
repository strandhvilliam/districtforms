import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "strandh.villiam@gmail.com",
    pass: "xsmtpsib-8727ff18eb0aacfca0af80af5c1882fe692bdae88d94d60cf25bc6329c98bfeb-J0hMp7nIGAPO8yaq",
  },
});

function generateEmailTemplate({ distrikt, namn }: Target) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Helping Us</title>
</head>
<body style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">

    <h2 style="color: #333333;">Hej ${namn}!</h2>
    <p style="color: #666666;">Tack för att du har bearbetat distriktet: ${distrikt}.</p>

    <p style="color: #666666;">Tryck på länken för att komma till ett formulär för att svara på frågor om distriktet.</p>

    <a href="https://your-form-link.com" style="display: inline-block; padding: 10px 20px; background-color: ; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 15px;">Visa formulär</a>

    <p style="color: #666666;">Med vänliga hälsningar,</p>
    <p style="color: #666666;">Distriktsgruppen, Uppsala Södra Församling av Jehovas Vittnen</p>


  </div>

</body>
</html>
`;
}

type Target = {
  email: string;
  distrikt: string;
  namn: string;
};

type PostBody = {
  targets: Target[];
};

export async function POST(request: Request) {
  const { targets } = (await request.json()) as PostBody;

  const emails = targets.map((target) => {
    return transporter.sendMail({
      from: "Distriktgruppen Uppsala Södra, <uppsalars1@gmail.com>",
      to: target.email,
      subject: `Tack för att du har bearbetat distrikt: ${target.distrikt}`,
      html: generateEmailTemplate(target),
    });
  });

  const res = await Promise.all(emails);

  return Response.json(res);
}
