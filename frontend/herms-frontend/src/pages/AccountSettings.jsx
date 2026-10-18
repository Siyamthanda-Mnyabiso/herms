import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

export default function AccountSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>

      <div className="flex max-w-md flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">Your account</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-900">{user?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Role</dt>
            <dd className="capitalize text-gray-900">{user?.role}</dd>
          </div>
        </dl>
        <Button variant="secondary" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
