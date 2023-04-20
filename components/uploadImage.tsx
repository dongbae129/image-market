import { newAxios } from '@libs/client/fetcher';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Button from './button';
import Editor from './editor';
import InputHashtag from './hashtag';
import Input from './input';

interface UploadForm {
  imm?: FileList;
  // title?: string;
  // description?: string;
  [key: string]: any;
}
interface UploadImageProps {
  image?: string | null;
  url: string;
  buttontext: string[];
  component: string[];
  elementType: string[];
  hashtrue: boolean;
  buttonColor: string[];
  labelTrue: boolean;
  setModalOpen?: () => void;
  elementValue?: {
    [key: string]: string | null | undefined;
  };
}
interface UploadFormData {
  [key: string]: string | boolean | undefined;
}

const UploadImage = (info: UploadImageProps) => {
  const router = useRouter();
  const routerId = router.query.id;
  // console.log(info, 'Info');

  useEffect(() => {
    if (info.elementValue?.hashtag)
      setHashtag(info.elementValue.hashtag.split(','));
  }, [info.elementValue?.hashtag]);
  useEffect(() => {
    if (info.elementValue?.description)
      setEditorValue(info.elementValue?.description);
  }, [info.elementValue?.description]);
  useEffect(() => {
    if (info?.elementValue?.title) setInputTitle(info?.elementValue?.title);
  }, [info?.elementValue?.title]);
  const [imagePreview, setImagePreview] = useState('');
  const [editorValue, setEditorValue] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [hashtag, setHashtag] = useState<string[]>([]);

  const { register, handleSubmit, watch, setValue, getValues } =
    useForm<UploadForm>();
  const postUploadForm = (data: FormData | UploadFormData) =>
    newAxios.post(`/api/${info.url}`, data).then((res) => res.data);

  const { mutate, isLoading } = useMutation(postUploadForm, {
    onSuccess: (res) => {
      // console.log(res, 'res');
      const routerId = res.product ? res.product.id : res.board.id;
      // console.log(routerId, 'routerId');
      const originalRoute = info.url.split('/')[0];
      router.replace(`/${originalRoute}/${routerId ? routerId : ''}`);
    }
  });
  console.log(info, 'III');

  const imageWatch = watch('image');
  const onValid = (v: UploadForm) => {
    if (isLoading) return;
    const form = new FormData();
    const formInfo: UploadFormData = {};
    console.log(v, 'VVV');

    for (const key in v) {
      if (key === 'image') {
        form.append('file', v[key][0]);
      } else {
        if (key === 'productAuth') {
          form.append(
            'productAuth',
            JSON.stringify({ productBoolean: v[key] })
          );
          formInfo['productAuth'] = JSON.stringify({ productBoolean: v[key] });
          continue;
        }
        form.append(key, v[key]);
        formInfo[key] = v[key];
        // formInfo{ [key]: v[key] };
      }
    }
    form.append('hashtag', hashtag.join(','));
    form.append('description', editorValue);
    form.append(
      'imageOk',
      JSON.stringify({ imgBoolean: v.image && v.image[0] ? true : false })
    );
    formInfo['boardtag'] = hashtag.join(',');
    formInfo['description'] = editorValue;

    form.forEach((key, val) => {
      console.log(key, val, 'vv');
    });

    mutate(info.url.includes('product') ? form : formInfo);
    // mutate(form);
  };
  const onDeleteBoard = () => {
    newAxios
      .delete(`/api/${info.url}/${routerId}`)
      .then(() => router.push('/board'));
  };
  useEffect(() => {
    if (imageWatch && imageWatch.length > 0) {
      const file = imageWatch[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imageWatch]);

  return (
    <>
      <div className="uploadimagewrap">
        <div className="upload_image">
          {!info.image ? null : info?.image && imagePreview ? (
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
                required
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
                type={v === 'productAuth' ? 'checkbox' : 'text'}
                // value={info.elementValue && info.elementValue[v]}
                // inputValue={info.elementValue && info.elementValue[v]}
                required
                register={register(v)}
                inputValue={v === 'title' ? inputTitle : ''}
                setRegister={setValue}
              />
            );
          } else if (info.elementType[i] === 'textarea')
            return (
              <div className="editorwrap" key={v}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute'
                  }}
                >
                  <Editor
                    mutate={mutate}
                    isLoading={false}
                    btntrue={!info.buttontext}
                    setter={setEditorValue}
                    labelTrue={info.labelTrue}
                    btnActive={false}
                    chatValue={info.elementValue?.description || ''}
                  />
                </div>
              </div>
              // <TextArea
              //   key={v}
              //   label={v}
              //   name={v}
              //   required
              //   register={register(v, { required: true })}
              // />
            );
        })}
        {info.hashtrue && (
          <InputHashtag hashtag={hashtag} setHashtag={setHashtag} />
        )}
        <div className="buttonwrap">
          {info.buttontext &&
            info.buttontext.map((text, i) => (
              <div key={i}>
                <Button
                  isLoading={false}
                  // isLoading={isLoading}
                  text={text}
                  color={info.buttonColor[i]}
                  onClick={
                    text === '삭제' ? info.setModalOpen : handleSubmit(onValid)
                  }
                />
              </div>
            ))}
        </div>
      </div>

      <style jsx>{`
        .uploadimagewrap {
          max-width: 100%;
          width: 100%;
        }
        .upload_image {
          display: ${info.image ? 'block' : 'none'};
          position: relative;
          border: 2px dashed gray;
          border-radius: 0.375rem;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          margin: auto;
          margin-bottom: 1rem;
          overflow: hidden;

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
        .editorwrap {
          min-height: 150px;
          height: 200px;
          position: relative;
          margin-bottom: 2rem;
        }
        .buttonwrap {
          display: flex;
          justify-content: end;

          > div {
            padding: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default UploadImage;
