import { createAccessToken } from '@libs/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import client from '@libs/server/client';

const FindAccount = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.email) {
      return res.status(404).json({
        ok: false,
        message: 'input email'
      });
    }
    const user = await client.user.findUnique({
      where: {
        email: req.body.email
      }
    });
    if (!user)
      return res.status(400).json({
        ok: false,
        message: 'not exist user'
      });
    const token = createAccessToken(user.id, 1);
    const emailContent = `
        <!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>계정 찾기</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <tr>
            <td align="center" style="padding: 20px;">
                <img src="http://localhost:3000/localimages/emptyuser.png" alt="User Icon" width="48" height="48" style="display: block;">
            </td>
        </tr>
        <tr>
            <td align="center">
                <h1 style="font-size: 24px; color: #333333;">계정찾기</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p style="margin: 0 0 15px; font-size: 16px; color: #666666;">
                    아이디: <strong>${req.body.email}</strong>
                </p>
                <p style="margin: 0 0 20px; font-size: 16px; color: #666666;">
                    비밀번호 변경을 원하시면 아래 링크를 통해 변경하실 수 있습니다.
                </p>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 0 20px 20px;">
                <a href="http://localhost:3000/user/password?key=${token}" style="background-color: #4CAF50; border: none; color: #ffffff; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
                    비밀번호 변경하기
                </a>
            </td>
        </tr>
    </table>
</body>
</html>
      `;

    const transporter = nodemailer.createTransport({
      //   service: 'gmail',
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        // pass: 'bsus ohqu nntf bjqn'

        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      //   from: 'dobaematest@gmail.com',
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: '[IMAGE-MARKET] 문의하신 계정 정보입니다.',
      html: emailContent
    };
    try {
      const mailtest = await transporter.sendMail(
        mailOptions,
        (error, info) => {
          if (error) {
            console.error(error);
          } else {
          }
        }
      );
      console.log(mailtest, 'mailtest');
      return res.json({
        ok: true
      });
    } catch (error) {
      return res.status(500).json({
        ok: false
      });
    }
  }
};
export default FindAccount;
