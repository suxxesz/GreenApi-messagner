import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'blue' | 'amber' | 'slate';
};

const TONES: Record<NonNullable<Props['tone']>, string> = {
  blue: 'bg-blue-50 text-maxblue',
  amber: 'bg-amber-50 text-amber-600',
  slate: 'bg-slate-100 text-slate-500',
};

export function Badge({ tone = 'slate', className = '', ...props }: Props) {
  return (
    <span
      {...props}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${TONES[tone]} ${className}`}
    />
  );
}
