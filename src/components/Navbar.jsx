import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getUnreadCount } from "../api/chat";
import pawsLogo from "../assets/paws-logo.png";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const poll = () =>
      getUnreadCount()
        .then((d) => active && setUnread(d.unreadCount))
        .catch(() => {});
    poll();
    const id = setInterval(poll, 15000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [user?.id]);

  const links = [
    { to: "/browse", label: "Browse" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    ...(user ? [{ to: "/messages", label: "Messages", badge: unread }] : []),
    ...(user
      ? [{ to: user.role === "Seller" ? "/dashboard/seller" : "/dashboard/buyer", label: "Dashboard" }]
      : []),
  ];

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <NavLink to="/" className="nav-brand">
            <img src={pawsLogo} alt="Paws Next Door" className="nav-brand-logo" />
          </NavLink>
          <nav className="nav-links">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                {l.label}
                {!!l.badge && <span className="nav-badge">{l.badge}</span>}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            {user ? (
              <>
                <NavLink to="/profile" className="nav-user">
                  {user.firstName}
                </NavLink>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-ghost btn-sm">
                  Sign in
                </NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm">
                  Join
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      {user && (
        <nav className="mobile-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `mobile-nav-link${isActive ? " active" : ""}`}
            >
              {l.label}
              {!!l.badge && <span className="nav-badge">{l.badge}</span>}
            </NavLink>
          ))}
          <NavLink to="/profile" className={({ isActive }) => `mobile-nav-link${isActive ? " active" : ""}`}>
            Profile
          </NavLink>
        </nav>
      )}
    </>
  );
}
