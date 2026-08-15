import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, icon: Icon, className = "", containerClassName = "", ...props },
  ref
) {
  return (
    <label className={["flex flex-col gap-1.5", containerClassName].join(" ")}>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
      <span className="relative flex items-center">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 size-4 text-gray-400" />
        )}
        <input
          ref={ref}
          className={[
            "w-full rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-800",
            "placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100",
            Icon ? "pl-9 pr-3" : "px-3",
            className,
          ].join(" ")}
          {...props}
        />
      </span>
    </label>
  );
});

export default Input;
