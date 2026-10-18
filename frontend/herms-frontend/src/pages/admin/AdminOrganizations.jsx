import { useCallback, useEffect, useState } from "react";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import { useNotification } from "../../hooks/useNotification.js";
import { approveOrganization, getOrganizations, rejectOrganization } from "../../services/adminService";

const FILTERS = ["PENDING", "ACTIVE", "REJECTED"];

export default function AdminOrganizations() {
  const [status, setStatus] = useState("PENDING");
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOrganizations(await getOrganizations(status));
    } catch (err) {
      notify(err.response?.data ?? "Could not load organizations.", "error");
    } finally {
      setLoading(false);
    }
  }, [status, notify]);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(action, accountId) {
    try {
      await action(accountId);
      await load();
    } catch (err) {
      notify(err.response?.data ?? "Action failed.", "error");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Organizations</h1>

      <div className="flex gap-1 rounded-xl bg-white p-1 shadow-sm w-fit">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatus(f)}
            className={[
              "rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors",
              status === f ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:bg-gray-50",
            ].join(" ")}
          >
            {f.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400">
              <th className="px-5 py-3 font-medium">Organization</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Address</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && organizations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-gray-400">
                  No {status.toLowerCase()} organizations.
                </td>
              </tr>
            )}
            {organizations.map((org) => (
              <tr key={org.accountId} className="border-b border-gray-50 last:border-b-0">
                <td className="px-5 py-3 font-medium text-gray-900">{org.name}</td>
                <td className="px-5 py-3 capitalize text-gray-600">{org.role}</td>
                <td className="px-5 py-3 text-gray-600">
                  {org.email}
                  <br />
                  {org.phoneNumber}
                </td>
                <td className="px-5 py-3 text-gray-500">{org.address}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={org.status} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    {org.status !== "ACTIVE" && (
                      <Button size="sm" onClick={() => decide(approveOrganization, org.accountId)}>
                        Approve
                      </Button>
                    )}
                    {org.status !== "REJECTED" && (
                      <Button size="sm" variant="danger" onClick={() => decide(rejectOrganization, org.accountId)}>
                        {org.status === "ACTIVE" ? "Revoke" : "Reject"}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
