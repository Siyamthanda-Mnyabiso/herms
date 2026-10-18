import { useEffect, useState } from "react";
import { getAllBookings, getUsers } from "../services/adminService";
import { useNotification } from "../hooks/useNotification.js";

// Loads the account list and bookings that the admin pages summarize.
export function useAdminData() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();

  useEffect(() => {
    let active = true;
    Promise.all([getUsers(), getAllBookings()])
      .then(([u, b]) => {
        if (active) {
          setUsers(u);
          setBookings(b);
        }
      })
      .catch((err) => notify(err.response?.data ?? "Could not load admin data.", "error"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [notify]);

  return { users, bookings, loading };
}
