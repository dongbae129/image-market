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
      {/* <label htmlFor={name}>{label}</label> */}
      <div className="input-div">
        <input id={name} required={required} {...register} {...rest} />
      </div>
      <style jsx>{`
        .inputwrap {
          height: 100%;
        }
        .input-div {
          height: 100%;
        }
        input {
          width: 100%;
          height: 100%;
          border-radius: 15px;
          border: none;
          padding: 2px;
          padding-left: ${paddingleft ? paddingleft : 0};
          font-size: 1rem;
          background-color: rgb(233, 233, 233);
          &:focus {
            outline: 3px solid rgb(127, 193, 255);
          }
        }
      `}</style>
    </div>
  );
}
