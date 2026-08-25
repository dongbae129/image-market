'use client';
import { newAxios } from '@libs/client/fetcher';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import Button from './button';
import Editor from './editor';
import InputHashtag from './hashtag';
import Input from './input';
import { getRatio } from '@libs/client/getRatio';
import { labelOb } from '@libs/client/data/data';
import { json } from 'stream/consumers';

export interface UploadForm {
  imm?: FileList;
  // title?: string;
  // description?: string;
  [key: string]: any;
}
export interface UploadImageProps {
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

const UploadImage = (info: UploadImageProps, { searchParams }) => {
  const router = useRouter();
  // const routerId = router.query.id;

  const [imagePreview, setImagePreview] = useState('');
  const [editorValue, setEditorValue] = useState('');
  const [inputTitle, setInputTitle] = useState('');

  // const titleRef = useRef('');
  const [hashtag, setHashtag] = useState<string[]>([]);
  const form = new FormData();
  const imgRatioRef = useRef('');
  const { register, handleSubmit, watch, setValue, getValues } =
    useForm<UploadForm>();

  // const { data: urlData, isSuccess } = useQuery({
  //   queryKey: ['test'],
  //   queryFn: () =>
  //     fetch('/api/product/upload', {
  //       method: 'GET'
  //     }).then(async (res) => {
  //       const urlRes = await res.json();
  //       setImgTest(urlRes);
  //       return urlRes;
  //     })
  // });
  // console.log(urlData, 'urlData');

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
  const postUploadForm = (data: FormData | UploadFormData) =>
    newAxios
      .post(`/api/product`, data, {
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // }
      })
      .then((res) => res.data);
  // newAxios
  //   .post(`/api/${info.url}`, data, {
  //     // headers: {
  //     //   'Content-Type': 'multipart/form-data'
  //     // }
  //   })
  //   .then((res) => res.data);

  const { mutate, isPending } = useMutation({
    mutationFn: postUploadForm,
    onSuccess: async (res) => {
      console.log(res, 'RES');
      const uploadImage = await fetch(res.data.url, {
        method: 'PUT',
        headers: {
          'Content-type': res.data.type
        },
        body: form.get('file')
      });
      console.log(uploadImage, 'pre uplaod test');
      // const routerId = res.product ? res.product.id : res.board.id;
      // const originalRoute = info.url.split('/')[0];
      // const url = `/${originalRoute}/${routerId ? routerId : ''}`;
      // router.replace(url);
    }
  });

  const imageWatch = watch('image');

  const onValid = async (v: UploadForm) => {
    if (isPending) return;

    const formInfo: UploadFormData = {};

    // console.log(v, 'VVV');
    // console.log(inputTitle, 'inputtitle222');
    if (info.url.includes('product/upload') && !imagePreview) {
      alert('이미지를 첨부 하셔야 합니다');
      return;
    }

    const productInfo: UploadFormData = {};

    for (const key in v) {
      if (key === 'image') {
        form.append('file', v[key][0]);
      } else {
        if (key === 'productAuth') {
          form.append('productAuth', v[key]);
          productInfo['productAuth'] = v[key];
          formInfo['productAuth'] = v[key];
          continue;
        } else if (key === 'title') {
          form.append('title', inputTitle);
          productInfo['title'] = v[key];
          formInfo['title'] = inputTitle;
          continue;
        }
        form.append(key, v[key]);
        productInfo[key] = v[key];
        formInfo[key] = v[key];
      }
    }
    productInfo['hashtag'] = hashtag.join(',');
    productInfo['description'] = editorValue;
    productInfo['ratio'] = imgRatioRef.current;

    form.append('hashtag', hashtag.join(','));
    form.append('description', editorValue);
    form.append('imageOk', v.image && v.image[0] ? 'true' : 'false');
    formInfo['boardtag'] = hashtag.join(',');
    formInfo['description'] = editorValue;
    if (imgRatioRef.current.length > 0)
      form.append('ratio', imgRatioRef.current);
    formInfo['ratio'] = imgRatioRef.current;
    // for (const [key, value] of form.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    const file = v['image'][0] as File;
    const fileType = file.name.split('.').pop()?.toLowerCase() as string;
    try {
      const getPreSignedUrl = await fetch('api/product/init', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          name: file.name,
          type: fileType
        })
      });
      const { data } = await getPreSignedUrl.json();

      console.log(
        fileType,
        typeof fileType,
        file.type,
        typeof file.type,
        '파일타입 테스트'
      );
      const s3Form = new FormData();
      s3Form.append('Content-Type', `image/${fileType}`);
      Object.entries(data.fields).forEach(([k, v]) => {
        s3Form.append(k, v);
      });
      s3Form.append('file', file);
      /*
       s3 이미지 업로드
       */
      const uploadImage = await fetch(data.url, {
        method: 'POST',
        //   // headers: {
        //   //   'Content-type': file.type
        //   // },
        body: s3Form
      });
      /*
      product create
       */
      // productInfo['tempKey'] = data.tempKey;
      console.log(file, 'file');

      // const ext = file.name.split('.').pop()?.toLowerCase();
      productInfo['tempKey'] = data.tempKey;
      // productInfo['tempKey'] = data.tempKey.endsWith('.jpg')
      //   ? data.tempKey.replace(/\.jpg$/i, '.jpeg')
      //   : data.tempKey;
      await fetch('api/product', {
        method: 'POST',
        body: JSON.stringify(
          info.url.includes('product') ? productInfo : formInfo
        )
        // body: form
      });
      // mutate(info.url.includes('product') ? form : formInfo);

      // mutate(info.url.includes('product') ? form : formInfo, {
      //   onSuccess(data, variables, context) {
      //     console.log(data, 'data', variables, 'var', context, 'cont');
      //   }
      // });
    } catch (error) {
      console.error(error, 'ERR');
      return;
    }
  };
  // const onDeleteBoard = () => {
  //   newAxios
  //     .delete(`/api/${info.url}/${routerId}`)
  //     .then(() => router.push('/board'));
  // };

  useEffect(() => {
    if (info?.elementValue?.imgsrc) {
      setImagePreview(`/uploads/${info?.elementValue?.imgsrc}`);
    }
  }, [info?.elementValue?.imgsrc]);
  useEffect(() => {
    getRatio(imageWatch, setImagePreview)?.then((res) => {
      imgRatioRef.current = res;
    });
  }, [imageWatch]);

  return (
    <>
      <div className="uploadimagewrap">
        {/* <img
          src={`${process.env.NEXT_R2_DEV_PUBLIC_URL}/VeQYOl2Y4iSRJdE163f9PK-0071718699935612.jpg`}
        /> */}
        <div className="upload_image">
          {!info.image ? null : info?.image && imagePreview ? (
            <label>
              <NextImage src={imagePreview} alt="" fill sizes="200px 200px" />
              <Input
                label="image"
                name="image"
                accept="image/*"
                type="file"
                imgbool="false"
                required
                register={register('image')}
              />
            </label>
          ) : (
            <>
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
              <label htmlFor="image" className="image_label">
                <Input
                  label="image"
                  name="image"
                  accept="image/*"
                  type="file"
                  imgbool="false"
                  required
                  register={register('image')}
                />
              </label>
            </>
          )}
        </div>
        {info?.component?.map((v, i) => {
          if (info?.elementType[i] === 'input') {
            return (
              <div className={'inputwrap'} key={v}>
                {/* {<label htmlFor={v}>{labelOb[v]}</label>} */}
                <div className="input-div">
                  {/* <Input
                    label={v}
                    name={v}
                    type={v === 'productAuth' ? 'checkbox' : 'text'}
                    register={register(v, { required: true })}
                    required
                  /> */}
                  <label
                    htmlFor={v}
                    className={v === 'productAuth' ? 'charged' : ''}
                  >
                    {labelOb[v]}
                    <input
                      id={v}
                      type={v === 'productAuth' ? 'checkbox' : 'text'}
                      value={v === 'title' ? inputTitle : undefined}
                      {...register(v)}
                      onChange={
                        v === 'title'
                          ? (e) => setInputTitle(e.target.value)
                          : register(v).onChange
                      }
                      name={v}
                    />
                  </label>
                </div>
              </div>

              // <Input
              //   key={v}
              //   label={v}
              //   name={v}
              //   type={v === 'productAuth' ? 'checkbox' : 'text'}
              //   // value={info.elementValue && info.elementValue[v]}
              //   // inputValue={info.elementValue && info.elementValue[v]}
              //   required
              //   register={register(v)}
              //   inputValue={v === 'title' ? inputTitle : ''}
              //   setRegister={setValue}
              // />
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
        .inputwrap {
          display: ${'block'};
          height: 100%;
          position: relative;
        }
        .input-div {
          height: 100%;
          margin-top: 0.25rem;
          margin-bottom: 1rem;
        }
        label {
          font-weight: 500;
          font-size: 0.875rem;
          line-height: 1.25rem;
          cursor: pointer;
        }

        input {
          width: ${'100%'};
          height: ${'100%'};
          border-radius: 4px;
          border: none;
          padding: 0.5rem;
          padding-left: ${'0.5rem'};
          font-size: 1rem;
          outline: 1px solid rgba(0, 0, 0, 0.16);

          &:focus {
            outline: 3px solid rgb(127, 193, 255);
          }
        }
        .charged {
          display: flex;
          align-items: center;
        }
        .charged > input {
          margin-left: 5px;
          width: 24px;
          height: 24px;
          outline: 0;
        }
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
          cursor: pointer;

          svg {
            width: 80%;
            height: 80%;
            transform: translate(10%, 10%);
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
          margin-bottom: 3rem;
        }
        .buttonwrap {
          display: flex;
          justify-content: end;

          > div {
            padding: 10px;
          }
        }
        .image_label {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
        label {
          position: relative;
        }
      `}</style>
    </>
  );
};

export default UploadImage;
