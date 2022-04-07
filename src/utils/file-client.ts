export async function getImageUrlFromFile(
  file: File
): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = () => reject("Error occurred reading file");
  });
}
