import { HttpResponse, http } from 'msw';
const User = [{ id: 1, userId: 'usernametest' }];
const accessToken = 'user1_access_token_msw';
const refreshToken = 'user1_refresh_token_msw';
export const handlers = [
  http.post('/api/login', () => {
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
    // return HttpResponse.json(
    //   {
    //     message: 'login error'
    //   },
    //   {
    //     status: 400
    //   }
    // );
  })
];
