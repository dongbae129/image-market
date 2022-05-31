import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import nextAuth, { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import client from '@libs/server/client';
const prisma = new PrismaClient();
export default nextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        console.log(credentials, 'Credential');
        console.log(req, 'REQ');

        const user = { id: 1, name: 'aa', email: 'jsmith@example.com' };
        return user;
        // if (user) {
        //   // Any object returned will be saved in `user` property of the JWT
        //   return user;
        // } else {
        //   // If you return null then an error will be displayed advising the user to check their details.
        //   return null;

        //   // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        // }
      }
    })
  ],
  secret: process.env.ACCESS_TOKEN_SECRET,
  adapter: PrismaAdapter(prisma),
  // session: {
  //   strategy: 'jwt',
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  //   updateAge: 24 * 60 * 60 // 24 hours
  // },

  // jwt: {
  //   maxAge: 60 * 60 * 24 * 30
  //   // You can define your own encode/decode functions for signing and encryption
  // },

  callbacks: {
    redirect: async (params: { url: string; baseUrl: string }) => {
      return Promise.resolve(params.baseUrl);
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        // token.role = user.role;
        console.log(token, user, account, profile, 'JWT');
      }

      return token;
    },
    async session({ session, token, user }) {
      console.log(session, token, user, 'SESSION');
      // session.role = token.role;
      return session;
    }
  }
});
