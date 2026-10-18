import { useAuth } from "../../hooks/useAuth";

const capitalize = (value) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : "—");

export default function OrganizationProfile() {
    const { user } = useAuth();

    const fields = [
        { label: "Organization name", value: user?.name },
        { label: "Organization type", value: capitalize(user?.role) },
        { label: "Email", value: user?.email },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Organization Profile</h1>
                <p className="text-sm text-gray-500">Your organization's account details.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
                {fields.map(({ label, value }) => (
                    <div key={label}>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
                    </div>
                ))}
            </div>

            <p className="text-xs text-gray-400">
                Need to change these details? Contact support for changes.
            </p>
        </div>
    );
}
