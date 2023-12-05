import { db } from "@/lib/db";
import { auth } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import "dotenv/config";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const user = await db.select().from(auth).where(eq(auth.username, username));

  if (user.length === 0) {
    return Response.json({ status: "404" });
  }

  const passwordMatch = await bcrypt.compare(password, user[0].password);

  if (!passwordMatch) {
    return Response.json({ status: "401" });
  }
  const secret = process.env.JWT_SECRET;
  const exp = process.env.JWT_EXPIRES_IN;

  if (!secret || !exp) {
    return Response.json({ status: "500" });
  }

  const token: string = jwt.sign(
    { username: user[0].username, id: user[0].id },
    secret,
    {
      expiresIn: exp,
    },
  );

  return Response.json({ status: "200", token });
}
