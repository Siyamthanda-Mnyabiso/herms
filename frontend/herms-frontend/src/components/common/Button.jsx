import { forwardRef } from "react";

const VARIANTS = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 focus-visible:outline-primary-500",
  secondary:
    "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 focus-visible:outline-gray-300",
  outline:
    "bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50 focus-visible:outline-primary-500",
  amber:
    "bg-accent-amber-400 text-sidebar hover:bg-accent-amber-500 focus-visible:outline-accent-amber-500",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:outline-gray-300",
  danger:
    "bg-white text-status-declined border border-gray-200 hover:bg-status-declined-bg focus-visible:outline-status-declined",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2",
};

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "right",
    fullWidth = false,
    className = "",
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={[
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="size-4" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="size-4" />}
    </button>
  );
});

export default Button;
