import React, { FC } from "react";

interface IErrorMessageProps {
  message: string;
}

const ErrorMessage: FC<IErrorMessageProps> = ({ message }) => {
  return (
    <div className="border-2 px-4 py-2 rounded-md font-medium text-md backdrop-filter backdrop-blur-md mt-4 max-w-xl mx-auto border-red-500 bg-red-400/60 text-red-700">
      <p>Error: {message}</p>
    </div>
  );
};

export default ErrorMessage;
