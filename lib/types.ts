import * as z from "zod";
import { formResponses, sentEmails } from "./db/schema";

export type RowData = {
  Id: string;
  Anteckningar: string;
  Distriktsnummer: string;
  Distriktstitel: string;
  Distriktstyp: string;
  "E-post": string;
  Namn: string;
  Obearbetade: string;
  Telefon: string;
  Tilldelade: Date;
  Återlämnad: Date;
};

export const formSchema = z.object({
  sizeAnswer: z.string().optional(),
  lockedAnswer: z.string().optional(),
  mapAnswer: z.string().optional(),
  facilitiesAnswer: z.string().optional(),
  elevatorAnswer: z.string().optional(),
  parkingAnswer: z.string().optional(),
  otherAnswer: z.string().optional(),
});

export type FormAnswers = z.infer<typeof formSchema>;
export type DistrictData = FormAnswers & {
  district: string;
  name: string;
  date: string;
  sentEmailId: number;
};

export type SelectFormResponse = typeof formResponses.$inferSelect;

export type SelectSentEmail = typeof sentEmails.$inferSelect;
export type InsertSentEmail = typeof sentEmails.$inferInsert;

export type Target = {
  email: string;
  distrikt: string;
  namn: string;
  aterlamnad: string;
};

export type PostBody = {
  targets: Target[];
};
