import type { NextPage } from 'next';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Input from './../components/input';
import { Product } from '@prisma/client';
import style from '@styles/Upload.module.scss';
import axios from 'axios';
import Button from '@components/button';
import NextImage from 'next/image';
import InputHashtag from '@components/hashtag';
import TextArea from '@components/textarea';

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
  if (imgref) {
    console.log(imgref.current, 'imgref');
  }

  const router = useRouter();
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
    // mutate(form);
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
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      if (hashtag.includes(target.value)) {
        alert('중복태그 불가능합니다');
        return;
      }
      if (hashtag.length > 4) {
        alert('해쉬태그는 5개까지 가능합니다');
        return;
      }
      setHashtag(hashtag.concat(target.value));
      target.value = '';
    }
  };
  const deleteHashtag = (index: number) => () => {
    setHashtag((prev) => prev.filter((v, i) => i !== index));
  };
  console.log(imagePreview, 'qwed');
  console.log(imgInputRef.current, 'imginput');
  return (
    <div className="uploadwrap">
      <div>
        <form onSubmit={handleSubmit(onValid)}>
          <div>
            <div className="upload_image">
              {imagePreview ? (
                <NextImage src={imagePreview} alt="" layout="fill" />
              ) : (
                // <img src={imagePreview} ref={imgref} />
                // <img src={imagePreview} />
                // <img src={imagePreview} alt="" />
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
                  {/* <input
                    {...register('image')}
                    accept="image/*"
                    type="file"
                    style={{ display: 'none' }}
                  /> */}
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
                label="제목"
                name="title"
                type="text"
                required
                register={register('title')}
              />

              <TextArea
                label="내용"
                name="description"
                type="text"
                required
                register={register('description', { required: true })}
              />
              <Input
                label="유료"
                name="productAuth"
                type="checkbox"
                register={register('productAuth')}
              />
            </div>
          </div>

          <Button isLoading={isLoading} text="저장" />
        </form>
        <InputHashtag hashtag={hashtag} setHashtag={setHashtag} />
      </div>
      <style jsx>{`
        .uploadwrap {
          display: flex;
          justify-content: center;

          > div {
            max-width: 30rem;
          }
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
