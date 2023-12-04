import "dotenv/config";
import { DistrictData } from "@/app/form/[slug]/page";
import { db } from "@/lib/db";
import { formResponses } from "@/lib/db/schema";

export async function POST(request: Request) {
  const districtData = (await request.json()) as DistrictData;
  await db.insert(formResponses).values(districtData);
  return Response.json({ status: "200" });
}
