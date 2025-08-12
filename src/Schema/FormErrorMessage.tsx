import type { FC } from "react";

interface FormErrorMessageProps {
  message?: string;
}

const FormErrorMessage: FC<FormErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <p className="text-sm text-red-500 mt-1">
      {message}
    </p>
  );
};

export default FormErrorMessage;
