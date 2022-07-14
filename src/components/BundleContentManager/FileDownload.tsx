import { FileDownloadInfo } from "../../utils";

interface FileDownloadProps {
  downloadFileName: string,
  onDownloadFileNameChange: (newValue: string) => void,
  downloadFile: FileDownloadInfo | null,
  downloadZipFile: FileDownloadInfo | null
}

export default function FileDownload({
  downloadFileName, 
  onDownloadFileNameChange,
  downloadFile,
  downloadZipFile
}: FileDownloadProps) {
  return (
    <div className="download">
      Download file name: 
      <input 
        className="downloadFileName"
        value={downloadFileName}
        onChange={e => onDownloadFileNameChange(e.target.value) } />
      <div className="downloadLinks">
        <a 
          className={ downloadFile && downloadFile.url !== "" ? "downloadLink" : "downloadLink disabled" }
          href={downloadFile ? downloadFile.url : ""}
          download={downloadFile ? downloadFile.fileName : ""}
          >
            Download
        </a>
        <a 
          className={ downloadZipFile && downloadZipFile.url !== "" ? "downloadLink" : "downloadLink disabled" }
          href={downloadZipFile ? downloadZipFile.url : ""}
          download={downloadZipFile ? downloadZipFile.fileName : ""}
          >
            Download all
        </a>
      </div>
    </div>
  );
}