import * as jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { auth, sentEmails } from "@/lib/db/schema";
import { SelectSentEmail } from "@/lib/types";
import { eq } from "drizzle-orm";
export async function GET() {
  const headersList = headers();

  const token = headersList.get("authorization");
  console.log("GETTING SENT EMAILS");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const decodedToken = jwt.decode(token);
  if (!decodedToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = decodedToken as { id: number };

  const validUser = await db.select().from(auth).where(eq(auth.id, id));

  if (validUser.length === 0) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sent: SelectSentEmail[] = await db.select().from(sentEmails);

  return new Response(JSON.stringify(sent), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
