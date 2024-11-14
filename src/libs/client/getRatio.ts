import { Dispatch, SetStateAction } from 'react';

export const getRatio = (
  imageWatch: FileList,
  setImagePreview: Dispatch<SetStateAction<string>>
) => {
  if (imageWatch && imageWatch.length > 0) {
    const file = imageWatch[0];
    let ratio = '1';

    if (file) {
      const ratioImage = new Image();
      ratioImage.src = URL.createObjectURL(file);
      setImagePreview(URL.createObjectURL(file));
      return new Promise<string>((resolve) => {
        ratioImage.onload = () => {
          ratio = (ratioImage.width / ratioImage.height).toFixed(2);

          resolve(ratio);
        };
      });
    }
  }
};
