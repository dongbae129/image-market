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
  return (
    <>
      <button {...rest}>{isLoading ? 'Loading...' : text}</button>
      <style jsx>{`
        button {
          cursor: pointer;
          background-color: #228be6;
          color: white;
          border: none;
          padding: 0.5rem;
          width: 100%;
          font-weight: 500;
          font-size: 1.25rem;
          border-radius: 4px;
          letter-spacing: 2px;
          :hover {
            background-color: #1c7ed6;
          }
        }
      `}</style>
    </>
  );
};

export default Button;
