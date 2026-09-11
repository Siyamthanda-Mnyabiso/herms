import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { getProfile } from "../services/professionalService";

export function useProfessionalProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(() => {
        if (!user?.role || !user?.refId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        getProfile(user.role, user.refId)
            .then(setProfile)
            .catch(() => setError("Failed to load your profile."))
            .finally(() => setLoading(false));
    }, [user?.role, user?.refId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { user, profile, setProfile, loading, error, refetch };
}
