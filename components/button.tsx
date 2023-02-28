interface buttonProps {
  isLoading: boolean;
  text: string;
  color?: string | undefined;
  [key: string]: any;
}
const Button = ({
  isLoading,
  register,
  required,
  text,
  color,
  ...rest
}: buttonProps) => {
  return (
    <>
      <button {...rest}>{isLoading ? 'Loading...' : text}</button>
      <style jsx>{`
        button {
          cursor: pointer;
          background-color: ${color || '#228be6'};
          color: ${color ? '#000' : '#fff'};
          border: none;
          padding: 0.5rem;
          width: 100%;
          min-width: 90px;
          font-weight: 600;
          font-size: 1.25rem;
          border-radius: 4px;
          letter-spacing: 2px;
          :hover {
            filter: brightness(0.8);
          }
        }
      `}</style>
    </>
  );
};

export default Button;
