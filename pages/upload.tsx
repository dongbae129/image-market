import type { NextPage } from 'next';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import Input from './../components/input';
import { Product } from '@prisma/client';
import style from '@styles/Upload.module.scss';
import axios from 'axios';
import Button from '@components/button';
import NextImage from 'next/image';
import InputHashtag from '@components/hashtag';
import TextArea from '@components/textarea';
import { userResponse } from '@components/headmenu';
import UploadImage from '@components/uploadImage';

interface UploadProductForm {
  image: FileList;
  title: string;
  description?: string;
  productAuth: boolean;
  ratio: number;
}

interface UploadProductResponse {
  ok: boolean;
  product: Product;
  error?: string;
  message?: string;
}
const Upload: NextPage = () => {
  const [imagePreview, setImagePreview] = useState('');
  const [hashtag, setHashtag] = useState<string[]>([]);
  const ratioRef = useRef('');
  const imgInputRef = useRef<JSX.Element>(null);
  const imgref = useRef<HTMLImageElement>(null);

  const router = useRouter();

  // const { data } = useQuery<userResponse>(['userInfo']);

  // if ((data && !data?.ok) || (data && !data.user.id)) router.push('/');

  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const uploadPost = (data: FormData) =>
    axios.post('/api/product/upload', data).then((res) => res.data);
  const { mutate, isLoading } = useMutation<
    UploadProductResponse,
    any,
    FormData
  >(uploadPost, {
    onSuccess: ({ product }) => {
      console.log(product, 'product data');
      router.push(`/product/${product.id}`);
    }
  });
  // const imageWatch = watch('image');

  // useEffect(() => {
  //   if (imageWatch && imageWatch.length > 0) {
  //     console.log(imageWatch, 'watchbefore');
  //     const file = imageWatch[0];
  //     if (file) {
  //       const ratioImage = new Image();
  //       ratioImage.src = URL.createObjectURL(file);

  //       ratioImage.onload = () => {
  //         ratioRef.current = (ratioImage.width / ratioImage.height).toFixed(2);
  //         console.log(ratioImage.width, ratioImage.height, '?!');
  //       };

  //       // testimage.onload(() => {
  //       //   console.log(testimage.width, testimage.height, 'onload');
  //       // });
  //       // console.log(testimage, '11');
  //       // console.log(testimage.width, testimage.height, '22');
  //     }
  //     console.log(file, 'imagewatch');
  //     console.log(imgref.current?.width, 'imgref22');
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // }, [imageWatch]);

  return (
    <div className="uploadwrap">
      <UploadImage
        url="product/upload"
        component={['title', 'description', 'productAuth']}
        elementType={['input', 'textarea', 'input']}
        buttontext={['등록']}
        buttonColor={[]}
        labelTrue={true}
        hashtrue={true}
        image="true"
      />
      <style jsx>{`
        .uploadwrap {
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

export default Upload;
