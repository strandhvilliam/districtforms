import "dotenv/config";
import { db } from "@/lib/db";
import { formResponses } from "@/lib/db/schema";
import { DistrictData } from "@/lib/types";

export async function POST(request: Request) {
  const districtData = (await request.json()) as DistrictData;
  await db.insert(formResponses).values(districtData);
  return new Response("OK", { status: 200 });
}
