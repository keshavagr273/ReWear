import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ minimal, onOpenListModal }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userPoints, setUserPoints] = useState(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const fetchUserData = (t) => {
    if (t) {
      fetch("/api/user/me", { headers: { Authorization: `Bearer ${t}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) {
            setUserPoints(data.points ?? 0);
            setUserName(data.name || "");
            setUserRole(data.role || "user");
            setUserAvatar(data.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80");
          }
        })
        .catch(() => {});
    } else {
      setUserPoints(null);
      setUserName("");
      setUserRole("");
      setUserAvatar("");
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    fetchUserData(t);
  }, [location]);

  useEffect(() => {
    const handleUpdate = () => {
      const t = localStorage.getItem("token");
      setToken(t);
      fetchUserData(t);
    };
    window.addEventListener("pointsUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("pointsUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  if (minimal) {
    return (
      <header className="w-full border-b border-line bg-paper py-3 px-6 md:px-12 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 group">
            <span className="font-serif font-bold text-2xl tracking-tight text-ink">ReWear</span>
            <span className="tag-hole ml-1"></span>
            <span className="text-[11px] font-medium tracking-normal text-denim border border-line px-1.5 py-0.5 rounded-[2px] bg-canvas">
              EXCHANGE
            </span>
          </Link>
          <Link
            to="/landing"
            className="text-xs text-ink/70 hover:text-ink font-medium transition-colors flex items-center gap-1.5"
          >
            <span>← Return to directory</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant">
      <div className="h-16 max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Section: Wordmark + Search + Links */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <Link to="/landing" className="flex items-center gap-2 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
            <span className="font-serif font-bold text-2xl text-on-surface tracking-tight">ReWear</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant border border-outline-variant px-1.5 py-0.5 rounded">
              EXCHANGE
            </span>
          </Link>

          <div className="relative hidden md:flex items-center max-w-xs w-full">
            <span className="material-symbols-outlined text-outline absolute left-0 text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search inventory, fibers, sizes..."
              className="w-full pl-6 pr-2 py-1 bg-transparent border-0 border-b border-outline-variant font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-b-2 focus:border-primary transition-colors"
            />
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-body-md font-medium">
            <Link
              to="/landing"
              className={`py-1 transition-colors ${
                location.pathname === "/landing" || location.pathname === "/"
                  ? "border-b-2 border-primary text-on-surface font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Browse Directory
            </Link>

            {/* Member Closet — requires login */}
            <Link
              to={token ? "/dashboard" : "/login"}
              className={`py-1 transition-colors flex items-center gap-1 ${
                location.pathname === "/dashboard"
                  ? "border-b-2 border-primary text-on-surface font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Member Closet
              {!token && (
                <span className="material-symbols-outlined text-[13px] opacity-50">lock</span>
              )}
            </Link>

            {/* Depot Ledger — admin only */}
            {userRole === "admin" && (
              <Link
                to="/admin"
                className={`py-1 transition-colors ${
                  location.pathname === "/admin"
                    ? "border-b-2 border-primary text-on-surface font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Depot Ledger
              </Link>
            )}
          </nav>
        </div>

        {/* Right Section: Points + Actions + Profile */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          {token && userPoints !== null && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container border border-outline-variant rounded">
              <span className="w-1.5 h-1.5 rounded-full border border-tertiary-container bg-surface-container-lowest"></span>
              <span className="font-label-sm text-label-sm text-tertiary-container uppercase tracking-wider font-semibold">
                {userPoints} pts
              </span>
            </div>
          )}

          <button
            onClick={() => token
              ? (onOpenListModal ? onOpenListModal() : navigate("/dashboard"))
              : navigate("/login", { state: { from: "/dashboard" } })
            }
            className="hidden sm:inline-flex items-center gap-1.5 border border-on-surface px-3.5 py-1.5 rounded font-label-lg text-label-lg text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>List a garment</span>
          </button>

          {token ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden ring-1 ring-outline-variant hover:ring-primary focus:outline-none transition-all p-0"
                title="Member Menu"
              >
                <img
                  src={userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"}
                  alt="Member Avatar"
                  className="w-full h-full rounded-full object-cover block"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-surface-container-lowest border border-outline-variant rounded py-1 shadow-none z-50">
                  <div className="px-3 py-2 border-b border-outline-variant">
                    <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Signed in as</p>
                    <p className="font-body-sm text-body-sm font-semibold text-on-surface truncate">{userName || "Community Member"}</p>
                    {userPoints !== null && (
                      <span className="inline-block mt-1 text-xs font-semibold text-tertiary-container bg-surface-container px-2 py-0.5 rounded border border-outline-variant">
                        {userPoints} points
                      </span>
                    )}
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span>My Closet &amp; Profile</span>
                  </Link>
                  {userRole === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                      <span>Admin Terminal</span>
                    </Link>
                  )}
                  <Link
                    to="/loading"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                    <span>Textile Protocol Demo</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-body-sm text-error hover:bg-error-container/20 border-t border-outline-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-label-lg font-label-lg text-on-surface hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 bg-primary text-on-primary rounded text-label-lg font-label-lg hover:bg-primary-container transition-colors"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}