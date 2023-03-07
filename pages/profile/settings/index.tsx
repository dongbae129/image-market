import type { NextPage } from 'next';
import { useQuery, useMutation } from 'react-query';
import { getFetch } from '@libs/client/fetcher';
import { userResponse } from '@components/headmenu';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@components/input';
import Image from 'next/image';
import Button from '@components/button';
import axios from 'axios';
import NextImage from 'next/image';
import Link from 'next/link';

interface SettingForm {
  name: string;
  email: string;
  password: string;
  image: FileList;
  passwordCheck: string;

  [key: string]: any;
}
const SettingHome: NextPage = () => {
  const [imagePreview, setImagePreview] = useState('');
  const { data } = useQuery<userResponse>(['userInfo'], getFetch('/api/user'), {
    // staleTime: 1000 * 60
  });
  const { watch, register, handleSubmit } = useForm<SettingForm>();
  const imageWatch = watch('image');
  const setUser = (formData: FormData) =>
    axios.post(`/api/user/${data?.user.id}`, formData).then((res) => res.data);
  const { mutate, isLoading } = useMutation(setUser);

  const onValid = (formData: SettingForm) => {
    console.log(formData, 'formData');
    if (isLoading) return;
    const newForm = new FormData();
    // if (formData.password !== formData.passwordCheck) {
    //   alert('비밀번호 확인해주세요');
    //   return;
    // }
    for (const key in formData) {
      key === 'image'
        ? newForm.append('file', formData[key][0])
        : newForm.append(key, formData[key]);
    }
    mutate(newForm);
  };
  useEffect(() => {
    if (imageWatch && imageWatch.length > 0) {
      const file = imageWatch[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imageWatch]);
  if (!data?.ok) return <div>로그인 해주세요</div>;

  const SvgComponent = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      height={30}
      viewBox="0 0 128 128"
      fill="rgb(25,103,210)"
      {...props}
    >
      <path d="M41.2 1.9C26.1 7.5 16.4 20.7 15.3 37.1c-.6 7.8-.6 7.9-3.4 7.9-1.8 0-3.5.9-4.9 2.7-1.8 2.4-2 3.8-1.8 12.7.3 10 .3 10.1 2.8 10.1s2.5-.2 3-9.5l.5-9.5 42.9-.3c33.7-.2 43.1 0 43.8 1 .4.7.8 7.2.8 14.5v13.1l-8.5 4.7c-4.7 2.5-9 5.5-9.5 6.6-1.4 2.4-.4 9.6 2.1 16.4 1.1 2.7 1.9 5.1 1.9 5.3 0 .1-16.5.1-36.7 0l-36.8-.3-.3-11.7c-.3-12.1-1.1-14.5-4.6-13.2-1.6.6-1.7 2.2-1.4 14.1.3 12.8.4 13.6 2.7 15.4 2.2 1.8 4.4 1.9 41.8 1.9h39.4l2.6 3c3 3.7 7.3 6 10.8 6 4.1 0 11.9-8.1 16.1-16.6 3.7-7.4 5.6-18.4 3.6-21.1-.4-.7-4.4-3.2-8.8-5.6l-7.9-4.2-.5-15c-.6-17.7-1.7-20.5-7.9-20.5-1.4 0-1.9-1.6-2.8-9C92.4 20.8 84.2 9.3 71.2 3.2c-7.7-3.6-22-4.2-30-1.3zm25 5.7c8.9 3.5 17.3 11.9 20.3 20.4.8 2.3 1.8 7 2.1 10.6l.7 6.4h-3c-3 0-3-.1-3.7-6.6-.9-8.4-2.4-12.1-7.3-17.4-5.4-6.1-12.1-9-20.9-9-15.3 0-26 10.3-27.2 26.2-.5 6.8-.5 6.8-3.5 6.8h-3l.5-6.8c.3-4.4 1.4-8.9 3-12.4C26.9 20 33.6 11.7 35 12.5c.4.3 1-.1 1.3-.9.3-.8 3-2.3 5.9-3.5 6.7-2.5 18-2.8 24-.5zm.9 13.9c5.3 3.7 8.8 10.3 9.6 17.8l.6 5.7H33v-4.1c0-8.9 4.5-17 11.8-20.9 2.9-1.6 5.2-2 10.9-1.7 6.1.2 7.8.7 11.4 3.2zm42.7 68.2 7.4 3.8-.6 4.7c-.2 2.5-1.8 7.3-3.4 10.5-2.8 5.5-9.3 13.3-11.1 13.3-1.6 0-6.2-4.2-8.9-8.3-3.1-4.4-5.7-11.1-6.6-16.4-.5-3.2-.3-3.4 6.7-7.3 4-2.2 7.6-4 8.1-4 .6 0 4.3 1.7 8.4 3.7z" />
      <path d="M31.4 59.9c-1.1.5-3.3 2.3-4.7 4.1-3.4 4-3.8 11.4-.7 15.2l1.9 2.5-2.8 2.1c-3.4 2.5-7.1 9.7-7.1 13.8 0 1.9.9 3.9 2.3 5.2 2.2 2.1 3.3 2.2 16.9 2.2h14.7l2.1-2.7c1.7-2.2 2-3.6 1.5-6.8-.7-4.7-3.7-9.7-7-11.9L46 81.9l2.1-2.9c1.8-2.3 2.1-3.8 1.7-8-.7-7.2-4.6-11.1-11.5-11.6-2.6-.2-5.7 0-6.9.5zm10.3 7.3C46.3 71.5 43.3 79 37 79c-6.1 0-9.3-7.7-5-12 2.6-2.6 6.8-2.5 9.7.2zm2.7 21.1c2.6 1.8 5.6 7 5.6 9.7 0 .6-4.7 1-13 1s-13-.4-13-1c0-2.7 3-7.9 5.6-9.7 5.1-3.7 9.5-3.7 14.8 0zM59.2 66.9c-.8.4-1.2 1.7-1 2.7.3 1.7 1.4 1.9 13.8 1.9h13.5v-5L73 66.2c-6.9-.1-13.1.2-13.8.7z" />
    </svg>
  );
  const SvgComponent2 = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      height={30}
      viewBox="0 0 512 512"
      fill="rgb(25,103,210)"
      {...props}
    >
      <path d="M218.7 70.2c-3.2 2.5-3.7 6.8-3.7 31.4V126h-79c-75.5 0-79.2.1-84 1.9-7 2.7-13 7.8-16.5 14.2l-3 5.4-.3 135.9-.2 135.9 2.3 5.1c3.2 6.9 7.5 11.6 13.9 15.2l5.3 2.9h405l5.3-2.9c6.4-3.6 10.7-8.3 13.9-15.2l2.3-5.1-.2-135.9-.3-135.9-3-5.4c-3.5-6.4-9.5-11.5-16.5-14.2-4.8-1.8-8.5-1.9-84-1.9h-79v-23.8c0-24.6-.7-30.5-4-32.2-2.9-1.6-72.2-1.3-74.3.2zm61.1 51.2c-.3 34-.4 35.6-2.4 38.2-4.7 6.4-6.3 6.9-21.2 6.9-15.3 0-18.2-.9-21.8-6.9-1.8-2.9-1.9-5.9-2.2-38.4l-.3-35.2h48.2l-.3 35.4zm-64.5 29.8c.9 11.7 3 17.3 9.1 23.4 6.7 6.6 11.8 8.4 26.6 9.1 23.4 1.1 35.6-3.6 41.9-16.2 2.3-4.7 4.1-13.3 4.1-20.3V143h155.7l3.3 2.3c1.9 1.2 4.3 3.8 5.4 5.7 2.1 3.5 2.1 4.4 2.4 130.5.2 86.5-.1 128.6-.8 132.1-1.1 5.1-4 8.8-8.7 11.3-1.6.8-55.3 1.1-198.6 1.1H59.3l-3.3-2.3c-1.8-1.2-4.3-3.5-5.4-5l-2.1-2.8V285.2c0-130 0-130.7 2.1-134.2 1.1-1.9 3.5-4.5 5.4-5.7l3.3-2.3h155.4l.6 8.2z" />
      <path d="M249.8 125.6c-7.7 4.1-7.5 16.9.2 20.9 6 3.1 13.7 1 16.5-4.5 5.7-11-5.8-22.3-16.7-16.4zM84.1 214.7c-1.8.9-4.5 3.4-6 5.7l-2.6 4v162.1l2.4 3.8c1.2 2.1 4.1 4.7 6.2 5.8 3.8 1.9 5.7 1.9 73.3 1.7 68.4-.3 69.5-.3 72.2-2.4 1.5-1.1 3.7-3.3 4.8-4.8 2.1-2.7 2.1-3.5 2.1-85v-82.3l-2.9-3.7c-5.2-6.9-2.2-6.6-77.8-6.6-61.4 0-68.6.2-71.7 1.7zM220 305.5V381H92V230h128v75.5z" />
      <path d="M145.2 250.8c-7 2.5-12 6.7-15.9 13.2-7.7 12.6-6.4 27.2 3.2 37.9 2.1 2.3 3.6 4.3 3.4 4.4l-5.4 2.7c-6.9 3.4-18.5 15.1-21.9 22.1-3.5 7.2-5.6 15.1-5.6 21.2 0 3.8.5 5.3 2.5 7.2l2.4 2.5h96.8l2.3-2.5c1.9-2 2.3-3.4 2.1-7.7-.5-16.5-11.7-34.6-26.1-42.2-3-1.6-5.6-3-5.8-3.1-.2-.2 1.5-2.7 3.8-5.6 12.4-16.4 7.5-39.4-10.5-48.7-6.8-3.4-17.8-4.1-25.3-1.4zm17.9 17.4c4.1 2.3 7.9 8.4 7.9 12.6 0 6.5-6.2 13.4-13 14.7-4.7.8-11.8-2.8-14.4-7.3-3.8-6.7-1.5-15.3 5.4-19.9 4.2-2.9 9.1-2.9 14.1-.1zm4.4 53.4c8.9 2.7 19.5 12.3 22.4 20.6l1 2.8h-34.5c-28.1 0-34.4-.2-34.4-1.3 0-2.5 7.6-13.1 11.3-16 10.3-7.8 21.5-9.8 34.2-6.1zM288 227c-4.5 4.5-3.3 11.2 2.5 13.6 3.1 1.2 12.6 1.4 65 1.2l61.4-.3 2.3-2.3c3.2-3.1 3.1-9.7-.1-12.3-2.2-1.8-5-1.9-65.7-1.9-61.8 0-63.5.1-65.4 2zM290.2 272.5c-5.5 2.4-6.6 9.1-2.2 13.5 1.9 1.9 3.6 2 65.4 2 60.7 0 63.5-.1 65.7-1.9 3.2-2.6 3.3-9.2.1-12.3l-2.3-2.3-61.7-.2c-51.7-.2-62.2 0-65 1.2zM290 319.3c-5.2 2.6-6.2 9.5-2 13.7 2 2 3.6 2 65.5 2s63.5 0 65.5-2c4.2-4.2 3.2-11.1-2-13.7-3.6-1.8-123.4-1.8-127 0zM290 366.3c-5.2 2.6-6.2 9.5-2 13.7 2 2 3.6 2 65.5 2s63.5 0 65.5-2c4.2-4.2 3.2-11.1-2-13.7-3.6-1.8-123.4-1.8-127 0z" />
    </svg>
  );
  return (
    <div>
      <div className="settingselect">
        <ul>
          <li>
            <Link href="/profile/settings">
              <div className="svgwrap">
                <div>
                  <SvgComponent2 />
                </div>
                <div>개인 정보</div>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/profile/settings/security">
              <div className="svgwrap">
                <div>
                  <SvgComponent />
                </div>
                <div>보안</div>
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <div className="pfsettingwrap">
        <form onSubmit={handleSubmit(onValid)}>
          <div className="upload_image">
            {imagePreview ? (
              <Image src={imagePreview} alt="" layout="fill" />
            ) : (
              <label>
                <svg
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Input
                  name="image"
                  accept="image/*"
                  type="file"
                  imgbool="false"
                  // required
                  register={register('image')}
                />
              </label>
            )}
          </div>
          <div className="upload_input">
            <Input
              label="email"
              name="email"
              type="text"
              register={register('email')}
            />
            <Input
              label="name"
              name="name"
              type="text"
              register={register('name')}
            />
          </div>
          <Button isLoading={false} text="수정" />
        </form>
      </div>
      <style jsx>{`
        .settingselect {
          display: block;
          width: 280px;
          position: fixed;
        }
        @media (max-width: 1024px) {
          .settingselect {
            display: none;
          }
        }
        ul {
          padding: 0;
        }
        li {
          list-style: none;
          display: flex;
          align-items: center;
          padding: 10px 16px 10px 24px;
          border-radius: 0 50px 50px 0;
          font-size: 14px;

          &:hover {
            background-color: rgb(232, 240, 254);
            color: rgb(25, 103, 210);
          }
        }
        .svgwrap {
          display: flex;
          align-items: center;
          width: 100%;
          cursor: pointer;

          > div {
            padding-right: 15px;
          }
        }
        .pfsettingwrap {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          max-width: 40rem;
          box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
          margin: auto;
          margin-top: 2rem;
          padding: 2.5rem;
          padding-bottom: 10px;
          padding-top: 2rem;
        }
        .upload_image-wrap {
          display: flex;
        }
        .upload_image {
          position: relative;
          display: flex;
          border: 2px dashed gray;
          border-radius: 0.375rem;
          width: 400px;
          height: 400px;

          svg {
            width: 50%;
            height: 50%;
          }

          img {
            width: 50%;
            height: 50%;
          }

          label {
            width: 100%;
            height: 100%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          :hover {
            color: orange;
            border-color: orange;
          }
        }
        .upload_input {
          margin-top: 3rem;
        }
      `}</style>
    </div>
  );
};

export default SettingHome;
