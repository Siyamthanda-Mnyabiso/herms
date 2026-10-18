import { useState, useCallback } from "react";
import { NotificationContext } from "./objects/notification.js";
import Notification from "../components/common/Notification";

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
