import { useCallback, useEffect, useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useNotification } from "../../hooks/useNotification.js";
import { createAdmin, getAdmins } from "../../services/adminService";

export default function AdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useNotification();

  const load = useCallback(async () => {
    try {
      setAdmins(await getAdmins());
    } catch (err) {
      notify(err.response?.data ?? "Could not load admins.", "error");
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(ev) {
    ev.preventDefault();
    setSubmitting(true);
    try {
      await createAdmin(email, password);
      setEmail("");
      setPassword("");
      notify("Admin created.", "success");
      await load();
    } catch (err) {
      notify(err.response?.data ?? "Could not create admin.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Admins</h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <Input label="Email" type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} required containerClassName="w-64" />
        <Input
          label="Password (min 8 characters)"
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          minLength={8}
          required
          containerClassName="w-64"
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Add admin"}
        </Button>
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400">
              <th className="px-5 py-3 font-medium">Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.accountId} className="border-b border-gray-50 last:border-b-0">
                <td className="px-5 py-3 text-gray-900">{admin.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
