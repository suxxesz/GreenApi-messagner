import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={`rounded-lg bg-maxblue text-white py-2 text-sm font-medium disabled:opacity-60 transition-opacity ${className}`}
    />
  );
}
