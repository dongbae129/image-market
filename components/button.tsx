interface buttonProps {
  isLoading: boolean;
  text: string;
  [key: string]: any;
}
const Button = ({
  isLoading,
  register,
  required,
  text,
  ...rest
}: buttonProps) => {
  return <button {...rest}>{isLoading ? 'Loading...' : text}</button>;
};

export default Button;
