interface InputProps {
  label: string;
  name: string;
  required?: boolean;
  [key: string]: any;
}

export default function Input({
  label,
  name,
  required,
  register,
  ...rest
}: InputProps) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <div>
        <input id={name} required={required} {...register} {...rest} />
      </div>
    </div>
  );
}
