import { createContext, useContext, useState, useCallback } from "react";
import Notification from "../components/common/Notification";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const notify = useCallback((message, type = "error") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    }, []);

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <Notification
                message={notification?.message}
                type={notification?.type}
                onClose={() => setNotification(null)}
            />
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}