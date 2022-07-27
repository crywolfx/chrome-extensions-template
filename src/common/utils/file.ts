export function dataURLToFile(dataurl: string, filename = 'image.png') {
  //将base64转换为文件
  const arr = dataurl.split(',');
  const mime = arr?.[0]?.match?.(/:(.*?);/)?.[1];
  const bstr = atob(arr?.[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
