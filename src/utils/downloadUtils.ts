import JSZip from "jszip";
import { FileData } from "./fileUtils";
import { buildZip } from "./zipUtils";

export interface FileDownloadInfo {
  url: string,
  fileName: string
}

function createJsonBlob(data: any): Blob {
  return new Blob([data], { type: "application/json" });
}

function createYamlBlob(data: any): Blob {
  return new Blob([data], { type: "text/plain" });
}

async function createZipBlob(zip: JSZip): Promise<Blob> {
  return await zip.generateAsync({ type: "blob" });
}

export function revokeDownloadUrl(file: FileDownloadInfo | null | undefined) {
  if (file && file !== null && file.url !== "") {
    URL.revokeObjectURL(file.url);
    console.log(`Revoked URL ${file.url} for ${file.fileName}`);
  }
}

export function prepareDownload(data: string, fileName: string): FileDownloadInfo {

  if (data === "") {
    return { url: "", fileName: "" };
  }

  const downloadFileName = fileName || "data.json";

  let blob;
  if (downloadFileName.indexOf(".json") > -1) {
    blob = createJsonBlob(data);
  } else {
    blob = createYamlBlob(data);
  }

  const downloadUrl = URL.createObjectURL(blob);

  return { url: downloadUrl, fileName: downloadFileName };
}

export async function prepareZipDownload(files: FileData[]): Promise<FileDownloadInfo> {
  
  if (files.length === 0) {
    return { url: "", fileName: "" };
  }

  const downloadFileName = "bundle.zip";

  const zip = buildZip(files);

  const blob = await createZipBlob(zip);

  const downloadUrl = URL.createObjectURL(blob);

  return { url: downloadUrl, fileName: downloadFileName };
}