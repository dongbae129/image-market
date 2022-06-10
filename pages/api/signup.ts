import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import bcrypt from 'bcrypt';
const Signup = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'POST') {
    const { name, userId, password, email } = req.body;
    if (userId === '' || password === '') {
      res.json({
        ok: false,
        message: 'input the signup-information'
      });
    }
    const userExist = await client.localUser.findFirst({
      where: {
        memId: userId,
        email
      }
    });
    if (userExist) {
      return res.status(409).json({
        ok: false,
        error: 'existe duplicated userId or email'
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await client.user.create({
        data: {
          name: name ? name : 'Annoymous',
          email,
          emailActive: false
        }
      });
      await client.localUser.create({
        data: {
          memId: userId,
          password: hashedPassword,
          userId: user.id,
          email
        }
      });

      res.json({
        ok: true,
        message: 'signup success',
        user
      });
    }
  }
};

export default Signup;
