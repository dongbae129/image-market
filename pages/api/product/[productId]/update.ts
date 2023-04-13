import client from '@libs/server/client';

import { isLogedIn, nc, dbNow, upLoader, imgDelete } from '@libs/server/utils';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false
  }
};

const productUpdate = nc;
productUpdate.post(isLogedIn, upLoader, async (req, res) => {
  console.log(req.body, 'Body!!');
  console.log(req.file, 'file!!');
  // return res.send('EEE');

  try {
    // const auth = req.auth;
    const { productBoolean: productAuth } = JSON.parse(req.body.productAuth);
    const { imgBoolean } = JSON.parse(req.body.imageOk);
    console.log(productAuth, imgBoolean);
    const { productId } = req.query;
    const { title, hashtag, description } = req.body;
    console.log(typeof productId, 'SDF');
    console.log(req.file?.filename, 'fuiff');
    // return res.send('test');
    if (!productId || !title || !hashtag || !description)
      return res.status(404).json({
        ok: false,
        message: "doesn't the product, not productId"
      });
    // const auth = checkAuth(req, res, 0);
    const findProduct = await client.product.findUnique({
      where: {
        id: +productId.toString()
      }
    });
    if (!findProduct)
      return res.status(404).json({
        ok: false,
        message: "doesn't the product, not productId"
      });

    // const userId = (auth?.payload as TokenPayload).id;
    let imgname;
    // imgDelete(findProduct.image);

    if (imgBoolean) {
      if (!req.file?.filename)
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
            (err, _) => {
              if (err) {
                console.error(err, 'water Error');
                return res.status(500).json({
                  ok: false,
                  message: 'fail to make watermark image'
                });
              }

              // console.log(info, 'Info');
            }
          ));

        imgname = image.options.fileOut.replace(
          './public/watermark/watermark_',
          ''
        );
      } else {
        imgname = req.file?.filename;
      }
    } else {
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
          `public\\uploads\\${findProduct.image}`
        )
          .composite([
            {
              input: watermark,
              gravity: 'center',
              tile: true
            }
          ])
          .toFile(
            `./public/watermark/watermark_${findProduct.image}`,
            (err, _) => {
              if (err) {
                console.error(err, 'water Error');
                return res.status(500).json({
                  ok: false,
                  message: 'fail to make watermark image'
                });
              }

              // console.log(info, 'Info');
            }
          ));
        imgname = image.options.fileOut.replace(
          './public/watermark/watermark_',
          ''
        );
      }
    }
    const now = dbNow();
    const updatedProduct = await client.product.update({
      where: {
        id: findProduct.id
      },
      data: {
        image: imgname ? imgname : findProduct.image,
        auth: productAuth,
        title,
        description,
        updatedAt: now
      }
    });

    const hashTag = await client.hashTag.findFirst({
      where: {
        productId: findProduct.id
      }
    });
    if (!hashTag)
      return res.status(404).json({
        ok: false,
        message: 'faile to update hashtag'
      });
    if (hashTag.hashtag !== hashtag) {
      await client.hashTag.update({
        where: {
          productId: findProduct.id
        },
        data: {
          hashtag
        }
      });
    }
    return res.json({
      ok: true,
      product: updatedProduct
    });

    // const imgname: string = image.options.fileOut.slice(21);
    console.log(imgname, 'name');
  } catch (error) {
    console.log(error, 'create product error');
    return res.status(500).json({
      ok: false,
      error
    });
  }
});

export default productUpdate;
