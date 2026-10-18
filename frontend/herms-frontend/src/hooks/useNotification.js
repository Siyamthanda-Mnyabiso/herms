import { useContext } from "react";
import { NotificationContext } from "../context/objects/notification.js";

export function useNotification() {
    return useContext(NotificationContext);
}
