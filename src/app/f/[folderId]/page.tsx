import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";
import DriveContents from "../../drive-contents";

async function getAllParents(
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

export default async function GoogleDriveClone({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  // await indicates the following content is dynamic and will be re-evaluated on every request
  const dynamicParams = await params;

  const parsedFolderId = +dynamicParams.folderId;
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const foldersPromise = db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, parsedFolderId));
  const filesPromise = db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, parsedFolderId));

  const parentsPromise = getAllParents(parsedFolderId);

  const [folders, files, parents] = await Promise.all([
    foldersPromise,
    filesPromise,
    parentsPromise,
  ]);
  return <DriveContents files={files} folders={folders} parents={parents} />;
}
