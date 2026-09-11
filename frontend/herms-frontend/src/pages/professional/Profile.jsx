import { useProfessionalProfile } from "../../hooks/useProfessionalProfile";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

function capitalize(value) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : "—";
}

export default function Profile() {
    const { user, profile, loading, error, refetch } = useProfessionalProfile();

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;
    if (!profile) return null;

    const fields = [
        { label: "First name", value: profile.name?.firstName },
        { label: "Last name", value: profile.name?.lastName },
        { label: "Email", value: profile.contactDetails?.email },
        { label: "Phone number", value: profile.contactDetails?.mobileNumber },
        { label: "Role", value: capitalize(user?.role) },
        { label: "License number", value: profile.licenseNo },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-500">Your account and contact details.</p>
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
                Need to update your name, email or license number? These are locked for
                verification purposes — contact support for changes.
            </p>
        </div>
    );
}
