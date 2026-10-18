import { useMemo, useState } from "react";
import SearchBar from "../../components/common/SearchBar";
import Select from "../../components/common/Select";
import StatusBadge from "../../components/common/StatusBadge";
import { useAdminData } from "../../hooks/useAdminData";
import { PROFESSIONAL_ROLE_SET } from "../../utils/adminRoles";

export default function AdminProfessionals() {
  const { users, loading } = useAdminData();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");

  const professionals = useMemo(
    () =>
      users
        .filter((u) => PROFESSIONAL_ROLE_SET.includes(u.role))
        .filter((u) => role === "all" || u.role === role)
        .filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())),
    [users, query, role]
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Professionals</h1>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <SearchBar
          placeholder="Search professionals..."
          className="max-w-xs"
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
        />
        <Select
          label="Profession"
          value={role}
          onChange={(ev) => setRole(ev.target.value)}
          options={[{ value: "all", label: "All" }, ...PROFESSIONAL_ROLE_SET.map((r) => ({ value: r, label: r }))]}
          containerClassName="w-40"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Profession</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && professionals.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-gray-400">No professionals found.</td>
              </tr>
            )}
            {professionals.map((p) => (
              <tr key={p.accountId} className="border-b border-gray-50 last:border-b-0">
                <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-5 py-3 capitalize text-gray-600">{p.role}</td>
                <td className="px-5 py-3 text-gray-600">{p.email}</td>
                <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
