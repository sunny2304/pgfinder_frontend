import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const UserNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  // ✅ Scroll fix
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ✅ Fetch user
  useEffect(() => {
    if (!token) return;
    axios
      .get("/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.data))
      .catch(() => {});
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

    // 👤 Guest only
    ...(!token
      ? [{ label: "For Landlords", path: "/landlord" }]
      : []),

    // 🔐 Logged-in only
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

      {/* NAVBAR */}
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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-[0.875rem] font-medium px-4 py-2 rounded-lg no-underline transition-colors duration-200 ${
                isActive(link.path)
                  ? "bg-[#f0ede8] text-[#1a2744] font-semibold"
                  : "text-[#6b6560] hover:text-[#1a2744] hover:bg-[#f5f3f0]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2.5">
          {token ? (
            <>
              {/* Logout */}
              <button
                className="hidden md:block text-[0.875rem] font-medium text-[#e05a3a] hover:text-[#c94a2f] bg-transparent border-none cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-[#fdf0ec]"
                onClick={handleLogout}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Logout
              </button>

              {/* Avatar */}
              <button
                className="w-9 h-9 rounded-full bg-[#1a2744] text-white border-none cursor-pointer font-bold text-[0.875rem] flex items-center justify-center hover:bg-[#243356] transition-colors duration-200"
                onClick={() => navigate("/profile")}
                title="My Profile"
              >
                {user ? user.firstName[0].toUpperCase() : "U"}
              </button>
            </>
          ) : (
            <>
              <button
                className="hidden md:block text-[0.875rem] font-medium text-[#1a2744] bg-transparent border-none cursor-pointer hover:text-[#2a7c6f] transition-colors duration-200 px-3 py-2"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>

              <button
                className="hidden md:flex items-center bg-[#1a2744] text-white text-[0.875rem] font-semibold px-5 py-2.5 rounded-[8px] border-none cursor-pointer transition-colors duration-200 hover:bg-[#243356]"
                onClick={() => navigate("/signup")}
              >
                Sign Up Free
              </button>
            </>
          )}

          {/* Mobile Menu */}
          <button
            className="flex md:hidden flex-col gap-[5px]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="w-[22px] h-[2px] bg-[#1a2744]" />
            <span className="w-[22px] h-[2px] bg-[#1a2744]" />
            <span className="w-[22px] h-[2px] bg-[#1a2744]" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed top-[68px] left-0 right-0 bg-white p-4 md:hidden shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="block py-3"
            >
              {link.label}
            </Link>
          ))}

          {token && (
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              My Profile
            </Link>
          )}

          {token ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/signup")}>Signup</button>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <main className="pt-[68px] bg-[#f5f2ed] min-h-screen">
        <Outlet />
      </main>
    </>
  );
};