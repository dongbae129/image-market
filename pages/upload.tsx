import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Layout from './../components/layout';
import Input from './../components/input';
import { Product } from '@prisma/client';

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

  const { mutate, isLoading, isError } = useMutation<
    UploadProductResponse,
    any,
    UploadProductForm
  >('/api/products', {
    onSuccess: (res) => {
      router.push(`product/${res.product.id}`);
    }
  });
  const onValid = ({ image, title, description }: UploadProductForm) => {
    if (isLoading) return;
    const form = new FormData();
    form.append('file', image[0]);
    mutate({ image, title, description });
  };
  const imageWatch = watch('image');
  useEffect(() => {
    if (imageWatch && imageWatch.length > 0) {
      const file = imageWatch[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);
  return (
    <Layout>
      <form onSubmit={handleSubmit(onValid)}>
        <div>
          <div>
            {imagePreview ? (
              <img src="" alt="" />
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
        <button>{isLoading ? 'Loading..' : '저장'}</button>
      </form>
    </Layout>
  );
};

export default Upload;
