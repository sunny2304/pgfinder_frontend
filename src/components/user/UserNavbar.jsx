import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const UserNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status using token
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Do not call API if user is not logged in
    if (!token) return;

    axios
      .get("/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.data))
      .catch(() => { });
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // Show limited links for guest, full links for logged in user
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Browse PGs", path: "/browse" },

    ...(token
      ? [
        { label: "My Bookings", path: "/bookings" },
        { label: "Saved PGs", path: "/savedpgs" },
      ]
      : []),
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

        @media (max-width: 900px) {
          .pgf-nav { padding: 0 20px; }
          .pgf-nav-center { display: none; }
          .pgf-logout-btn { display: none; }
          .pgf-hamburger { display: flex; }
        }
      `}</style>

      <nav className="pgf-nav">
        <span className="pgf-logo" onClick={() => navigate("/")}>
          PG<em>Finder</em>
        </span>

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

          {/* Show landlord option only for guest users */}
          {!token && (
            <Link to="/landlord" className="pgf-nav-link">
              For Landlords
            </Link>
          )}
        </div>

        <div className="pgf-nav-right">
          {/* Show Login if not logged in, else Logout */}
          {!token ? (
            <button
              className="pgf-logout-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <>
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
            </>
          )}

          <button
            className={`pgf-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="pgf-mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`pgf-mobile-link${isActive(link.path) ? " active" : ""
                }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!token && (
            <Link
              to="/landlord"
              className="pgf-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              For Landlords
            </Link>
          )}

          {token && (
            <Link
              to="/user/profile"
              className="pgf-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              My Profile
            </Link>
          )}

          <div className="pgf-mobile-divider" />

          {!token ? (
            <button
              className="pgf-mobile-link"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <button className="pgf-mobile-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      )}

      <main style={{ paddingTop: 68, background: "#f5f2ed", minHeight: "100vh" }}>
        <Outlet />
      </main>
    </>
  );
};