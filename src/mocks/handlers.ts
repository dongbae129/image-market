import { HttpResponse, delay, http } from 'msw';
const User = [{ id: 1, userId: 'usernametest' }];
const accessToken = 'user1_access_token_msw';
const refreshToken = 'user1_refresh_token_msw';
type UserType = {
  userId: string;
  password: string;
};
export const users = [
  {
    id: 1,
    nickname: '철수',
    profileImage: '/profile1.jpg'
  },
  {
    id: 2,
    nickname: '영희',
    profileImage: '/profile2.jpg'
  }
];

const comments = [];

for (let i = 1; i <= 10; i++) {
  comments.push({
    id: i,
    likesCount: i,
    userId: `${(i % 2) + 1}`,
    userImage: null,
    productId: 4,
    content: `댓글 ${i}`,
    createdAt: new Date(Date.now() - i * 1000)
  });
}

export const commentDB = {
  findMany({
    productId,
    take,
    cursor
  }: {
    productId: number;
    take: number;
    cursor?: number;
  }) {
    let result = comments
      .filter((c) => c.productId === productId)
      .sort((a, b) => b.id - a.id);

    if (cursor) {
      const index = result.findIndex((c) => c.id === cursor);

      if (index !== -1) {
        result = result.slice(index + 1);
      }
    }

    return result.slice(0, take);
  }
};
export const handlers = [
  http.get('/api/chat/product/:productId', ({ params, request }) => {
    const url = new URL(request.url);

    const productId = Number(params.productId);

    const lastId = Number(url.searchParams.get('id') ?? 0);
    console.log(productId, lastId, 'msw lastId');
    const comments = commentDB.findMany({
      productId: 4,
      take: 3,
      cursor: lastId || undefined
    });
    console.log(comments, 'msw comments');
    return HttpResponse.json({
      comments
    });
  })
  // http.get('/api/product', () => {
  //   return HttpResponse.json({
  //     ok: true,
  //     data: []
  //   });
  // })
  // http.post('/api/login', async ({ request }) => {
  //   const user = await request.json();
  //   const { userId, password } = user as UserType;
  //   if (userId === 'usernametest' && password === 'passwordtest') {
  //     await delay(100);
  //     return HttpResponse.json(
  //       {
  //         ok: true,
  //         message: 'login success',
  //         user: User[0].id,
  //         accessToken
  //       },
  //       {
  //         headers: {
  //           'Set-Cookie': `refreshToken=${refreshToken};HttpOnlny;Path=/;Secure`
  //         }
  //       }
  //     );
  //   }
  //   return HttpResponse.json(
  //     {
  //       message: 'login error'
  //     },
  //     {
  //       status: 400
  //     }
  //   );
  // }),
  // http.get('/api/user', async () => {
  //   return HttpResponse.json({
  //     data: {
  //       ok: true,
  //       user: {
  //         id: 1,
  //         name: 'usercard name test',
  //         email: 'usercard email test',
  //         coin: 10000,
  //         bonusCoupon: 3
  //       }
  //     }
  //   });
  // }),
  // http.post('/api/product/upload', () => {
  //   return HttpResponse.json({
  //     ok: true
  //   });
  // }),
  // http.get('/api/product/5', () => {
  //   const data = {
  //     ok: true,
  //     product: {
  //       user: {
  //         email: 'infoTest email',
  //         name: 'infoTest name'
  //       },
  //       title: 'info title',
  //       hashtag: {
  //         hashtag: 'a,b,c,d',
  //         id: 1,
  //         productId: 1
  //       },
  //       id: 1,
  //       description: 'infoTest descripion',
  //       auth: false
  //     }
  //   };
  //   return HttpResponse.json({
  //     ok: true,
  //     data
  //   });
  // })
];
