import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";

export async function getAllParentsForFolder(
  folderId: number,
): Promise<(typeof foldersSchema.$inferSelect)[]> {
  const parents = [];
  let currentId: number | null = folderId;
  while (currentId !== null) {
    const folder = await db
      .selectDistinct()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, currentId));

    if (!folder[0]) {
      throw new Error(`Folder with id ${currentId} not found`);
    }
    parents.unshift(folder[0]);
    currentId = folder[0].parent;
  }
  return parents;
}

export function getFolders(folderId: number) {
  return db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, folderId));
}

export function getFiles(folderId: number) {
  return db.select().from(filesSchema).where(eq(filesSchema.parent, folderId));
}
