import { nc, TokenPayload, isLogedIn, upLoader } from '@libs/server/utils';
import client from '@libs/server/client';
import { decode } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const config = {
  api: {
    bodyParser: false
  }
};
const userDetail = nc;

userDetail.get(async (req, res) => {
  const { userId } = req.query;
  if (!userId)
    return res.status(401).json({
      ok: false,
      message: 'does not exit the user'
    });
  const user = await client.user.findUnique({
    where: {
      id: +userId.toString()
    }
  });
  if (!user)
    return res.json({
      ok: false,
      message: 'not user'
    });
  const products = await client.product.findMany({
    where: {
      userId: user.id
    },
    include: {
      hashtag: {
        select: {
          hashtag: true
        }
      },
      productHit: {
        select: {
          hit: true
        }
      }
    },

    orderBy: {
      productHit: {
        hit: 'desc'
      }
    },
    take: 10
  });
  return res.json({
    ok: true,
    user,
    products
  });
});

userDetail.post(isLogedIn, upLoader, async (req, res) => {
  const { email, name, password } = req.body;
  const { userId } = req.query;
  console.log(req.body, 'userbody');
  console.log(req.auth, 'auth');

  console.log(req.file, 'fileee');

  // const mulup = upload.single('file');
  // await mulup(req, res, (err) => {
  //   if (err) {
  //     console.error(err, 'multerError if');
  //     return res.status(400).json({
  //       ok: false
  //     });
  //     // req.file.error = true;
  //   } else {
  //     return res.status(400).json({
  //       ok: false,
  //       message: '??'
  //     });
  //     // req.file.error = true;
  //   }
  //   console.log(req.body, 'body');
  //   req.body = req.body;
  // });

  try {
    const auth = req.auth;

    const decoded = (auth.payload as TokenPayload).id;

    const localUser = await client.user.findUnique({
      where: {
        id: decoded
      }
    });
    if (!localUser)
      return res.json({
        ok: false,
        message: 'invalid user or not exist'
      });
    // if (password) {
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   await client.localUser.update({
    //     where: {
    //       userId: decoded.id
    //     },
    //     data: {
    //       password: hashedPassword
    //     }
    //   });
    // }

    const user = await client.user.update({
      where: {
        id: localUser.id
      },
      data: {
        image: req.file?.filename || localUser.image,
        email: email || localUser.email,
        name: name || localUser.name
      }
    });

    return res.json({
      ok: true,
      user
    });
  } catch (error) {
    console.error(error, 'failed update user');
  }
});

userDetail.delete(isLogedIn, async (req, res) => {
  try {
    const auth = req.auth;
    const decoded = (auth.payload as TokenPayload).id;
    const User = await client.user.findUnique({
      where: {
        id: decoded
      }
    });
    if (!User)
      return res.json({
        ok: false,
        message: 'not user'
      });
    if (User.delete)
      return res.json({
        ok: false,
        message: 'already deleted user'
      });
    const deletedUser = await client.user.update({
      where: {
        id: decoded
      },
      data: {
        delete: true
      }
    });

    return res.json({
      ok: true,
      deletedUser
    });
  } catch (error) {
    return res.json({
      message: 'delete test fail'
    });
  }
});
export default userDetail;
