import { usersTable } from "./users";
import {
  pgTable,
  bigserial,
  varchar,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const postsTable = pgTable(
  "posts",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey(),
    authorName: varchar("author_name").references(() => usersTable.username, {
      onDelete: "cascade",
    }),
    content: text("content").notNull(),
    isEdited: boolean("is_edited").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    authorNameIdx: index("author_name_idx").on(table.authorName),
  })
);
