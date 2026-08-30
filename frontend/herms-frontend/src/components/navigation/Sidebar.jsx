import { NavLink } from "react-router-dom";
import { Sparkle, LogOut } from "lucide-react";

export default function Sidebar({ sections, user, onLogout }) {
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-sidebar text-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary-500">
          <Sparkle className="size-4" />
        </span>
        <span className="text-base font-bold">HERMS</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="mb-2 px-2 text-[11px] font-semibold tracking-wide text-sidebar-muted">
              {section.title}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map(({ label, icon: Icon, to }) => (
                <NavLink
                  key={label}
                  to={to}
                  end={to.split("/").length <= 3}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent-amber-400 text-sidebar"
                        : "text-gray-300 hover:bg-sidebar-hover",
                    ].join(" ")
                  }
                >
                  <Icon className="size-4" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-sidebar-border px-4 py-4">
        <span className="flex size-9 items-center justify-center rounded-full bg-sidebar-active text-sm font-semibold">
          {user.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-sidebar-muted">{user.role}</p>
        </div>
        {onLogout && (
          <button
            type="button"
            aria-label="Log out"
            onClick={onLogout}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sidebar-muted hover:bg-sidebar-hover hover:text-white"
          >
            <LogOut className="size-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
