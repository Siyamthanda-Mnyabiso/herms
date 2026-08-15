import { User } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export default function BookingCard({ name, role, dates, status }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <User className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">{dates}</span>
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
