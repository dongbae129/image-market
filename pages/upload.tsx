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
  return (
    <>
      <form onSubmit={handleSubmit(onValid)}>
        <div>
          <div className={style.imageInput}>
            {imagePreview ? (
              <NextImage src={imagePreview} alt="" layout="fill" />
            ) : (
              // <img src={imagePreview} ref={imgref} />
              // <img src={imagePreview} />
              // <img src={imagePreview} alt="" />
              <label>
                <Input
                  label="image"
                  name="image"
                  accept="image/*"
                  type="file"
                  // required
                  register={register('image')}
                />
              </label>
            )}
          </div>
          <Input
            label="title"
            name="title"
            type="text"
            required
            register={register('title')}
          />
          <div>userInformation, get</div>
          <Input
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

        <Button isLoading={isLoading} text="저장" />
      </form>
      <input
        className="hashinput"
        type="text"
        onKeyUp={onKeyUp}
        placeholder="태그 입력후 엔터"
      />
      <div>
        {hashtag.map((v, i) => (
          <span className="hashwrap" key={i} onClick={deleteHashtag(i)}>
            <span className="hash">#</span>
            <span>{v}</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        .hashinput {
          margin-bottom: 1rem;
        }
        .hashwrap {
          background-color: #f8f9fa;
          display: inline-block;
          border-radius: 1rem;
          height: 2rem;
          line-height: 2rem;
          padding-left: 1rem;
          padding-right: 1rem;
          margin-right: 0.75rem;
          &:hover {
            cursor: pointer;
            background-color: darkgray;
          }
          span {
            font-weight: bold;
          }

          span:nth-child(1) {
            color: #12b886;
            font-weight: bold;
            padding-right: 0.2rem;
          }
        }
      `}</style>
    </>
  );
};

export default Upload;
