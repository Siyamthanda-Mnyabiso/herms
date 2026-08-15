const STATUS_STYLES = {
  pending: "text-status-pending bg-status-pending-bg",
  accepted: "text-status-accepted bg-status-accepted-bg",
  confirmed: "text-status-confirmed bg-status-confirmed-bg",
  completed: "text-status-completed bg-status-completed-bg",
  declined: "text-status-declined bg-status-declined-bg",
  expired: "text-status-expired bg-status-expired-bg",
  active: "text-status-accepted bg-status-accepted-bg",
  inactive: "text-status-expired bg-status-expired-bg",
  available: "text-status-accepted bg-status-accepted-bg",
};

export default function StatusBadge({ status, className = "" }) {
  const key = String(status).toLowerCase();
  const style = STATUS_STYLES[key] ?? "text-gray-600 bg-gray-100";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        style,
        className,
      ].join(" ")}
    >
      {status}
    </span>
  );
}
