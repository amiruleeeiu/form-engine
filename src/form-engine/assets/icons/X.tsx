import React from "react";

interface XProps {
  className?: string;
  size?: number;
}

export const X: React.FC<XProps> = ({ className, size = 24 }) => {
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 6L6 18M6 6l12 12"
      />
    </svg>
  );
};
