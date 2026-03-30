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
    { label: "Home", path: "/user/home" },
    { label: "Browse PGs", path: "/user/browse" },
    ...(token
      ? [
          { label: "My Bookings", path: "/user/bookings" },
          { label: "Saved PGs", path: "/user/savedpgs" },
        ]
      : []),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
      `}</style>

      <nav
        className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between h-[68px] px-14 bg-white/[0.93] backdrop-blur-xl border-b border-[#e2ddd6] shadow-[0_1px_0_rgba(26,39,68,0.04)]"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {/* Logo */}
        <span
          className="text-[1.55rem] font-black text-[#1a2744] tracking-[-0.5px] cursor-pointer flex-shrink-0"
          style={{ fontFamily: "'Fraunces', serif" }}
          onClick={() => navigate("/user/home")}
        >
          PG<em className="text-[#2a7c6f] not-italic">Finder</em>
        </span>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-0.5 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-[0.87rem] font-medium px-3.5 py-2 rounded-lg no-underline transition-all duration-300 ${
                isActive(link.path)
                  ? "bg-[#f0ede8] text-[#1a2744]"
                  : "text-[#8a7f74] hover:bg-[#f0ede8] hover:text-[#1a2744]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/landlord"
            className="text-[0.87rem] font-medium px-3.5 py-2 rounded-lg no-underline text-[#8a7f74] hover:bg-[#f0ede8] hover:text-[#1a2744] transition-all duration-300"
          >
            For Landlords
          </Link>
          <Link
            to="/admin"
            className={`text-[0.87rem] font-medium px-3.5 py-2 rounded-lg no-underline transition-all duration-300 ${
              isActive("/admin")
                ? "bg-[#f0ede8] text-[#1a2744]"
                : "text-[#8a7f74] hover:bg-[#f0ede8] hover:text-[#1a2744]"
            }`}
          >
            Admin
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            className="hidden md:block text-[0.87rem] font-medium text-[#8a7f74] hover:text-[#1a2744] bg-transparent border-none cursor-pointer transition-colors duration-200"
            onClick={() => navigate("/user/browse")}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Browse
          </button>

          {/* Avatar - always visible when logged in */}
          {token ? (
            <button
              className="w-9 h-9 rounded-full bg-[#1a2744] text-white border-none cursor-pointer font-bold text-[0.88rem] flex items-center justify-center hover:bg-[#243356] flex-shrink-0 transition-colors duration-200"
              onClick={() => navigate("/user/profile")}
              title="My Profile"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {user ? user.firstName[0].toUpperCase() : "P"}
            </button>
          ) : (
            <button
              className="hidden md:block bg-transparent border border-[#e2ddd6] text-[#1a2744] text-[0.87rem] font-semibold px-5 py-2 rounded-[9px] cursor-pointer transition-all duration-300 hover:border-[#1a2744] hover:bg-[#f0ede8]"
              onClick={() => navigate("/")}
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Login
            </button>
          )}

          {/* Hamburger */}
          <button
            className="flex md:hidden flex-col gap-[5px] cursor-pointer bg-transparent border-none p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-[22px] h-[2px] bg-[#1a2744] rounded-sm transition-all duration-300" />
            <span className="block w-[22px] h-[2px] bg-[#1a2744] rounded-sm transition-all duration-300" />
            <span className="block w-[22px] h-[2px] bg-[#1a2744] rounded-sm transition-all duration-300" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          className="fixed top-[68px] left-0 right-0 z-[499] bg-white/[0.98] backdrop-blur-xl border-b border-[#e2ddd6] shadow-lg flex flex-col px-6 py-4 gap-1 md:hidden"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`px-3.5 py-3 rounded-[10px] text-[0.93rem] font-medium no-underline transition-all duration-200 ${
                isActive(link.path)
                  ? "bg-[#f0ede8] text-[#1a2744] font-semibold"
                  : "text-[#3d3730] hover:bg-[#f0ede8] hover:text-[#1a2744]"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/landlord" className="px-3.5 py-3 rounded-[10px] text-[0.93rem] font-medium text-[#3d3730] no-underline hover:bg-[#f0ede8] hover:text-[#1a2744] transition-all duration-200" onClick={() => setMenuOpen(false)}>For Landlords</Link>
          <Link to="/admin" className="px-3.5 py-3 rounded-[10px] text-[0.93rem] font-medium text-[#3d3730] no-underline hover:bg-[#f0ede8] hover:text-[#1a2744] transition-all duration-200" onClick={() => setMenuOpen(false)}>Admin</Link>
          {token && (
            <Link to="/user/profile" className="px-3.5 py-3 rounded-[10px] text-[0.93rem] font-medium text-[#3d3730] no-underline hover:bg-[#f0ede8] hover:text-[#1a2744] transition-all duration-200" onClick={() => setMenuOpen(false)}>My Profile</Link>
          )}
          <div className="h-px bg-[#e2ddd6] my-2" />
          {token ? (
            <button className="px-3.5 py-3 rounded-[10px] text-[0.93rem] font-semibold text-[#e05a3a] bg-transparent border-none cursor-pointer text-left hover:bg-[#fdf0ec] transition-all duration-200 mt-1" onClick={handleLogout} style={{ fontFamily: "'Outfit', sans-serif" }}>
              Logout
            </button>
          ) : (
            <button className="px-3.5 py-3 rounded-[10px] text-[0.93rem] font-medium text-[#3d3730] bg-transparent border-none cursor-pointer text-left hover:bg-[#f0ede8] transition-all duration-200" onClick={() => { navigate("/"); setMenuOpen(false); }} style={{ fontFamily: "'Outfit', sans-serif" }}>
              Login
            </button>
          )}
        </div>
      )}

      <main className="pt-[68px] bg-[#f5f2ed] min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <Outlet />
      </main>
    </>
  );
};