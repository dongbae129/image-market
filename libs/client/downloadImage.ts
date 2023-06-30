import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';

export const extractFilenameFromContentDisposition = (
  contentDisposition: string
) => {
  const filenameRegex = /filename=[\w.-]+/;
  const matches = contentDisposition.match(filenameRegex);

  let filename = '';
  if (matches) {
    filename = matches[0].split('=')[1];
  }

  return filename;
};

type DownloadImageProps = {
  productId: string;
  setState?: Dispatch<SetStateAction<boolean>>;
};

export const downloadImage = async ({
  productId,
  setState
}: DownloadImageProps) => {
  const response = await axios(
    `/api/product/download?productId=${productId}&imgAuth=${true}`,
    {
      responseType: 'blob'
    }
  );

  const contentDisposition = response.headers['content-disposition'];

  const fileName = extractFilenameFromContentDisposition(contentDisposition);

  const url = URL.createObjectURL(response.data);

  const link = document.createElement('a');
  // const fileName = prompt('enter the file name');
  link.href = url;
  link.download = fileName;

  link.click();

  URL.revokeObjectURL(url);
  if (setState) {
    setState((prev) => !prev);
  }
  // setModalOpen((prev) => !prev);
};
