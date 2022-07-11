import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import client from '@libs/server/client';
import { decode } from 'jsonwebtoken';
import { checkAuth } from '@libs/server/auth';
import axios from 'axios';
import { TokenPayload } from '@libs/server/utils';

export const config = {
  api: {
    bodyParser: false
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req: any, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const filename = basename + new Date().valueOf() + ext;
    req.filename = filename;

    cb(null, filename);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    return cb(new Error('png, jpg만 업로드 가능합니다'));
  }
  cb(null, true);
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});
const app = nextConnect({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.statusCode = 500;
    res.statusMessage = 'Something broke';
  },
  onNoMatch: (req, res) => {
    res.statusCode = 404;
    res.statusMessage = 'Page is not found';
  }
});

app.post(upload.single('file'), async (req, res) => {
  try {
    const auth = checkAuth(req, res, 0);
    console.log(auth, 'auth');

    if (!auth?.re)
      return res.json({
        ok: false,
        message: 'need to login'
      });

    console.log(req.headers['authorization'], 'Header');
    console.log(req.filename, 'filename');
    console.log(req.body, ' body');
    // checkAuth(req, res);
    // const clientAccessToken = req.headers['authorization']?.split(' ')[1];
    const decoded = decode(auth.accessToken!) as TokenPayload;
    if (auth.accessToken!.length > 0) {
      axios.defaults.headers.common[
        'authorization'
      ] = `Bearer ${auth?.accessToken}`;
    }
    let userId;
    console.log(decoded, 'decoded');
    if (decoded.type === -1) {
      const socialUser = await client.socialUser.findUnique({
        where: {
          socialId: decoded.id.toString()
        },
        select: {
          userId: true
        }
      });
      console.log(socialUser, 'social');
      userId = socialUser?.userId;
    } else {
      userId = decoded.id;
    }
    console.log(decoded, '!!!!');
    console.log(userId, ' userId');
    const product = await client.product.create({
      data: {
        image: req.filename,
        title: req.body.title,
        description: req.body.description,
        userId: userId!
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
