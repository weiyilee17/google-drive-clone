import {
  bigint,
  index,
  int,
  singlestoreTableCreator,
  text,
} from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator(
  (name) => `drive_tutorial_${name}`,
);

export const files = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: text("name").notNull(),
    size: bigint("size", { mode: "number", unsigned: true }).notNull(),
    url: text("url").notNull(),
    parent: bigint("parent", { mode: "number", unsigned: true }).notNull(),
  },
  (t) => [index("parent_index").on(t.parent)],
);

export const folders = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: text("name").notNull(),
    parent: int("parent"),
  },
  (t) => [index("parent_index").on(t.parent)],
);
