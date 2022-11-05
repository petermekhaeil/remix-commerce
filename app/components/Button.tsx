import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  name,
  type,
  value
}) => {
  return (
    <button
      name={name}
      type={type}
      disabled={disabled}
      value={value}
      className="mt-4 flex w-full items-center justify-center rounded-sm bg-yellow-500 px-8 py-4"
    >
      {children}
    </button>
  );
};

export default Button;
