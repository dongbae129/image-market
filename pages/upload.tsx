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
  const imageWatch = watch('image');
  const onValid = ({
    image,
    title,
    description,
    productAuth,
    ratio
  }: UploadProductForm) => {
    console.log(title, 'ti');
    if (isLoading) return;
    // console.log(imageWatch[0], '@@');
    const form = new FormData();

    // const imgtest = new Image()
    console.log(image, 'Image');

    console.log(hashtag, 'hash');
    form.append('file', image[0]);
    form.append('title', title);
    form.append('hashtag', hashtag.join());
    form.append('description', description!);
    form.append('ratio', ratioRef.current);
    form.append('productAuth', JSON.stringify({ productBool: productAuth }));
    mutate(form);
  };

  useEffect(() => {
    if (imageWatch && imageWatch.length > 0) {
      console.log(imageWatch, 'watchbefore');
      const file = imageWatch[0];
      if (file) {
        const ratioImage = new Image();
        ratioImage.src = URL.createObjectURL(file);

        ratioImage.onload = () => {
          ratioRef.current = (ratioImage.width / ratioImage.height).toFixed(2);
          console.log(ratioImage.width, ratioImage.height, '?!');
        };

        // testimage.onload(() => {
        //   console.log(testimage.width, testimage.height, 'onload');
        // });
        // console.log(testimage, '11');
        // console.log(testimage.width, testimage.height, '22');
      }
      console.log(file, 'imagewatch');
      console.log(imgref.current?.width, 'imgref22');
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imageWatch]);

  console.log(imagePreview, 'imagePreview');

  return (
    <div className="uploadwrap">
      {/* <div>
        <div>
          <div>
            <div className="upload_image">
              {imagePreview ? (
                <NextImage src={imagePreview} alt="" layout="fill" />
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
                label="title"
                name="title"
                type="text"
                required
                register={register('title', { required: true })}
              />
              <InputHashtag hashtag={hashtag} setHashtag={setHashtag} />

              <TextArea
                label="description"
                name="description"
                type="text"
                required
                register={register('description', { required: true })}
              />
              <Input
                label="productAuth"
                name="productAuth"
                type="checkbox"
                register={register('productAuth')}
              />
            </div>
          </div>

          <Button
            isLoading={isLoading}
            text="저장"
            onClick={handleSubmit(onValid)}
          />
        </div>
      </div> */}
      <UploadImage
        url="product"
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
