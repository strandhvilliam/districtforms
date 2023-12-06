import "dotenv/config";
import { db } from "@/lib/db";
import { formResponses, sentEmails } from "@/lib/db/schema";
import { DistrictData } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const districtData = (await request.json()) as DistrictData;

  const validEmail = await db
    .select()
    .from(sentEmails)
    .where(eq(sentEmails.id, districtData.sentEmailId));

  if (validEmail.length === 0) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (validEmail[0].completed) {
    return new Response("Unauthorized", { status: 401 });
  }

  await db.insert(formResponses).values(districtData);
  return new Response("OK", { status: 200 });
}
