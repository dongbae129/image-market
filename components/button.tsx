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
          position: absolute;
          cursor: pointer;
          top: 0;
          margin-top: 7px;
          right: 0.5rem;
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          font-weight: 600;
          font-size: 1rem;

          :hover {
            background-color: #868e96;
          }
        }
      `}</style>
    </>
  );
};

export default Button;
