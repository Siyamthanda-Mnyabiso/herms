import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import SearchBar from "../../components/common/SearchBar";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import { useAdminData } from "../../hooks/useAdminData";
import { ORGANIZATION_ROLE_SET, PROFESSIONAL_ROLE_SET } from "../../utils/adminRoles";

const TABS = {
  "All Users": () => true,
  Professionals: (u) => PROFESSIONAL_ROLE_SET.includes(u.role),
  Organizations: (u) => ORGANIZATION_ROLE_SET.includes(u.role),
  Admins: (u) => u.role === "admin",
};
const PAGE_SIZE = 10;

function downloadCsv(rows) {
  const lines = [["Name", "Email", "Role", "Status"], ...rows.map((u) => [u.name, u.email, u.role, u.status])];
  const csv = lines.map((l) => l.map((c) => `"${String(c ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "users.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminUsers() {
  const { users, loading } = useAdminData();
  const [activeTab, setActiveTab] = useState("All Users");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      users
        .filter(TABS[activeTab])
        .filter((u) => role === "all" || u.role === role)
        .filter((u) => status === "all" || u.status === status)
        .filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())),
    [users, activeTab, role, status, query]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const roles = [...new Set(users.map((u) => u.role))];

  const reset = (setter) => (ev) => {
    setter(ev.target.value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Users</h1>

      <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
        {Object.keys(TABS).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={[
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:bg-gray-50",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <SearchBar placeholder="Search users..." className="max-w-xs" value={query} onChange={reset(setQuery)} />
        <Select
          label="Role"
          value={role}
          onChange={reset(setRole)}
          options={[{ value: "all", label: "All" }, ...roles.map((r) => ({ value: r, label: r }))]}
          containerClassName="w-36"
        />
        <Select
          label="Status"
          value={status}
          onChange={reset(setStatus)}
          options={[
            { value: "all", label: "All" },
            { value: "ACTIVE", label: "Active" },
            { value: "PENDING", label: "Pending" },
            { value: "REJECTED", label: "Rejected" },
          ]}
          containerClassName="w-36"
        />
        <Button variant="secondary" icon={Download} iconPosition="left" className="ml-auto" onClick={() => downloadCsv(filtered)}>
          Export
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-6 text-center text-gray-400">No users found.</td>
              </tr>
            )}
            {pageRows.map((user) => (
              <tr key={user.accountId} className="border-b border-gray-50 last:border-b-0">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </td>
                <td className="px-5 py-3 capitalize text-gray-600">{user.role}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={user.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={current} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
