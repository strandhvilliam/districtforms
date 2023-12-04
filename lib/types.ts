import * as z from "zod";

export type RowData = {
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
};
