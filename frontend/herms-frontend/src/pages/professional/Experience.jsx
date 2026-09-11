import { useEffect, useState } from "react";
import { useProfessionalProfile } from "../../hooks/useProfessionalProfile";
import { updateProfile } from "../../services/professionalService";
import { useNotification } from "../../context/NotificationContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function Experience() {
    const { user, profile, setProfile, loading, error, refetch } = useProfessionalProfile();
    const { notify } = useNotification();
    const [yearsOfExperience, setYearsOfExperience] = useState("0");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (profile) setYearsOfExperience(String(profile.yearsOfExperience ?? 0));
    }, [profile]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;
    if (!profile) return null;

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await updateProfile(user.role, {
                ...profile,
                yearsOfExperience: Number(yearsOfExperience) || 0,
            });
            setProfile(updated);
            notify("Experience updated", "success");
        } catch (err) {
            console.error("Failed to update experience:", err);
            notify("Could not update experience", "error");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Experience</h1>
                <p className="text-sm text-gray-500">How many years of experience do you have?</p>
            </div>

            <form onSubmit={handleSave} className="flex max-w-md flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
                <Input
                    label="Years of experience"
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                />
                <Button type="submit" disabled={saving} className="self-start">
                    {saving ? "Saving..." : "Save"}
                </Button>
            </form>
        </div>
    );
}
