import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import bcrypt from 'bcrypt';
const Signup = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'POST') {
    const { name, userId, password } = req.body;
    if (userId === '' || password === '') {
      res.json({
        ok: false,
        message: 'input the signup-information'
      });
    }
    const userExist = await client.user.findUnique({
      where: {
        email: userId
      }
    });
    if (userExist) {
      return res.json({
        ok: false,
        error: 'existe duplicated userId'
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await client.user.create({
        data: {
          name: name ? name : 'Annoymous',
          email: userId,
          password: hashedPassword
        }
      });
      res.json({
        ok: true,
        message: 'signup success'
      });
    }
  }
};

export default Signup;
