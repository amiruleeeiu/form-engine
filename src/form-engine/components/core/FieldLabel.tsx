import React from "react";
import { cn } from "../../utils/cn.js";

interface FieldLabelProps {
  htmlFor: string;
  label: string;
  required?: boolean;
  className?: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
  htmlFor,
  label,
  required = false,
  className,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-gray-700 mb-1.5",
        className
      )}
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};
