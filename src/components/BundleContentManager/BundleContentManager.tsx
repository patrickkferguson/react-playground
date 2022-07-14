import FileUpload from "./FileUpload";
import FileDownload from "./FileDownload";
import ContentEditor from "./ContentEditor";
import { useEffect, useState } from "react";
import {
  FileData,
  FileDownloadInfo,
  prepareDownload,
  prepareZipDownload,
  revokeDownloadUrl,
} from "../../utils";
import { usePrevious } from "../../utils/hooks";

export default function BundleContentManager() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [downloadFileName, setDownloadFileName] = useState("");
  const [downloadFile, setDownloadFile] = useState<FileDownloadInfo | null>(
    null
  );
  const [
    downloadZipFile,
    setDownloadZipFile,
  ] = useState<FileDownloadInfo | null>(null);
  const [data, setData] = useState("");

  const previousDownloadFile = usePrevious(downloadFile);
  const previousDownloadZipFile = usePrevious(downloadZipFile);

  useEffect(() => {
    revokeDownloadUrl(previousDownloadFile);
    const file = prepareDownload(data, downloadFileName);
    setDownloadFile(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, downloadFileName]);

  useEffect(() => {
    if (selectedFile !== null) {
      setData(selectedFile.data);
      setDownloadFileName(selectedFile.metadata.name);
    }
  }, [selectedFile]);

  useEffect(() => {
    revokeDownloadUrl(previousDownloadZipFile);
    async function handleFilesChanged() {
      const file = await prepareZipDownload(files);
      setDownloadZipFile(file);
    }
    handleFilesChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <div className="App">
      <div className="toolbar">
        <FileUpload
          files={files}
          onFileSelected={(file) => setSelectedFile(file)}
          onFilesUploaded={setFiles}
        />
        <FileDownload
          downloadFileName={downloadFileName}
          onDownloadFileNameChange={setDownloadFileName}
          downloadFile={downloadFile}
          downloadZipFile={downloadZipFile}
        />
      </div>
      <div className="data">
        <ContentEditor content={data} onChange={setData} />
      </div>
    </div>
  );
}
