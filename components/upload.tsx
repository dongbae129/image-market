import Button from '@components/button';
import Input from '@components/input';
import TextArea from '@components/textarea';
import axios from 'axios';
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
interface uploadProps {
  url: string;
}
const Upload = ({ url }: uploadProps) => {
  const { register, handleSubmit } = useForm<boardUploadForm>();
  const boardUpload = (data: boardUploadForm) =>
    axios.post(`/api/${url}`, data).then((res) => res.data);
  const { mutate, isLoading } = useMutation<
    boardUploadResponse,
    any,
    boardUploadForm
  >(boardUpload);
  const onValid = ({ title, description }: boardUploadForm) => {
    if (isLoading) return;
    mutate({ title, description });
  };
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
