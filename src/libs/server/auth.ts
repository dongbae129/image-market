import axios from 'axios';
import { sign, verify, JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';

export const authLinkCheck = () => {
  const urlAccessToken = headers().get('authorization');
  // const urlAccessToken = req.headers['authorization']?.split(' ')[1];
  if (urlAccessToken) {
    try {
      const tokenState = verify(
        urlAccessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      return tokenState;
    } catch (error) {
      console.error(error, 'fail link');
      return 'not verified accesstoken';
    }
  } else {
    return 'no have accesstoken';
  }
};
export interface checkAuthResponse {
  re: boolean;
  ac: boolean | null;
  checkError?: boolean;
  message?: string;
  err?: object;
  userId?: string;
  payload?: {
    id: number;
    type: number;
    iat: number;
    exp: number;
  };
}
interface VerifyType {
  err?: VerifyErrors;
  checkError?: boolean;
  userId?: string;
  // payload?: string | JwtPayload | undefined;
}
type AccessTokenType = {
  userId: string;
};
// |이 코드는 Next.js API 라우트에서 인증을 체크하는 함수인 `checkAuth`를 정의하는 코드입니다.
// |
// |좋은 점:
// |- 코드가 간결하고 읽기 쉽습니다.
// |- 함수의 인자와 반환값이 명확하게 정의되어 있습니다.
// |- `console.log`를 이용하여 디버깅을 수행하고 있습니다.
// |
// |나쁜 점:
// |- `verify` 함수는 비동기 함수이지만, `verifyed` 변수에 값을 할당하는 부분이 동기적으로 작성되어 있습니다. 따라서 `verifyed` 변수에는 항상 빈 객체가 할당됩니다. 이 문제를 해결하기 위해서는 `verify` 함수를 Promise를 반환하도록 수정하거나, `verify` 함수의 콜백 함수 내부에서 반환값을 처리해야 합니다.
// |- `checkAuth` 함수가 반환하는 값의 타입인 `checkAuthResponse`가 정의되어 있지 않습니다. 이를 해결하기 위해서는 `checkAuthResponse`의 타입을 정의해야 합니다.
export const checkAuth = (): VerifyType => {
  const cookie = cookies();
  const cookieAccessToken = cookie.get('accessToken')?.value;
  const headerList = headers();
  const clientAccessToken = headerList.get('authorization')?.split(' ')[1];
  console.log(clientAccessToken, 'clientAccessToken');
  console.log(cookieAccessToken, 'authAccessToken');
  const accessToken = clientAccessToken || cookieAccessToken;
  const state = {
    re: false,
    ac: false
  };
  if (!accessToken) {
    return {
      ...state,
      checkError: true,
      message: 'no have authorization header'
    };
  }
  let verifyed: VerifyType = {};
  try {
    const decoded = verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    ) as AccessTokenType;
    console.log(decoded, 'checkauth decoded');
    const { userId } = decoded;
    verifyed = {
      ...state,
      userId,
      checkError: false
    };
    return verifyed;
  } catch (error) {
    console.error(error, 'auth error');
    verifyed = {
      checkError: true
    };
    return verifyed;
  }
  // verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
  //   if (err) {
  //     // console.log(err, 'testerr');
  //     verifyed = {
  //       err,
  //       checkError: true
  //     };
  //     return;
  //   }
  //   // console.log(payload, 'testpayload');
  //   verifyed = {
  //     ...state,
  //     payload,
  //     checkError: false
  //   };
  //   return;
  // });
  // // console.log(verifyed, 'verifyed');

  // return {
  //   ...state,
  //   ...verifyed
  // };
};
export const refreshToken = () => {
  return axios
    .post(
      '/api/refresh',
      {},
      {
        withCredentials: true
      }
    )
    .then((res) => res.data);
};
export const createAccessToken = (userId: string, type: number) => {
  return sign({ userId, type }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '2m'
  });
};

export const createRefreshToken = (id: number, type: number) =>
  sign({ id, type }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '20m' });

export const sendAccesToken = (token: string) => {
  cookies().set('accesToken', token, {
    // httpOnly: true,
    // maxAge: 60 * 10
    maxAge: 60 * 10 * 10
    // secure: true
  });
};
export const sendRefreshToken = (token: string) => {
  cookies().set('refreshToken', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    secure: true
  });
  // res.setHeader(
  //   'Set-Cookie',
  //   cookie.serialize('refreshToken', token, {
  //     httpOnly: true,
  //     maxAge: 60 * 60 * 24 * 7,
  //     path: '/',
  //     secure: true
  //   })
  // );
};
