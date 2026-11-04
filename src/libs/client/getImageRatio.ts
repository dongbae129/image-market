/** Return an image's width-to-height ratio as a two-decimal string. */
export function getImageRatio(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (!image.naturalWidth || !image.naturalHeight) {
        reject(new Error('이미지 크기를 확인할 수 없습니다.'));
        return;
      }
      resolve((image.naturalWidth / image.naturalHeight).toFixed(2));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('이미지 비율을 계산할 수 없습니다.'));
    };

    image.src = objectUrl;
  });
}
