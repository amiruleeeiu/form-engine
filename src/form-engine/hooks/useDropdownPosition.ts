import { useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";

interface UseDropdownPositionProps<T extends HTMLElement = HTMLElement> {
  isOpen: boolean;
  triggerRef: React.RefObject<T | null>;
  dropdownHeight?: number;
}

export function useDropdownPosition<T extends HTMLElement = HTMLElement>({
  isOpen,
  triggerRef,
  dropdownHeight = 300,
}: UseDropdownPositionProps<T>) {
  const [position, setPosition] = useState<"bottom" | "top">("bottom");

  useLayoutEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      // Show dropdown above if not enough space below and more space above
      const newPosition =
        spaceBelow < dropdownHeight && spaceAbove > spaceBelow
          ? "top"
          : "bottom";
      flushSync(() => {
        setPosition(newPosition);
      });
    }
  }, [isOpen, dropdownHeight, triggerRef]);

  return position;
}
