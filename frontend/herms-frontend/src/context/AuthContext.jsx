import { createContext, useCallback, useState } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

function readStoredUser() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function persist(authResponse) {
    if (!authResponse) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
    }
    const user = {
        role: authResponse.role,
        refId: authResponse.refId,
        name: authResponse.name,
        email: authResponse.email,
    };
    localStorage.setItem("token", authResponse.token);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser);

    const login = useCallback(async (email, password) => {
        const data = await authService.login(email, password);
        setUser(persist(data));
        return data;
    }, []);

    const registerProfessional = useCallback(async (payload) => {
        const data = await authService.registerProfessional(payload);
        setUser(persist(data));
        return data;
    }, []);

    const registerOrganization = useCallback(async (payload) => {
        const data = await authService.registerOrganization(payload);
        setUser(persist(data));
        return data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            persist(null);
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: Boolean(user),
                login,
                registerProfessional,
                registerOrganization,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
