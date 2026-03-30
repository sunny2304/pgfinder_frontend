import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    axios
      .get("/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.data))
      .catch(() => {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    if (activeTab !== "bookings") return;
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    axios
      .get(`/users/${userId}/bookings`)
      .then((res) => setBookings(res.data || []))
      .catch(() => setBookings([]));
  }, [activeTab]);

  const statusColor = (status) => {
    if (status === "confirmed") return { bg: "rgba(42,124,111,0.1)", color: "#2a7c6f" };
    if (status === "pending") return { bg: "#fdf6e8", color: "#c8922a" };
    if (status === "cancelled") return { bg: "#fdf0ec", color: "#e05a3a" };
    return { bg: "#f0ede8", color: "#8a7f74" };
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f2ed] flex items-center justify-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="text-center text-[#8a7f74]">
          <div className="text-[2rem] mb-2.5">⏳</div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  const tabs = [
    { key: "bookings", label: "My Bookings" },
    { key: "wishlist", label: "Wishlist" },
    { key: "messages", label: "Messages" },
    { key: "notifications", label: "Notifications" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>
      <div className="bg-[#f5f2ed] min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>

        {/* Profile Header Banner - no top margin/padding, starts right at top of content area */}
        <div className="bg-[#1a2744] px-6 lg:px-14 py-9 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 80% at 80% 50%, rgba(42,124,111,0.25), transparent)" }} />
          <div className="relative flex items-center gap-6 flex-wrap">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#2a7c6f] text-white flex items-center justify-center text-[1.8rem] font-bold border-[3px] border-white/20 flex-shrink-0">
              {initials || "U"}
            </div>
            {/* Info */}
            <div className="flex-1">
              <h1 className="text-[1.7rem] font-bold text-white mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-white/65 text-[0.88rem] mb-3.5">
                {user.email}
                {user.phone && ` · ${user.phone}`}
                {user.createdAt && ` · Member since ${new Date(user.createdAt).toLocaleString("default", { month: "short", year: "numeric" })}`}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-[rgba(42,124,111,0.3)] border border-[rgba(42,124,111,0.5)] text-[#7dd3c8] text-[0.73rem] font-bold py-1 px-3 rounded-[20px]">✓ Verified</span>
                <span className="bg-white/10 border border-white/20 text-white/80 text-[0.73rem] font-semibold py-1 px-3 rounded-[20px] capitalize">{user.role || "Tenant"}</span>
                {user.city && (
                  <span className="bg-white/10 border border-white/20 text-white/80 text-[0.73rem] font-semibold py-1 px-3 rounded-[20px]">📍 {user.city}</span>
                )}
              </div>
            </div>
            {/* Settings button instead of Logout */}
            <button
              onClick={() => setActiveTab("settings")}
              className="bg-white/10 border border-white/30 text-white rounded-[10px] py-2.5 px-6 text-[0.88rem] font-bold cursor-pointer transition-all duration-200 hover:bg-white hover:text-[#1a2744]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-white border-b border-[#e2ddd6]">
          <div className="max-w-[1100px] mx-auto px-10 flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="bg-transparent border-none cursor-pointer text-[0.88rem] px-4 py-4 whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  color: activeTab === tab.key ? "#1a2744" : "#8a7f74",
                  borderBottom: activeTab === tab.key ? "2.5px solid #2a7c6f" : "2.5px solid transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-[1100px] mx-auto px-10 py-9">

          {/* MY BOOKINGS */}
          {activeTab === "bookings" && (
            <div>
              <h2 className="text-[1.35rem] font-bold text-[#1a2744] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>My Bookings</h2>
              {bookings.length === 0 ? (
                <div className="bg-white border border-[#e2ddd6] rounded-[14px] py-14 px-6 text-center">
                  <div className="text-[3rem] mb-4">📋</div>
                  <h3 className="text-[1.2rem] text-[#1a2744] mb-2" style={{ fontFamily: "'Fraunces', serif" }}>No bookings yet</h3>
                  <p className="text-[#8a7f74] text-[0.9rem] mb-6">Start exploring PGs and make your first booking!</p>
                  <button
                    onClick={() => navigate("/user/browse")}
                    className="bg-[#1a2744] text-white border-none rounded-[10px] py-3 px-6 font-semibold cursor-pointer"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Browse PGs →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {bookings.map((b) => {
                    const sc = statusColor(b.bookingStatus);
                    return (
                      <div key={b._id} className="bg-white border border-[#e2ddd6] rounded-[14px] py-[22px] px-[26px] flex items-center gap-5 flex-wrap shadow-[0_2px_12px_rgba(26,39,68,0.06)]">
                        <div className="w-[72px] h-[72px] rounded-[10px] overflow-hidden bg-[#e8f5f3] flex-shrink-0 flex items-center justify-center">
                          <svg width="28" height="28" viewBox="0 0 64 64" fill="none" opacity="0.4">
                            <path d="M10 32L32 14l22 18v20H10V32z" stroke="#2a7c6f" strokeWidth="2.5" fill="#2a7c6f" fillOpacity="0.2" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-[1rem] text-[#1a2744] mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                            {b.pgId?.pgName || "PG Property"}
                          </div>
                          <div className="text-[#8a7f74] text-[0.82rem] mb-2">📍 {b.pgId?.area ? `${b.pgId.area}, ` : ""}{b.pgId?.city}</div>
                          <div className="flex gap-4 text-[0.8rem] text-[#8a7f74] flex-wrap">
                            {b.checkInDate && <span>Check-in: <strong className="text-[#1a2744]">{new Date(b.checkInDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong></span>}
                            {b.roomType && <span>Room: <strong className="text-[#1a2744] capitalize">{b.roomType}</strong></span>}
                            {b.pgId?.rent && <span>Rent: <strong className="text-[#1a2744]">₹{b.pgId.rent?.toLocaleString()}/mo</strong></span>}
                          </div>
                        </div>
                        <div className="text-[0.75rem] font-bold py-1.5 px-3.5 rounded-[20px] capitalize whitespace-nowrap" style={{ background: sc.bg, color: sc.color }}>
                          {b.bookingStatus || "pending"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="bg-white border border-[#e2ddd6] rounded-[14px] py-14 px-14 text-center">
              <div className="text-[3rem] mb-4">❤️</div>
              <h3 className="text-[1.2rem] text-[#1a2744] mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Your wishlist is empty</h3>
              <p className="text-[#8a7f74] text-[0.9rem] mb-6">Save PGs you love and revisit them anytime.</p>
              <button onClick={() => navigate("/user/browse")} className="bg-[#1a2744] text-white border-none rounded-[10px] py-3 px-6 font-semibold cursor-pointer" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Browse PGs →
              </button>
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === "messages" && (
            <div>
              <h2 className="text-[1.35rem] font-bold text-[#1a2744] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>Messages</h2>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] overflow-hidden shadow-[0_2px_16px_rgba(26,39,68,0.08)]">
                {[
                  { name: "Support Team", msg: "Your verification documents have been approved. ✓", time: "2 days ago", initial: "S", color: "#2a7c6f" },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-4 py-[18px] px-6 border-b border-[#e2ddd6]">
                    <div className="w-11 h-11 rounded-full text-white flex items-center justify-center font-bold flex-shrink-0" style={{ background: m.color }}>
                      {m.initial}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[#1a2744] text-[0.9rem] mb-[3px]">{m.name}</div>
                      <div className="text-[#8a7f74] text-[0.82rem]">{m.msg}</div>
                    </div>
                    <div className="text-[#8a7f74] text-[0.75rem]">{m.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-[1.35rem] font-bold text-[#1a2744] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>Notifications</h2>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] overflow-hidden shadow-[0_2px_16px_rgba(26,39,68,0.08)]">
                {[
                  { text: "Welcome to PGFinder! Complete your profile to get started.", time: "Just now", unread: true },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3.5 py-[18px] px-6 border-b border-[#e2ddd6]">
                    <div className="w-[9px] h-[9px] rounded-full mt-[5px] flex-shrink-0" style={{ background: n.unread ? "#2a7c6f" : "#e2ddd6" }} />
                    <div className="flex-1">
                      <div className="text-[#3d3730] text-[0.87rem] leading-[1.55]">{n.text}</div>
                      <div className="text-[#8a7f74] text-[0.75rem] mt-1">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-[1.35rem] font-bold text-[#1a2744] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>Account Settings</h2>

              {/* Personal Info */}
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-7 shadow-[0_2px_16px_rgba(26,39,68,0.08)] mb-5">
                <h3 className="font-bold text-[1rem] text-[#1a2744] mb-6 pb-3.5 border-b border-[#e2ddd6]" style={{ fontFamily: "'Fraunces', serif" }}>Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  {[
                    { label: "First Name", val: user.firstName || "" },
                    { label: "Last Name", val: user.lastName || "" },
                    { label: "Email", val: user.email || "" },
                    { label: "Phone", val: user.phone || "" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-[0.7rem] font-bold uppercase tracking-[1.2px] text-[#8a7f74] mb-2">{field.label}</label>
                      <input
                        defaultValue={field.val}
                        className="w-full bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] text-[#1a1a1a] text-[0.9rem] py-3 px-3.5 outline-none"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                        readOnly
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/user/edit-profile")}
                  className="bg-[#2a7c6f] text-white border-none rounded-[10px] py-3 px-6 font-semibold cursor-pointer text-[0.9rem] hover:bg-[#3a9e8e] transition-colors duration-200"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Edit Profile →
                </button>
              </div>

              {/* Security */}
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-7 shadow-[0_2px_16px_rgba(26,39,68,0.08)]">
                <h3 className="font-bold text-[1rem] text-[#1a2744] mb-6 pb-3.5 border-b border-[#e2ddd6]" style={{ fontFamily: "'Fraunces', serif" }}>Security</h3>
                <div className="mb-4">
                  <label className="block text-[0.7rem] font-bold uppercase tracking-[1.2px] text-[#8a7f74] mb-2">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] text-[#1a1a1a] text-[0.9rem] py-3 px-3.5 outline-none" style={{ fontFamily: "'Outfit', sans-serif" }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-[1.2px] text-[#8a7f74] mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] text-[#1a1a1a] text-[0.9rem] py-3 px-3.5 outline-none" style={{ fontFamily: "'Outfit', sans-serif" }} />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-[1.2px] text-[#8a7f74] mb-2">Confirm Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] text-[#1a1a1a] text-[0.9rem] py-3 px-3.5 outline-none" style={{ fontFamily: "'Outfit', sans-serif" }} />
                  </div>
                </div>
                <button
                  onClick={() => toast.success("Password changed successfully")}
                  className="bg-[#f0ede8] text-[#3d3730] border-none rounded-[10px] py-3 px-6 font-semibold cursor-pointer text-[0.9rem] hover:bg-[#e2ddd6] transition-colors duration-200"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}