import { useState } from "react";
import { useProfessionalProfile } from "../../hooks/useProfessionalProfile";
import { updateProfile } from "../../services/professionalService";
import { useNotification } from "../../hooks/useNotification.js";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function Availability() {
    const { user, profile, setProfile, loading, error, refetch } = useProfessionalProfile();
    const { notify } = useNotification();
    const [saving, setSaving] = useState(false);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;
    if (!profile) return null;

    const isAvailable = profile.availabilityStatus === "AVAILABLE";

    async function handleToggle() {
        setSaving(true);
        try {
            const nextStatus = isAvailable ? "NOT_AVAILABLE" : "AVAILABLE";
            const updated = await updateProfile(user.role, { ...profile, availabilityStatus: nextStatus });
            setProfile(updated);
            notify("Availability updated", "success");
        } catch (err) {
            console.error("Failed to update availability:", err);
            notify("Could not update availability", "error");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Availability</h1>
                <p className="text-sm text-gray-500">Let organizations know if you're open to new bookings.</p>
            </div>

            <div className="max-w-sm rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">You are available</span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isAvailable}
                        onClick={handleToggle}
                        disabled={saving}
                        className={[
                            "relative h-6 w-11 rounded-full transition-colors disabled:opacity-50",
                            isAvailable ? "bg-primary-500" : "bg-gray-200",
                        ].join(" ")}
                    >
            <span
                className={[
                    "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                    isAvailable ? "translate-x-5.5 left-0.5" : "left-0.5",
                ].join(" ")}
            />
                    </button>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                    {saving
                        ? "Saving..."
                        : isAvailable
                            ? "Organizations can currently book you."
                            : "You won't appear as available to organizations."}
                </p>
            </div>
        </div>
    );
}
