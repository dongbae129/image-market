import Button from '@components/Button';
import Input from '@components/input';
import TextArea from '@components/textarea';
import axios from 'axios';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

interface boardUploadForm {
  title: string;
  description: string;
}
interface boardUploadResponse {
  ok: boolean;
  message?: string;
  error?: string;
}
const Upload: NextPage = () => {
  const { register, handleSubmit } = useForm<boardUploadForm>();
  const boardUpload = (data: boardUploadForm) =>
    axios.post('/api/board', data).then((res) => res.data);
  const { mutate, isLoading } = useMutation<
    boardUploadResponse,
    any,
    boardUploadForm
  >(boardUpload);
  const onValid = ({ title, description }: boardUploadForm) => {
    if (isLoading) return;
    console.log(title, description);
    mutate({ title, description });
  };
  console.log(isLoading);
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <Input
          label="title"
          name="title"
          required
          register={register('title', { required: true })}
        />
        <TextArea
          name="description"
          register={register('description', { required: true })}
        />
        <Button isLoading={isLoading} text="등록" />
      </form>
    </div>
  );
};

export default Upload;
