import { Bell } from "lucide-react";

export default function TopBar({ initials }) {
  return (
    <header className="flex items-center justify-end gap-4 border-b border-gray-100 bg-white px-6 py-3">
      <button
        type="button"
        aria-label="Notifications"
        className="flex size-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
      >
        <Bell className="size-4" />
      </button>
      <span className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
        {initials}
      </span>
    </header>
  );
}
