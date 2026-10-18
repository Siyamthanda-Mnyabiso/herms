import { NavLink, Outlet } from "react-router-dom";

const TABS = [
    { label: "Pending", to: "/organization/bookings", end: true },
    { label: "Accepted", to: "/organization/bookings/accepted" },
    { label: "Confirmed", to: "/organization/bookings/confirmed" },
    { label: "Declined", to: "/organization/bookings/declined" },
    { label: "Expired", to: "/organization/bookings/expired" },
    { label: "History", to: "/organization/bookings/history" },
];

export default function BookingsLayout() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
                {TABS.map(({ label, to, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            [
                                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:bg-gray-50",
                            ].join(" ")
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </div>
            <Outlet />
        </div>
    );
}
