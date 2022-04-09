export const convertImageBufferToBase64Url = (buffer: Buffer): string => {
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
};
