import axios from 'axios';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Button from './button';
import Input from './input';
import TextArea from './textarea';

interface UploadForm {
  imm: FileList;
  title?: string;
  description?: string;
  [key: string]: any;
}
interface UploadImageProps {
  image?: string;
  url: string;
  component: string[];
  elementType: string[];
}
const UploadImage = (info: UploadImageProps) => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState('');
  const { register, handleSubmit, watch } = useForm<UploadForm>();
  const postUploadForm = (data: FormData) =>
    axios.post(`/api/${info.url}`, data).then((res) => res.data);

  const { mutate, isLoading } = useMutation(postUploadForm, {
    onSuccess: () => router.push('/board')
  });

  const imageWatch = watch('image');
  const onValid = (v) => {
    console.log(v, 'test');
    if (isLoading) return;
    const form = new FormData();
    const test = [];

    for (const key in v) {
      if (key === 'image') {
        form.append('file', v[key][0]);
      } else {
        form.append(key, v[key]);
        test.push(v[key]);
      }
    }
    mutate(v);
  };
  console.log(imageWatch, 'watch');
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
          {!info.image ? null : info?.image && imagePreview ? (
            <Image src={imagePreview} alt="" width={100} height={100} />
          ) : (
            <label>
              <Input
                label="image"
                name="image"
                accept="image/*"
                type="file"
                register={register('image')}
              />
            </label>
          )}
        </div>
        {info?.component?.map((v, i) => {
          if (info?.elementType[i] === 'input') {
            return (
              <Input
                key={v}
                label={v}
                name={v}
                type="text"
                register={register(v)}
              />
            );
          } else if (info.elementType[i] === 'textarea')
            return (
              <TextArea key={v} label={v} name={v} register={register(v)} />
            );
        })}
        <Button isLoading={isLoading} text="수정" />
      </form>
    </>
  );
};

export default UploadImage;
