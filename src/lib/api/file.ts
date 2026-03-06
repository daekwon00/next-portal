import { apiClient } from "./client";
import type { FileInfo } from "@/types/board";

export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return apiClient
    .post("files/upload", { body: formData })
    .json<FileInfo[]>();
}

export async function downloadFile(fileId: number) {
  const response = await apiClient.get(`files/${fileId}/download`);
  return response.blob();
}
