import {
  mysqlTable,
  serial,
  varchar,
  text,
  boolean,
} from "drizzle-orm/mysql-core";

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

export const auth = mysqlTable("auth", {
  id: serial("id").primaryKey().notNull(),
  username: varchar("username", { length: 256 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
});

export const sentEmails = mysqlTable("sent_emails", {
  id: serial("id").primaryKey().notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  createdAt: varchar("created_at", { length: 256 }).notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: varchar("completed_at", { length: 256 }),
  district: varchar("district", { length: 256 }).notNull(),
});
