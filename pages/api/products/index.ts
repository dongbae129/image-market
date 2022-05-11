import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '@libs/server/auth';
const Product = checkAuth(
  async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    console.log('testtt');
    // return res.json({
    //   ok: true,
    //   message: 'testtt'
    // });
  }
);

export default Product;
