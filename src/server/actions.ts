"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { UTApi } from "uploadthing/server";
import { db } from "./db";
import { files_table } from "./db/schema";

const utApi = new UTApi();

// Exporing an async function here exports an endpoint to the client
// thus must be handled carefully
export async function deleteFile(fileId: number) {
  const user = await auth();
  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, user.userId)),
    );

  if (!file) {
    throw new Error("File not found");
  }

  const utApiResponse = await utApi.deleteFiles([
    file.url.replace("https://enrcrwqq9m.ufs.sh/", ""),
  ]);
  console.log("🚀 ~ deleteFile ~ utApiResponse:", utApiResponse);

  const dbDeleteResult = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));
  console.log("🚀 ~ deleteFile ~ dbDeleteResult:", dbDeleteResult);

  const c = await cookies();

  // Set a cookie to force a refresh of the page
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
