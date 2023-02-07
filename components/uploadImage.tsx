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
  buttontext: string;
  component: string[];
  elementType: string[];
  hashtrue: boolean;
  elementValue?: {
    [key: string]: string | null;
  };
}
interface UploadFormData {
  form: FormData;
  info: object;
}
const UploadImage = (info: UploadImageProps) => {
  const router = useRouter();
  const routerId = router.query.boardId;
  console.log(routerId, ' router');
  const [imagePreview, setImagePreview] = useState('');
  const [editorValue, setEditorValue] = useState('');
  const [hashtag, setHashtag] = useState<string[]>([]);

  const { register, handleSubmit, watch } = useForm<UploadForm>();
  const postUploadForm = (data: UploadFormData) =>
    axios.post(`/api/${info.url}/${routerId}`, data).then((res) => res.data);

  const { mutate, isLoading } = useMutation(postUploadForm, {
    onSuccess: () => {
      router.push(`/${info.url}/${routerId ? routerId : ''}`);
    }
  });

  const imageWatch = watch('image');
  const onValid = (v: UploadForm) => {
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
    info['description'] = editorValue;
    // info.push({ boardtag: hashtag.join(',') });
    mutate({ form, info });
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
                // required
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
                // value={info.elementValue && info.elementValue[v]}
                inputValue={info.elementValue && info.elementValue[v]}
                required
                register={register(v, { required: true })}
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
        {info.buttontext && (
          <Button
            isLoading={isLoading}
            text={info.buttontext}
            onClick={handleSubmit(onValid)}
          />
        )}
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
          min-height: 300px;
          height: 300px;
          position: relative;
        }
      `}</style>
    </>
  );
};

export default UploadImage;
