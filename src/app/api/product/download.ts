import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { getDownloadFilename } from './lib/getDownloadFilename';
import fs from 'fs';
import { checkAuth } from '@libs/server/auth';
import { decode } from 'jsonwebtoken';
import { TokenPayload } from '@libs/server/utils';

const Download = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { productId, imgAuth } = req.query;
    console.log(req.query, '@@@');
    if (!productId)
      return res.json({
        ok: false,
        message: "doent' have productId"
      });
    // 사진 권한 관리 어떻게할까...
    try {
      const auth = checkAuth(req, res, 0);
      if (!auth || !auth.checkError) {
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
      if (!product || !product.image)
        return res.status(404).json({
          ok: false,
          message: 'no product or image'
        });

      if (!product.auth) {
        /**무료 이미지 */
        const filestream = fs.createReadStream(
          `./public/uploads/${product.image}`
        );
        res.setHeader(
          `Content-Disposition`,
          `attatchment; filename=${getDownloadFilename(req, product.image)}`
        );
        console.log(filestream, 'filestream');
        return filestream.pipe(res);
      } else {
        /**유료 이미지 */
        // const userIdDecoded = (decode(auth.accessToken) as TokenPayload).id;

        // const userIdDecoded = (auth.payload as TokenPayload).id;
        // if (imgAuth === 'true') {
        //   await client.productAuth.create({
        //     data: {
        //       productId: product.id,
        //       userId: userIdDecoded
        //     }
        //   });
        // }
        const filestream = fs.createReadStream(
          `./public/watermark/watermark_${product.image}`
        );
        // console.log(filestream,"filestream")
        res.setHeader(
          `Content-Disposition`,
          `attatchment; filename=watermark_${getDownloadFilename(
            req,
            product.image
          )}`
        );
        return filestream.pipe(res);
        // const imageAuth = await client.productAuth.findFirst({
        //   where: {
        //     userId: userIdDecoded,
        //     productId: product.id
        //   }
        // });
        // if (imageAuth) {
        //   /**워터마크 없는거 */
        //   const filestream = fs.createReadStream(
        //     `./public/uploads/${product.image}`
        //   );
        //   res.setHeader(
        //     `Content-Disposition`,
        //     `attatchment; filename=${getDownloadFilename(req, product.image)}`
        //   );
        //   return filestream.pipe(res);
        // } else {
        //   /**워터마크 있는거 */
        //   const filestream = fs.createReadStream(
        //     `./public/watermark/watermark_${product.image}`
        //   );
        //   res.setHeader(
        //     `Content-Disposition`,
        //     `attatchment; filename=watermark_${getDownloadFilename(
        //       req,
        //       product.image
        //     )}`
        //   );
        //   return filestream.pipe(res);
        // }
      }

      //   res.send(`/uploads/${product.image}`);
    } catch (error) {
      console.error(error, 'product image error');
      return res.status(500).json({
        ok: false,
        error
      });
    }
  }
};
export default Download;
