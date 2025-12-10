import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "../../assets/icons/index.js";
import { cn } from "../../utils/cn.js";

interface MonthYearSelectorProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  className?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  currentMonth,
  onMonthChange,
  className,
}) => {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 200 }, (_, i) => currentYear - 150 + i);

  const handleMonthChange = (monthValue: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthValue);
    onMonthChange(newDate);
    setIsMonthOpen(false);
  };

  const handleYearChange = (yearValue: number) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(yearValue);
    onMonthChange(newDate);
    setIsYearOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthRef.current &&
        !monthRef.current.contains(event.target as Node)
      ) {
        setIsMonthOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("flex gap-2", className)}>
      {/* Month Selector */}
      <div className="relative flex-1" ref={monthRef}>
        <button
          type="button"
          onClick={() => setIsMonthOpen(!isMonthOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors"
        >
          <span className="text-gray-900">
            {MONTHS[currentMonth.getMonth()]}
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              isMonthOpen && "transform rotate-180"
            )}
          />
        </button>

        {isMonthOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto py-1">
            {MONTHS.map((month, index) => (
              <div
                key={month}
                onClick={() => handleMonthChange(index)}
                className={cn(
                  "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
                  currentMonth.getMonth() === index
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                )}
              >
                {month}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Year Selector */}
      <div className="relative w-24" ref={yearRef}>
        <button
          type="button"
          onClick={() => setIsYearOpen(!isYearOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors"
        >
          <span className="text-gray-900">{currentMonth.getFullYear()}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              isYearOpen && "transform rotate-180"
            )}
          />
        </button>

        {isYearOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto py-1">
            {years.map((year) => (
              <div
                key={year}
                onClick={() => handleYearChange(year)}
                className={cn(
                  "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
                  currentMonth.getFullYear() === year
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                )}
              >
                {year}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
