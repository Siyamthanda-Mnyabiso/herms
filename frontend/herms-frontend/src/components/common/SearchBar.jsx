import { Search } from "lucide-react";

export default function SearchBar({
  placeholder = "Search...",
  className = "",
  ...props
}) {
  return (
    <span className="relative flex flex-1 items-center">
      <Search className="pointer-events-none absolute left-3 size-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        className={[
          "w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-800",
          "placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100",
          className,
        ].join(" ")}
        {...props}
      />
    </span>
  );
}
