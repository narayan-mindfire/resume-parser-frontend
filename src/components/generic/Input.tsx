import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  textarea?: boolean;
  accept?: string;
  className?: string;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  register,
  error,
  textarea = false,
  accept,
  className = "",
}: InputFieldProps) {
  const inputId = register.name;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="block mb-1 text-[var(--text)]">
        {label}
      </label>
      {textarea ? (
        <textarea
          {...register}
          id={inputId}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-lg bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      ) : (
        <input
          type={type}
          {...register}
          id={inputId}
          placeholder={placeholder}
          accept={accept}
          className="w-full px-4 py-2 border rounded-lg bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      )}
      {error && (
        <p className="text-[var(--primary)] text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}
