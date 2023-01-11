import axios from 'axios';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Button from './button';
import InputHashtag from './hashtag';
import Input from './input';
import TextArea from './textarea';

interface UploadForm {
  imm?: FileList;
  // title?: string;
  // description?: string;
  [key: string]: any;
}
interface UploadImageProps {
  image?: string;
  url: string;
  buttontext: string;
  component: string[];
  elementType: string[];
}
interface UploadFormData {
  form: FormData;
  info: object;
}
const UploadImage = (info: UploadImageProps) => {
  const router = useRouter();
  const boardId = router.query.boardId;
  const [imagePreview, setImagePreview] = useState('');
  const [hashtag, setHashtag] = useState<string[]>([]);

  const { register, handleSubmit, watch } = useForm<UploadForm>();
  console.log(info.url, 'url');
  const postUploadForm = (data: UploadFormData) =>
    axios.post(`/api/${info.url}`, data).then((res) => res.data);

  const { mutate, isLoading } = useMutation(postUploadForm, {
    onSuccess: () => {
      router.push(`/board/${boardId ? boardId : ''}`);
    }
  });

  const imageWatch = watch('image');
  const onValid = (v: UploadForm) => {
    console.log(v, 'v');
    if (isLoading) return;
    const form = new FormData();
    const info: { [key: string]: string } = {};

    for (const key in v) {
      if (key === 'image') {
        form.append('file', v[key][0]);
      } else {
        form.append(key, v[key]);
        info[key] = v[key];
        // info{ [key]: v[key] };
      }
    }
    info['boardtag'] = hashtag.join(',');
    // info.push({ boardtag: hashtag.join(',') });
    mutate({ form, info });
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
        <Button isLoading={isLoading} text={info.buttontext} />
      </form>
      <InputHashtag hashtag={hashtag} setHashtag={setHashtag} />
      <style jsx>{`
        form {
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default UploadImage;
