import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps {
  label?: string;
  name: string;
  required?: boolean;
  register: UseFormRegisterReturn;
  [key: string]: any;
}

export default function Input({
  label,
  name,
  required,
  register,
  paddingleft,
  classname,
  ...rest
}: InputProps) {
  return (
    <div className={classname ? classname : 'inputwrap'}>
      <label htmlFor={name}>{label}</label>
      <div className="input-div">
        <input id={name} required={required} {...register} {...rest} />
      </div>
      <style jsx>{`
        .inputwrap {
          height: 100%;
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
        }
        input {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          border: none;
          padding: 0.5rem;
          padding-left: ${paddingleft ? paddingleft : '0.5rem'};
          font-size: 1rem;
          outline: 1px solid rgba(0, 0, 0, 0.16);

          &:focus {
            outline: 3px solid rgb(127, 193, 255);
          }
        }
      `}</style>
    </div>
  );
}
