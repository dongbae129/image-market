import { JwtPayload } from 'jsonwebtoken';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import path from 'path';
import { checkAuth } from '@libs/server/auth';
import dayjs from 'dayjs';
export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}
export interface TokenPayload extends JwtPayload {
  id: number;
  type: number;
}
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req: any, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8'
    );

    // const encodedName = encodeURIComponent(file.originalname);
    const encodedName = file.originalname;
    const ext = path.extname(encodedName);
    const basename = path.basename(encodedName, ext);
    const filename = basename + new Date().valueOf() + ext;
    req.filename = filename;

    cb(null, filename);
  }
});

export const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    return cb(new Error('png, jpg만 업로드 가능합니다'));
  }
  cb(null, true);
};
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});
export const nc = nextConnect({
  onError: (err, req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    console.error(err.stack);
    res.statusCode = 500;
    res.statusMessage = 'Something broke';
  },
  onNoMatch: (req, res) => {
    res.statusCode = 404;
    res.statusMessage = 'Page is not found';
  }
});
export const isLogedIn = (req: NextApiRequest, res: any, next: () => void) => {
  const auth = checkAuth(req, res, 0);

  if (!auth?.re) {
    res.status(401).json({
      ok: false,
      message: 'login middleware test false'
    });
  } else next();
};

export const dbNow = (): Date => dayjs().add(9, 'hour').toDate();

export const timeForToday = (value: any) => {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return '방금전';
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`;
};
