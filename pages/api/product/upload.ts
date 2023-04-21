import client from '@libs/server/client';

import {
  isLogedIn,
  nc,
  TokenPayload,
  dbNow,
  upLoader
} from '@libs/server/utils';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false
  }
};

const app = nc;
app.post(isLogedIn, upLoader, async (req, res) => {
  console.log(req.body, 'Body!!');
  console.log(req.file, 'file!!');
  return res.send('EEE');
  const { productBoolean: productAuth } = JSON.parse(req.body.productAuth);
  const { imgBoolean } = JSON.parse(req.body.imageOk);

  try {
    const auth = req.auth;

    const userId = (auth?.payload as TokenPayload).id;

    let imgname: string;
    if (!req.file?.filename && imgBoolean)
      return res.status(401).json({
        ok: false,
        message: 'faile to upload image file'
      });
    if (productAuth) {
      const watermark = await sharp(
        `./public/localimages/spring_remove.png`
      ).toBuffer();

      type SharpWithOptions = sharp.Sharp & {
        options: {
          fileOut: string;
        };
      };
      const image = await (<SharpWithOptions>sharp(
        // encodeURIComponent(req.file?.path)
        req.file?.path
      )
        .composite([
          {
            input: watermark,
            gravity: 'center',
            tile: true
          }
        ])
        .toFile(
          `./public/watermark/watermark_${req.file?.filename}`,
          (err, info) => {
            if (err) console.error(err, 'water Error');
            // console.log(info, 'Info');
          }
        ));

      imgname = image.options.fileOut.replace(
        './public/watermark/watermark_',
        ''
      );
    } else {
      if (!req.file?.filename)
        return res.status(401).json({
          ok: false,
          message: 'faile to upload image file'
        });
      imgname = req.file.filename;
    }

    // const imgname: string = image.options.fileOut.slice(21);
    console.log(imgname, 'name');

    const now = dbNow();
    const product = await client.product.create({
      data: {
        image: imgname,
        title: req.body.title,
        description: req.body.description,
        userId: userId,
        auth: productAuth,
        ratio: req.body.ratio,
        createdAt: now,
        updatedAt: now
      }
    });
    await client.productHit.create({
      data: {
        hit: 0,
        productId: product.id
      }
    });
    await client.hashTag.create({
      data: {
        hashtag: req.body.hashtag,
        productId: product.id
      }
    });
    return res.json({
      ok: true,
      message: 'create product success',
      product
      // product
    });
  } catch (error) {
    console.log(error, 'create product error');
  }
});

export default app;
