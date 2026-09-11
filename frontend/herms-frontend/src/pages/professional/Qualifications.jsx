import { useEffect, useState } from "react";
import { useProfessionalProfile } from "../../hooks/useProfessionalProfile";
import { updateProfile } from "../../services/professionalService";
import { useNotification } from "../../context/NotificationContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function Qualifications() {
    const { user, profile, setProfile, loading, error, refetch } = useProfessionalProfile();
    const { notify } = useNotification();
    const [qualification, setQualification] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (profile) setQualification(profile.qualification ?? "");
    }, [profile]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;
    if (!profile) return null;

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await updateProfile(user.role, { ...profile, qualification });
            setProfile(updated);
            notify("Qualification updated", "success");
        } catch (err) {
            console.error("Failed to update qualification:", err);
            notify("Could not update qualification", "error");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Qualifications</h1>
                <p className="text-sm text-gray-500">Your highest professional qualification.</p>
            </div>

            <form onSubmit={handleSave} className="flex max-w-md flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
                <Input
                    label="Qualification"
                    placeholder="e.g. BSc Nursing"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                />
                <Button type="submit" disabled={saving} className="self-start">
                    {saving ? "Saving..." : "Save"}
                </Button>
            </form>
        </div>
    );
}
