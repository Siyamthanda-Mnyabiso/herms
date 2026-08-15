import { useState } from "react";
import { Download } from "lucide-react";
import SearchBar from "../../components/common/SearchBar";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";

const TABS = ["All Users", "Professionals", "Organizations", "Admins"];

const USERS = [];

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState("All Users");
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Users</h1>

      <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={[
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab
                ? "bg-primary-50 text-primary-600"
                : "text-gray-500 hover:bg-gray-50",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <SearchBar placeholder="Search users..." className="max-w-xs" />
        <Select
          label="Role"
          options={[{ value: "all", label: "All" }]}
          containerClassName="w-36"
        />
        <Select
          label="Status"
          options={[{ value: "all", label: "All" }]}
          containerClassName="w-36"
        />
        <Button variant="secondary" icon={Download} iconPosition="left" className="ml-auto">
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
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((user) => (
              <tr key={user.name} className="border-b border-gray-50 last:border-b-0">
                <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                <td className="px-5 py-3 text-gray-600">{user.role}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-5 py-3 text-gray-500">{user.joined}</td>
                <td className="px-5 py-3 text-gray-400">···</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={1} onPageChange={setPage} />
    </div>
  );
}
