import JSZip, { JSZipObject } from "jszip";
import { buildFileData, extractNameFromPath, extractPathFromPath, FileData } from "./fileUtils";

export function buildZip(files: FileData[]): JSZip {
  const zip = new JSZip();

  const folders = new Map();

  for (let index = 0; index < files.length; index++) {
    const file = files[index];

    if (file.metadata.path && 
      file.metadata.path !== "") {
      let folder:JSZip | null;
      if (folders.has(file.metadata.path)) {
        folder = folders.get(file.metadata.path);
      } else {
        folder = zip.folder(file.metadata.path);
        folders.set(file.metadata.path, folder);
      }      
      folder?.file(file.metadata.name, file.data);
    } else {
      zip.file(file.metadata.name, file.data);
    }
  }

  return zip;
}

export async function extractFilesAsync(zip: JSZip): Promise<FileData[]> {
  
  const zipFileEntries: JSZipObject[] = [];

  zip.forEach((_, zipEntry) => {
    if (zipEntry.dir === false) {
      zipFileEntries.push(zipEntry);
    }
  });

  const files: FileData[] = [];

  for (let index = 0; index < zipFileEntries.length; index++) {
    const zipEntry = zipFileEntries[index];
    const data = await zipEntry.async("string");

    const fileMetadata = {
      name: extractNameFromPath(zipEntry.name),
      path: extractPathFromPath(zipEntry.name),
      size: data.length,
    };

    files.push(buildFileData(fileMetadata, data));
  }

  return files;
}