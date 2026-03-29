import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const UserNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get("/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const navLinks = [
    { label: "Home", path: "/user/home" },
    { label: "Browse PGs", path: "/user/browse" },
    { label: "My Bookings", path: "/user/bookings" },
    { label: "Saved PGs", path: "/user/savedpgs" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .pgf-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 500;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 56px; height: 68px;
          background: rgba(255,255,255,0.93);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid #e2ddd6;
          box-shadow: 0 1px 0 rgba(26,39,68,0.04);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }

        .pgf-logo {
          font-family: 'Fraunces', serif;
          font-size: 1.55rem; font-weight: 900;
          color: #1a2744; letter-spacing: -0.5px; cursor: pointer;
          text-decoration: none; flex-shrink: 0;
        }
        .pgf-logo em { color: #2a7c6f; font-style: normal; }

        .pgf-nav-center {
          display: flex; gap: 2px; align-items: center;
        }

        .pgf-nav-link {
          background: none; border: none; cursor: pointer;
          color: #8a7f74;
          font-family: 'Outfit', sans-serif;
          font-size: 0.87rem; font-weight: 500;
          padding: 8px 14px; border-radius: 8px;
          text-decoration: none; display: inline-flex; align-items: center;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .pgf-nav-link:hover { background: #f0ede8; color: #1a2744; }
        .pgf-nav-link.active { background: #f0ede8; color: #1a2744; }

        .pgf-nav-right { display: flex; align-items: center; gap: 8px; }

        .pgf-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: #1a2744; color: #fff;
          border: none; cursor: pointer;
          font-weight: 700; font-size: 0.88rem;
          font-family: 'Outfit', sans-serif;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; flex-shrink: 0;
        }
        .pgf-avatar:hover { background: #243356; }

        .pgf-logout-btn {
          background: none;
          border: 1.5px solid #e2ddd6;
          cursor: pointer; color: #1a2744;
          font-family: 'Outfit', sans-serif;
          font-size: 0.87rem; font-weight: 600;
          padding: 8px 20px; border-radius: 9px;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .pgf-logout-btn:hover { border-color: #1a2744; background: #f0ede8; }

        /* Hamburger */
        .pgf-hamburger {
          display: none;
          flex-direction: column; gap: 5px; cursor: pointer;
          background: none; border: none; padding: 4px;
        }
        .pgf-hamburger span {
          display: block; width: 22px; height: 2px;
          background: #1a2744; border-radius: 2px;
          transition: all 0.3s ease;
        }
        .pgf-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .pgf-hamburger.open span:nth-child(2) { opacity: 0; }
        .pgf-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile Drawer */
        .pgf-mobile-menu {
          position: fixed; top: 68px; left: 0; right: 0;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #e2ddd6;
          box-shadow: 0 8px 32px rgba(26,39,68,0.12);
          z-index: 499;
          padding: 16px 24px 24px;
          display: flex; flex-direction: column; gap: 4px;
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pgf-mobile-link {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: 10px;
          color: #3d3730; font-family: 'Outfit', sans-serif;
          font-size: 0.93rem; font-weight: 500;
          text-decoration: none; transition: all 0.2s;
          border: none; background: none; cursor: pointer; width: 100%;
          text-align: left;
        }
        .pgf-mobile-link:hover { background: #f0ede8; color: #1a2744; }
        .pgf-mobile-link.active { background: #f0ede8; color: #1a2744; font-weight: 600; }
        .pgf-mobile-divider {
          height: 1px; background: #e2ddd6; margin: 8px 0;
        }
        .pgf-mobile-logout {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: 10px;
          color: #e05a3a; font-family: 'Outfit', sans-serif;
          font-size: 0.93rem; font-weight: 600;
          border: none; background: none; cursor: pointer; width: 100%;
          text-align: left; transition: background 0.2s;
          margin-top: 4px;
        }
        .pgf-mobile-logout:hover { background: #fdf0ec; }

        /* Responsive */
        @media (max-width: 900px) {
          .pgf-nav { padding: 0 20px; }
          .pgf-nav-center { display: none; }
          .pgf-logout-btn { display: none; }
          .pgf-hamburger { display: flex; }
        }
        @media (max-width: 480px) {
          .pgf-nav { padding: 0 16px; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="pgf-nav">
        {/* Logo */}
        <span className="pgf-logo" onClick={() => navigate("/user/home")}>
          PG<em>Finder</em>
        </span>

        {/* Desktop center links */}
        <div className="pgf-nav-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`pgf-nav-link${isActive(link.path) ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/landlord"
            className="pgf-nav-link"
          >
            For Landlords
          </Link>
        </div>

        {/* Desktop right */}
        <div className="pgf-nav-right">
          <button className="pgf-logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <button
            className="pgf-avatar"
            onClick={() => navigate("/user/profile")}
            title="My Profile"
          >
            {user ? user.firstName[0].toUpperCase() : "P"}
          </button>
          {/* Hamburger */}
          <button
            className={`pgf-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {menuOpen && (
        <div className="pgf-mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`pgf-mobile-link${isActive(link.path) ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/landlord"
            className="pgf-mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            For Landlords
          </Link>
          <Link
            to="/user/profile"
            className="pgf-mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            My Profile
          </Link>
          <div className="pgf-mobile-divider" />
          <button className="pgf-mobile-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <main style={{ paddingTop: 68, background: "#f5f2ed", minHeight: "100vh" }}>
        <Outlet />
      </main>
    </>
  );
};