import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className = "", ...props }: InputProps) => {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm text-gray-600">{label}</label>}
      <input
        className={`p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
};
