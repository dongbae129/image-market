import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
const userPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { key, password, passwordCheck } = req.body;
      if (!key)
        return res.status(406).json({
          ok: false,
          message: 'no key'
        });
      if (password !== passwordCheck)
        return res.status(406).json({
          ok: false,
          message: 'password error'
        });
      const keyCheck = verify(key, process.env.ACCESS_TOKEN_SECRET);
      const { id } = keyCheck as { id: number };
      const findUser = await client?.user.findUnique({
        where: {
          id
        }
      });
      if (!findUser)
        return res.status(404).json({
          ok: false,
          message: 'not exist the user'
        });
      const hashedPassword = await bcrypt.hash(password, 10);
      await client?.localUser.update({
        where: {
          userId: findUser.id
        },
        data: {
          password: hashedPassword
        }
      });
      console.log(keyCheck, 'keyCheck');
      return res.json({
        ok: true,
        message: 'success update password'
      });
    } catch (error) {
      console.log(error, 'fail update password');
      return res.status(500).json({
        ok: false,
        message: 'error'
      });
    }
  }
};
export default userPassword;
