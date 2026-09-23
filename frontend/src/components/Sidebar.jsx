import { NavLink } from "react-router-dom";
import { LayoutDashboard, Dumbbell, ClipboardPlus, ChartNoAxesCombined, LogOut } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/workouts", label: "Workouts", icon: ClipboardPlus },
  { to: "/exercises", label: "Exercises", icon: Dumbbell },
  { to: "/progress", label: "Progress", icon: ChartNoAxesCombined }
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <Logo />
      <div className="sidebar-line" />

      <nav>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="profile-mini">
          <div className="avatar">{user?.name?.slice(0, 1).toUpperCase()}</div>
          <div>
            <b>{user?.name}</b>
            <small>Member</small>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
