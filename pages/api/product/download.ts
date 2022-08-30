import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { getDownloadFilename } from './lib/getDownloadFilename';
import fs from 'fs';
import { checkAuth } from '@libs/server/auth';

const Download = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { productId } = req.query;
    console.log(productId, '@@@');
    // 사진 권한 관리 어떻게할까...
    try {
      const auth = checkAuth(req, res, 0);
      if (!auth || !auth.re) {
        return res.status(401).json({
          ok: false,
          message: 'need to login'
        });
      }
      const product = await client.product.findUnique({
        where: {
          id: +productId.toString()
        }
      });
      if (!product)
        return res.status(401).json({
          ok: false,
          message: 'no have the product'
        });
      if (!product.image)
        return res.status(401).json({
          ok: false,
          message: 'no image'
        });

      const fliestream = fs.createReadStream(
        `./public/uploads/${product.image}`
      );
      res.setHeader(
        `Content-Disposition`,
        `attatchment; filename=${getDownloadFilename(req, product.image)}`
      );
      fliestream.pipe(res);
      //   res.send(`/uploads/${product.image}`);
    } catch (error) {
      console.error(error, ' product image error');
      res.status(500);
    }
  }
};
export default Download;
