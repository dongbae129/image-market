import type { NextPage } from 'next';
import { useQuery, useMutation } from 'react-query';
import { getFetch, newAxios } from '@libs/client/fetcher';
import { userResponse } from '@components/headmenu';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@components/input';
import Image from 'next/image';
import Button from '@components/button';
import axios from 'axios';
import NextImage from 'next/image';
import Link from 'next/link';
import SetSelect from '@components/setSelect';
import store from 'reducers/store';

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
    enabled: !store.getState().user.restoreState
  });
  const { watch, register, handleSubmit } = useForm<SettingForm>();
  const imageWatch = watch('image');
  const setUser = (formData: FormData) =>
    newAxios
      .post(`/api/user/${data?.user.id}`, formData)
      .then((res) => res.data);
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

  const onDleteClick = () => {
    newAxios.delete(`/api/user/${data?.user.id}`);
  };
  return (
    <div className="pfsettingOverwrap">
      <SetSelect />
      <div className="test">
        <div className="pfsettingwrap">
          <div className="pfsetting-myinfo">
            <div className="myinfo_img-wrap">
              <div className="myinfo_img">{data?.user?.name?.slice(0, 1)}</div>
            </div>
            <h1>{data.user.name}님, 환영합니다</h1>
          </div>
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
              <div className="upload_input_inputwrap">
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
            </div>
          </form>
          <Button isLoading={false} text="회원탈퇴" onClick={onDleteClick} />
        </div>
      </div>
      <style jsx>{`
        .pfsettingOverwrap {
          width: 100%;
          height: calc(100% - 80px);
          position: absolute;
        }
        .pfsetting-myinfo {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 400px;

          h1 {
            font-weight: 500;
            word-break: break-all;
            word-wrap: break-word;
          }
        }
        .myinfo_img-wrap {
          display: flex;
        }
        .myinfo_img {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background-color: #1f4078;
          font-size: 3rem;
          color: #fff;
        }
        .test {
          margin-left: 300px;
          margin-right: 300px;
        }
        @media (max-width: 1024px) {
          .test {
            margin: auto;
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
        @media (min-width: 1024px) {
          .pfsettingwrap {
            margin-left: min($numbers: 300px) auto;
          }
        }
        .upload_image-wrap {
          display: flex;
        }
        .upload_image {
          position: relative;
          margin: auto;
          display: flex;
          border: 2px dashed gray;
          border-radius: 0.375rem;
          width: 300px;
          height: 300px;

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
          margin-top: 1.5rem;
          width: 300px;
        }
      `}</style>
    </div>
  );
};

export default SettingHome;
