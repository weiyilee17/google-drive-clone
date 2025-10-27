import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";
import DriveContents from "../../drive-contents";

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

  const folders = await db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, parsedFolderId));
  const files = await db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, parsedFolderId));
  return <DriveContents files={files} folders={folders} />;
}
