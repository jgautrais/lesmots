import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<SVGElement>;

function EraseIcon({ className, ...props }: Props) {
  return (
    <svg
      {...props}
      className={`h-8 w-8 ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M19 19h-11l-4 -4a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9 9" />
      <path d="M18 12.3l-6.3 -6.3" />
    </svg>
  );
}

export default EraseIcon;
