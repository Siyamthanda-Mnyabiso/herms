import { useEffect, useState } from "react";
import Select from "../../components/common/Select";
import Pagination from "../../components/common/Pagination";
import { useNotification } from "../../context/NotificationContext";
import { getAuditLogs } from "../../services/adminService";

const ACTIONS = [
  "LOGIN",
  "LOGIN_FAILED",
  "LOGIN_BLOCKED",
  "REGISTER_PROFESSIONAL",
  "REGISTER_ORGANIZATION",
  "ORGANIZATION_APPROVED",
  "ORGANIZATION_REJECTED",
  "ADMIN_CREATED",
];

export default function AdminAuditLogs() {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [action, setAction] = useState("all");
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAuditLogs({ page: page - 1, action: action === "all" ? undefined : action })
      .then((data) => {
        if (active) {
          setEntries(data.entries);
          setTotalPages(Math.max(1, data.totalPages));
        }
      })
      .catch((err) => notify(err.response?.data ?? "Could not load audit logs.", "error"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [page, action, notify]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Audit Logs</h1>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <Select
          label="Action"
          value={action}
          onChange={(ev) => {
            setAction(ev.target.value);
            setPage(1);
          }}
          options={[{ value: "all", label: "All" }, ...ACTIONS.map((a) => ({ value: a, label: a }))]}
          containerClassName="w-60"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400">
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Who</th>
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="px-5 py-3 font-medium">Target</th>
              <th className="px-5 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {!loading && entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-400">No entries yet.</td>
              </tr>
            )}
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 last:border-b-0">
                <td className="whitespace-nowrap px-5 py-3 text-gray-500">{new Date(e.createdAt).toLocaleString()}</td>
                <td className="px-5 py-3 text-gray-900">{e.actor}</td>
                <td className="px-5 py-3 font-medium text-gray-700">{e.action}</td>
                <td className="px-5 py-3 text-gray-600">{e.target ?? "—"}</td>
                <td className="px-5 py-3 text-gray-500">{e.details ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
