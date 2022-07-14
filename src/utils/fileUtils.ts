import JSZip from "jszip";
import { readFileAsync } from "./readFileAsync";
import { extractFilesAsync } from "./zipUtils";

export interface FileMetadata {
  name: string,
  path?: string,
  size: number,
  type?: string,
}

export interface FileData {
  metadata: FileMetadata,
  data: string,
}

export function prettifyFileSize(size: number) {
  if (size > 1024) {
    return `${Math.ceil(size / 1024)} KB`;
  }

  if (size > 100) {
    return "1 KB";
  }

  return `${size} B`
}

export async function readFiles(files: FileList | null): Promise<FileData[]> {
  
  const fileData: FileData[] = [];

  if (files === null) {
    return fileData;
  }

  for (let index = 0; index < files.length; index++) {
    const file = files[index];

    if (file.type === "application/x-zip-compressed") {
      const zipFiles = await processZipFile(file);
      for (let zipIndex = 0; zipIndex < zipFiles.length; zipIndex++) {
        fileData.push(zipFiles[zipIndex]);        
      }
    } else {
      const data = await readFileAsync(file);
      fileData.push(buildFileData(file, data));
    }  
  }

  return fileData;
}

export function extractPathFromPath(pathAndName: string): string {
  if (pathAndName.indexOf("/") === -1) {
    return "/";
  }

  if (pathAndName[0] === "/") {
    return pathAndName.substring(1, pathAndName.lastIndexOf("/"));
  } else {
    return pathAndName.substring(0, pathAndName.lastIndexOf("/"));
  }
}

export function extractNameFromPath(pathAndName: string): string {
  if (pathAndName.indexOf("/") === -1) {
    return pathAndName;
  }

  return pathAndName.substring(pathAndName.lastIndexOf("/") + 1);
}

export function buildFileData(fileMetadata: FileMetadata, data: string): FileData {
  return {
    metadata: {
      name: fileMetadata.name,
      path: fileMetadata.path,
      size: fileMetadata.size,
      type: fileMetadata.type || inferTypeFromFileName(fileMetadata.name),
    },
    data: data,
  }    
}

async function processZipFile(file: File): Promise<FileData[]> {
  let zip = new JSZip();
  zip = await zip.loadAsync(file);
  
  const files = await extractFilesAsync(zip);

  return files;
}

function inferTypeFromFileName(fileName: string) {
  if (fileName.indexOf(".") === -1) {
    return "text/plain";
  }

  const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
  switch (extension) {
    case "json":
      return "application/json";
    default:
      return "text/plain";
  }
}