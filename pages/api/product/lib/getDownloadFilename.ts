import iconvLite from 'iconv-lite';
import { NextApiRequest } from 'next';

export const getDownloadFilename = (req: NextApiRequest, filename: string) => {
  const header = req.headers['user-agent'] as unknown as string;
  if (header.includes('MSIE') || header.includes('Trident')) {
    return encodeURIComponent(filename).replace(/\\+/gi, '%20');
  } else if (header.includes('Chrome')) {
    return iconvLite.decode(iconvLite.encode(filename, 'UTF-8'), 'ISO-8859-1');
  } else if (header.includes('Opera')) {
    return iconvLite.decode(iconvLite.encode(filename, 'UTF-8'), 'ISO-8859-1');
  } else if (header.includes('Firefox')) {
    return iconvLite.decode(iconvLite.encode(filename, 'UTF-8'), 'ISO-8859-1');
  }
  return filename;
};
