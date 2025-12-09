import React from "react";

interface PlusProps {
  className?: string;
  size?: number;
}

export const Plus: React.FC<PlusProps> = ({ className, size = 24 }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      width={size}
      height={size}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
    </svg>
  );
};
