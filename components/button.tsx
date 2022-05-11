interface buttonProps {
  isLoading: boolean;
  text: string;
}
const Button = ({ isLoading, text }: buttonProps) => {
  return <button>{isLoading ? 'Loading...' : text}</button>;
};

export default Button;
