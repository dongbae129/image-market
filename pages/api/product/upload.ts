import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import client from '@libs/server/client';
import { decode } from 'jsonwebtoken';
import { checkAuth } from '@libs/server/auth';
import axios from 'axios';
import { isLogedIn, nc, TokenPayload, upload } from '@libs/server/utils';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false
  }
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads');
//   },
//   filename: function (req: any, file, cb) {
//     const ext = path.extname(file.originalname);
//     const basename = path.basename(file.originalname, ext);
//     const filename = basename + new Date().valueOf() + ext;
//     req.filename = filename;

//     cb(null, filename);
//   }
// });

// const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
//   const ext = path.extname(file.originalname);
//   if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
//     return cb(new Error('png, jpg만 업로드 가능합니다'));
//   }
//   cb(null, true);
// };
// export const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 20 * 1024 * 1024
//   }
// });
// export const nc = nextConnect({
//   onError: (err, req, res) => {
//     console.error(err.stack);
//     res.statusCode = 500;
//     res.statusMessage = 'Something broke';
//   },
//   onNoMatch: (req, res) => {
//     res.statusCode = 404;
//     res.statusMessage = 'Page is not found';
//   }
// });
// const app = nc;
const app = nc;
app.post(isLogedIn, upload.single('file'), async (req, res) => {
  console.log(req.body, 'body');
  console.log(req.body.email, 'email');
  console.log(req.url, 'url');
  console.log(req.file, 'file');
  console.log(JSON.parse(req.body.productAuth).productBool, 'bb');

  try {
    const auth = checkAuth(req, res, 0);
    console.log(auth, 'auth');

    if (!auth?.re)
      return res.json({
        ok: false,
        message: 'need to login'
      });

    console.log(req.headers['authorization'], 'Header');
    console.log(req.file, 'file');
    console.log(req.file?.filename, 'filename');
    console.log(req.body, ' body');

    const productAuth = JSON.parse(req.body.productAuth).productBool;
    // checkAuth(req, res);
    // const clientAccessToken = req.headers['authorization']?.split(' ')[1];
    const decoded = decode(auth.accessToken!) as TokenPayload;
    if (auth.accessToken!.length > 0) {
      axios.defaults.headers.common[
        'authorization'
      ] = `Bearer ${auth?.accessToken}`;
    }
    const userId = decoded.id;

    const watermark = await sharp(
      './public/localimages/spring_remove.png'
    ).toBuffer();

    type SharpWithOptions = sharp.Sharp & {
      options: {
        fileOut: string;
      };
    };
    const image = await (<SharpWithOptions>sharp(req.file?.path)
      .composite([
        {
          input: watermark,
          gravity: 'center',
          tile: true
        }
      ])
      .toFile(
        `./public/localimages/watermark_${req.file?.filename}`,
        (err, info) => {
          if (err) console.error(err, 'water Error');
          console.log(info, 'Info');
        }
      ));

    const imgname: string = image.options.fileOut.slice(21);
    console.log(imgname, 'name');

    const product = await client.product.create({
      data: {
        image: imgname,
        title: req.body.title,
        description: req.body.description,
        userId: userId!,
        auth: productAuth
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
