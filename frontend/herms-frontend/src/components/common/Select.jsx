import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(function Select(
  { label, options = [], className = "", containerClassName = "", ...props },
  ref
) {
  return (
    <label className={["flex flex-col gap-1.5", containerClassName].join(" ")}>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
      <span className="relative flex items-center">
        <select
          ref={ref}
          className={[
            "w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm text-gray-800",
            "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100",
            className,
          ].join(" ")}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 size-4 text-gray-400" />
      </span>
    </label>
  );
});

export default Select;
