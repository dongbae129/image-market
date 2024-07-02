import { HttpResponse, delay, http } from 'msw';
const User = [{ id: 1, userId: 'usernametest' }];
const accessToken = 'user1_access_token_msw';
const refreshToken = 'user1_refresh_token_msw';
type UserType = {
  userId: string;
  password: string;
};
export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const user = await request.json();
    const { userId, password } = user as UserType;
    if (userId === 'usernametest' && password === 'passwordtest') {
      await delay(100);
      return HttpResponse.json(
        {
          ok: true,
          message: 'login success',
          user: User[0].id,
          accessToken
        },
        {
          headers: {
            'Set-Cookie': `refreshToken=${refreshToken};HttpOnlny;Path=/;Secure`
          }
        }
      );
    }
    return HttpResponse.json(
      {
        message: 'login error'
      },
      {
        status: 400
      }
    );
  }),
  http.post('/api/product/upload', () => {
    return HttpResponse.json({
      ok: true
    });
  }),
  http.get('/api/product/5', () => {
    const data = {
      ok: true,
      product: {
        user: {
          email: 'infoTest email',
          name: 'infoTest name'
        },
        title: 'info title',
        hashtag: {
          hashtag: 'a,b,c,d',
          id: 1,
          productId: 1
        },
        id: 1,
        description: 'infoTest descripion',
        auth: false
      }
    };
    return HttpResponse.json({
      ok: true,
      data
    });
  })
];
