import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Input from './../components/input';
import { Product } from '@prisma/client';
import style from '@styles/Upload.module.scss';
import axios from 'axios';
import Button from '@components/button';
interface UploadProductForm {
  image: FileList;
  title: string;
  description?: string;
}

interface UploadProductResponse {
  ok: boolean;
  product: Product;
  error?: string;
  message?: string;
}
const Upload: NextPage = () => {
  const [imagePreview, setImagePreview] = useState('');
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
  const onValid = ({ image, title, description }: UploadProductForm) => {
    if (isLoading) return;
    // console.log(imageWatch[0], '@@');
    const form = new FormData();
    form.append('file', image[0]);
    form.append('title', title);
    form.append('description', description!);

    mutate(form);
  };

  useEffect(() => {
    if (imageWatch && imageWatch.length > 0) {
      const file = imageWatch[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imageWatch]);
  return (
    <>
      <form onSubmit={handleSubmit(onValid)}>
        <div>
          <div className={style.imageInput}>
            {imagePreview ? (
              <img src={imagePreview} alt="" />
            ) : (
              <label>
                <Input
                  label="image"
                  name="image"
                  accept="image/*"
                  type="file"
                  required
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
            register={register('title', { required: true })}
          />
          <div>userInformation, get</div>
          <Input
            label="description"
            name="description"
            type="text"
            required
            register={register('description', { required: true })}
          />
        </div>
        <Button isLoading={isLoading} text="저장" />
      </form>
    </>
  );
};

export default Upload;
