import type { SelectHTMLAttributes } from 'react';

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = '', children, ...props }: Props) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-maxblue focus:ring-1 focus:ring-maxblue ${className}`}
    >
      {children}
    </select>
  );
}
