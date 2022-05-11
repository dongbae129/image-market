import { UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaProps {
  name?: string;
  register: UseFormRegisterReturn;
  [key: string]: any;
}
const TextArea = ({ name, register, ...rest }: TextAreaProps) => {
  return (
    <div>
      <textarea id={name} cols={40} rows={40} {...register} {...rest} />
    </div>
  );
};

export default TextArea;
