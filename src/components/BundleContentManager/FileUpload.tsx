import { sortBy } from 'lodash';
import { readFiles, prettifyFileSize, FileData } from "../../utils";

interface FileUploadProps {
  files: FileData[],
  onFilesUploaded: (files: FileData[]) => void,
  onFileSelected: (file: FileData) => void,
}

export default function FileUpload(props: FileUploadProps) {

  const openFiles = async (uploadedFiles: FileList | null) => {
    var fileData = await readFiles(uploadedFiles);
    props.onFilesUploaded(fileData)
  };

  const files = sortBy(props.files, file => file.metadata.path, file => file.metadata.name);

  const fileLinks = files.map(file => {
    return (
      <button 
        key={file.metadata.name}
        className="fileLink" 
        onClick={_ => props.onFileSelected(file)}>
          {file.metadata.path ? `${file.metadata.path}/` : ""}{file.metadata.name} ({file.metadata.type} {prettifyFileSize(file.metadata.size)})
      </button>
    );
  });

  return (
    <div className="upload">
      <div>
        Choose files to upload: 
        <input 
          type="file" 
          multiple={true}
          accept=".json,.yaml,.yml,.zip,application/json,text/plain"
          onChange={e => openFiles(e.target.files) }/>
      </div>
      <div className="fileLinks">
        {fileLinks}
      </div>
    </div>
  );
}