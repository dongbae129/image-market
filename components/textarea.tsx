import { UseFormRegisterReturn } from 'react-hook-form';
import { labelOb } from '@libs/client/data/data';

interface TextAreaProps {
  name?: string;
  register: UseFormRegisterReturn;
  label?: string;
  [key: string]: any;
}
const TextArea = ({ name, label, register, ...rest }: TextAreaProps) => {
  return (
    <>
      {label && <label htmlFor={name}>{labelOb[label]}</label>}

      <textarea
        aria-label={name}
        id={name}
        {...register}
        {...rest}
        placeholder="설명"
      />
      <style jsx>{`
        textarea {
          resize: none;
          outline: 1px solid rgba(0, 0, 0, 0.16);

          border: none;
          width: 100%;
          height: 100%;
          border-radius: 4px;
          /*margin-top: 0.25rem;*/
          padding: 8px;
          padding-left: 15px;
          padding-right: 80px;

          &:focus {
            outline: 3px solid rgb(127, 193, 255);
          }
          :focus::placeholder {
            opacity: 0.5;
          }
          ::placeholder {
            font-size: 1rem;
            font-weight: bold;
          }
        }
        label {
          font-weight: 500;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
      `}</style>
    </>
  );
};

export default TextArea;
