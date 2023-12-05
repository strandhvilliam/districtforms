import * as jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { auth, formResponses } from "@/lib/db/schema";
import { SelectFormResponse } from "@/lib/types";
import { eq } from "drizzle-orm";
export async function GET() {
  const headersList = headers();

  const token = headersList.get("authorization");
  console.log("GETTING ANSWERS");

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

  const answers: SelectFormResponse[] = await db.select().from(formResponses);

  return new Response(JSON.stringify(answers), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
