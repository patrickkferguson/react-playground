export function readFileAsync(file: File): Promise<string> {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {

    fileReader.onerror = () => {
      fileReader.abort();
      reject(fileReader.error);
    };

    fileReader.onload = () => {

      const result = fileReader.result;

      let fileData: string;

      if (result instanceof ArrayBuffer) {
        var decoder = new TextDecoder("utf-8");
        fileData = decoder.decode(result);
      } else {
        fileData = fileReader.result as string || "";
      }

      resolve(fileData);
    };

    fileReader.readAsText(file);
  });
}