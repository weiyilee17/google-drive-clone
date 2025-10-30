import {
  getAllParentsForFolder,
  getFiles,
  getFolders,
} from "~/server/db/queries";
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

  const [folders, files, parents] = await Promise.all([
    getFolders(parsedFolderId),
    getFiles(parsedFolderId),
    getAllParentsForFolder(parsedFolderId),
  ]);
  return <DriveContents files={files} folders={folders} parents={parents} />;
}
