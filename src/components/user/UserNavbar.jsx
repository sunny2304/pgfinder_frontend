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
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const token = localStorage.getItem("token");

  useEffect(() => {
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

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Browse PGs", path: "/browse" },

    // Only when NOT logged in
    ...(!token
      ? [{ label: "For Landlords", path: "/landlord" }]
      : []),

    // Only when logged in
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
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between h-[68px] px-6 lg:px-14 bg-white border-b border-[#e8e5e0]"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {/* Logo */}
        <span
          className="text-[1.5rem] font-black text-[#1a2744] tracking-[-0.5px] cursor-pointer flex-shrink-0 select-none"
          style={{ fontFamily: "'Fraunces', serif" }}
          onClick={() => navigate("/")}
        >
          PG<em className="text-[#2a7c6f] not-italic">Finder</em>
        </span>

        {/* Desktop centre links — absolutely centred */}
        <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-[0.875rem] font-medium px-4 py-2 rounded-lg no-underline transition-colors duration-200 ${isActive(link.path)
                ? "bg-[#f0ede8] text-[#1a2744] font-semibold"
                : "text-[#6b6560] hover:text-[#1a2744] hover:bg-[#f5f3f0]"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          {token ? (
            /* Logged-in state: Browse text link + dark avatar circle */
            <>
              <button
                className="hidden md:block text-[0.875rem] font-medium text-[#e05a3a] hover:text-[#c94a2f] bg-transparent border-none cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-[#fdf0ec]"
                onClick={handleLogout}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Logout
              </button>
              <button
                className="w-9 h-9 rounded-full bg-[#1a2744] text-white border-none cursor-pointer font-bold text-[0.875rem] flex items-center justify-center hover:bg-[#243356] flex-shrink-0 transition-colors duration-200"
                onClick={() => navigate("/profile")}
                title="My Profile"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {user ? user.firstName[0].toUpperCase() : "U"}
              </button>
            </>
          ) : (
            /* Guest state: "Log In" text + dark "Sign Up Free" pill button */
            <>
              <button
                className="hidden md:block text-[0.875rem] font-medium text-[#1a2744] bg-transparent border-none cursor-pointer hover:text-[#2a7c6f] transition-colors duration-200 px-3 py-2"
                onClick={() => navigate("/login")}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Log In
              </button>
              <button
                className="hidden md:flex items-center bg-[#1a2744] text-white text-[0.875rem] font-semibold px-5 py-2.5 rounded-[8px] border-none cursor-pointer transition-colors duration-200 hover:bg-[#243356] whitespace-nowrap"
                onClick={() => navigate("/signup")}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Sign Up Free
              </button>
            </>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="flex md:hidden flex-col justify-center gap-[5px] cursor-pointer bg-transparent border-none p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-[22px] h-[2px] bg-[#1a2744] rounded-sm" />
            <span className="block w-[22px] h-[2px] bg-[#1a2744] rounded-sm" />
            <span className="block w-[22px] h-[2px] bg-[#1a2744] rounded-sm" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          className="fixed top-[68px] left-0 right-0 z-[499] bg-white border-b border-[#e8e5e0] shadow-lg flex flex-col px-5 py-3 gap-0.5 md:hidden"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`px-4 py-3 rounded-[10px] text-[0.9rem] font-medium no-underline transition-colors duration-200 ${isActive(link.path)
                ? "bg-[#f0ede8] text-[#1a2744] font-semibold"
                : "text-[#3d3730] hover:bg-[#f5f3f0] hover:text-[#1a2744]"
                }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {token && (
            <Link to="/user/profile" className="px-4 py-3 rounded-[10px] text-[0.9rem] font-medium text-[#3d3730] no-underline hover:bg-[#f5f3f0] hover:text-[#1a2744] transition-colors duration-200" onClick={() => setMenuOpen(false)}>My Profile</Link>
          )}
          <div className="h-px bg-[#e8e5e0] my-2" />
          {token ? (
            <button
              className="px-4 py-3 rounded-[10px] text-[0.9rem] font-semibold text-[#e05a3a] bg-transparent border-none cursor-pointer text-left hover:bg-[#fdf0ec] transition-colors duration-200"
              onClick={handleLogout}
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Logout
            </button>
          ) : (
            <>
              <button className="px-4 py-3 rounded-[10px] text-[0.9rem] font-medium text-[#1a2744] bg-transparent border-none cursor-pointer text-left hover:bg-[#f5f3f0] transition-colors duration-200" onClick={() => { navigate("/login"); setMenuOpen(false); }} style={{ fontFamily: "'Outfit', sans-serif" }}>Log In</button>
              <button className="mx-4 mb-1 py-3 rounded-[8px] text-[0.9rem] font-semibold text-white bg-[#1a2744] border-none cursor-pointer hover:bg-[#243356] transition-colors duration-200" onClick={() => { navigate("/signup"); setMenuOpen(false); }} style={{ fontFamily: "'Outfit', sans-serif" }}>Sign Up Free</button>
            </>
          )}
        </div>
      )}

      {/* Page content */}
      <main className="pt-[68px] bg-[#f5f2ed] min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <Outlet />
      </main>
    </>
  );
};