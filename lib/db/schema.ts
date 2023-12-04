import { mysqlTable, serial, varchar, text } from "drizzle-orm/mysql-core";

export const formResponses = mysqlTable("form_responses", {
  id: serial("id").primaryKey().notNull(),
  district: varchar("district", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }),
  date: varchar("date", { length: 256 }),
  sizeAnswer: text("size_answer"),
  lockedAnswer: text("locked_answer"),
  mapAnswer: text("map_answer"),
  facilitiesAnswer: text("facilities_answer"),
  elevatorAnswer: text("elevator_answer"),
  parkingAnswer: text("parking_answer"),
  otherAnswer: text("other_answer"),
});
