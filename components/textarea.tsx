import { UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaProps {
  name?: string;
  register: UseFormRegisterReturn;
  [key: string]: any;
}
const TextArea = ({ name, register, ...rest }: TextAreaProps) => {
  return (
    <>
      <textarea id={name} {...register} {...rest} placeholder="댓글 추가" />
      <style jsx>{`
        textarea {
          resize: none;
          outline: none;
          width: 100%;
          height: 100%;
          border-radius: 14px;
          border: none;
          padding: 8px;
          padding-left: 15px;
          padding-right: 80px;

          :focus::placeholder {
            opacity: 0.5;
          }
          ::placeholder {
            font-size: 1rem;
            font-weight: bold;
          }
        }
      `}</style>
    </>
  );
};

export default TextArea;
