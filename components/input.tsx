import { UseFormRegisterReturn } from 'react-hook-form';
import { useState } from 'react';
interface InputProps {
  label?: string;
  name: string;
  required?: boolean;
  register?: UseFormRegisterReturn;
  imgbool?: string;
  [key: string]: any;
}

const Input = ({
  label,
  name,
  required,
  register,
  paddingleft,
  classname,
  imgbool,
  type,
  ...rest
}: InputProps) => {
  return (
    <div className={classname ? classname : 'inputwrap'}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <div className="input-div">
        <input
          id={name}
          required={required}
          type={type}
          {...register}
          {...rest}
        />
      </div>

      <style jsx>{`
        .inputwrap {
          display: ${imgbool === 'false' ? 'none' : 'block'};
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
        }

        input {
          width: ${type === 'checkbox' ? '2rem' : '100%'};
          height: ${type === 'checkbox' ? '2rem' : '100%'};
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
};
export default Input;
