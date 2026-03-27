import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);

  // ── Fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    axios
      .get("/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.data))
      .catch(() => {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  // ── Fetch bookings when tab is active
  useEffect(() => {
    if (activeTab !== "bookings") return;
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("/bookings/my", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBookings(res.data.data || []))
      .catch(() => setBookings([]));
  }, [activeTab]);

  // ── Logout
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // ── Booking status badge color
  const statusColor = (status) => {
    if (status === "confirmed") return { bg: "rgba(42,124,111,0.1)", color: "#2a7c6f" };
    if (status === "pending") return { bg: "#fdf6e8", color: "#c8922a" };
    if (status === "cancelled") return { bg: "#fdf0ec", color: "#e05a3a" };
    return { bg: "#f0ede8", color: "#8a7f74" };
  };

  if (!user) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", paddingTop: 68, minHeight: "100vh", background: "#f5f2ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#8a7f74" }}>
          <div style={{ fontSize: "2rem", marginBottom: 10 }}>⏳</div>
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
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f5f2ed", minHeight: "100vh", paddingTop: 68 }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* ── PROFILE HEADER BANNER ── */}
      <div style={{ background: "#1a2744", padding: "36px 56px", position: "relative", overflow: "hidden" }}>
        {/* decorative glow */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 80% at 80% 50%, rgba(42,124,111,0.25), transparent)" }} />

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "#2a7c6f", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", fontWeight: 700,
            border: "3px solid rgba(255,255,255,0.2)",
            flexShrink: 0,
          }}>
            {initials || "U"}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.7rem", fontWeight: 700, color: "#fff", marginBottom: 6 }}>
              {user.firstName} {user.lastName}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem", marginBottom: 14 }}>
              {user.email}
              {user.phone && ` · ${user.phone}`}
              {user.createdAt && ` · Member since ${new Date(user.createdAt).toLocaleString("default", { month: "short", year: "numeric" })}`}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(42,124,111,0.3)", border: "1px solid rgba(42,124,111,0.5)", color: "#7dd3c8", fontSize: "0.73rem", fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                ✓ Verified
              </span>
              <span style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: "0.73rem", fontWeight: 600, padding: "4px 12px", borderRadius: 20, textTransform: "capitalize" }}>
                {user.role || "Tenant"}
              </span>
              {user.city && (
                <span style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: "0.73rem", fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>
                  📍 {user.city}
                </span>
              )}
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.3)",
              color: "#fff", borderRadius: 10, padding: "10px 24px",
              fontFamily: "'Outfit', sans-serif", fontSize: "0.88rem",
              fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a2744"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2ddd6" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", display: "flex", gap: 4 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif", fontSize: "0.88rem",
                fontWeight: activeTab === tab.key ? 700 : 500,
                color: activeTab === tab.key ? "#1a2744" : "#8a7f74",
                padding: "16px 18px",
                borderBottom: activeTab === tab.key ? "2.5px solid #2a7c6f" : "2.5px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 40px" }}>

        {/* MY BOOKINGS */}
        {activeTab === "bookings" && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.35rem", fontWeight: 700, color: "#1a2744", marginBottom: 24 }}>
              My Bookings
            </h2>

            {bookings.length === 0 ? (
              <div style={{ background: "#fff", border: "1px solid #e2ddd6", borderRadius: 14, padding: "56px", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>📋</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.2rem", color: "#1a2744", marginBottom: 8 }}>No bookings yet</h3>
                <p style={{ color: "#8a7f74", fontSize: "0.9rem", marginBottom: 24 }}>Start exploring PGs and make your first booking!</p>
                <button
                  onClick={() => navigate("/user/browse")}
                  style={{ background: "#1a2744", color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, cursor: "pointer" }}
                >
                  Browse PGs →
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {bookings.map((b) => {
                  const sc = statusColor(b.status);
                  return (
                    <div key={b._id} style={{ background: "#fff", border: "1px solid #e2ddd6", borderRadius: 14, padding: "22px 26px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", boxShadow: "0 2px 12px rgba(26,39,68,0.06)" }}>
                      {/* PG image */}
                      <div style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", background: "#f0ede8", flexShrink: 0 }}>
                        {b.propertyId?.image ? (
                          <img src={b.propertyId.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#e8f5f3" }}>
                            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" opacity="0.4">
                              <path d="M10 32L32 14l22 18v20H10V32z" stroke="#2a7c6f" strokeWidth="2.5" fill="#2a7c6f" fillOpacity="0.2" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1rem", color: "#1a2744", marginBottom: 4 }}>
                          {b.propertyId?.pgName || "PG Property"}
                        </div>
                        <div style={{ color: "#8a7f74", fontSize: "0.82rem", marginBottom: 8 }}>
                          📍 {b.propertyId?.area}, {b.propertyId?.city}
                        </div>
                        <div style={{ display: "flex", gap: 16, fontSize: "0.8rem", color: "#8a7f74", flexWrap: "wrap" }}>
                          {b.moveInDate && <span>Move-in: <strong style={{ color: "#1a2744" }}>{new Date(b.moveInDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong></span>}
                          {b.duration && <span>Duration: <strong style={{ color: "#1a2744" }}>{b.duration} month{b.duration > 1 ? "s" : ""}</strong></span>}
                          {b.totalAmount && <span>Total: <strong style={{ color: "#1a2744" }}>₹{b.totalAmount?.toLocaleString()}</strong></span>}
                        </div>
                      </div>

                      {/* Status badge */}
                      <div style={{ background: sc.bg, color: sc.color, fontSize: "0.75rem", fontWeight: 700, padding: "6px 14px", borderRadius: 20, textTransform: "capitalize", whiteSpace: "nowrap" }}>
                        {b.status || "pending"}
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
          <div style={{ background: "#fff", border: "1px solid #e2ddd6", borderRadius: 14, padding: "56px", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>❤️</div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.2rem", color: "#1a2744", marginBottom: 8 }}>Your wishlist is empty</h3>
            <p style={{ color: "#8a7f74", fontSize: "0.9rem", marginBottom: 24 }}>Save PGs you love and revisit them anytime.</p>
            <button onClick={() => navigate("/user/browse")} style={{ background: "#1a2744", color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, cursor: "pointer" }}>
              Browse PGs →
            </button>
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === "messages" && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.35rem", fontWeight: 700, color: "#1a2744", marginBottom: 24 }}>Messages</h2>
            <div style={{ background: "#fff", border: "1px solid #e2ddd6", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 16px rgba(26,39,68,0.08)" }}>
              {[
                { name: "Support Team", msg: "Your verification documents have been approved. ✓", time: "2 days ago", initial: "S", color: "#2a7c6f" },
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderBottom: "1px solid #e2ddd6" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: m.color || "#1a2744", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
                    {m.initial}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "#1a2744", fontSize: "0.9rem", marginBottom: 3 }}>{m.name}</div>
                    <div style={{ color: "#8a7f74", fontSize: "0.82rem" }}>{m.msg}</div>
                  </div>
                  <div style={{ color: "#8a7f74", fontSize: "0.75rem" }}>{m.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.35rem", fontWeight: 700, color: "#1a2744", marginBottom: 24 }}>Notifications</h2>
            <div style={{ background: "#fff", border: "1px solid #e2ddd6", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 16px rgba(26,39,68,0.08)" }}>
              {[
                { text: "Welcome to PGFinder! Complete your profile to get started.", time: "Just now", unread: true },
              ].map((n, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "18px 24px", borderBottom: "1px solid #e2ddd6" }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: n.unread ? "#2a7c6f" : "#e2ddd6", flexShrink: 0, marginTop: 5 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#3d3730", fontSize: "0.87rem", lineHeight: 1.55 }}>{n.text}</div>
                    <div style={{ color: "#8a7f74", fontSize: "0.75rem", marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.35rem", fontWeight: 700, color: "#1a2744", marginBottom: 24 }}>
              Account Settings
            </h2>
            <div style={{ background: "#fff", border: "1px solid #e2ddd6", borderRadius: 14, padding: "28px", boxShadow: "0 2px 16px rgba(26,39,68,0.08)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                {[
                  { label: "First Name", val: user.firstName || "" },
                  { label: "Last Name", val: user.lastName || "" },
                  { label: "Email", val: user.email || "" },
                  { label: "Phone", val: user.phone || "" },
                ].map((field) => (
                  <div key={field.label}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "#8a7f74", marginBottom: 8 }}>
                      {field.label}
                    </label>
                    <input
                      defaultValue={field.val}
                      style={{ width: "100%", background: "#faf9f7", border: "1.5px solid #e2ddd6", borderRadius: 9, color: "#1a1a1a", fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", padding: "11px 14px", outline: "none" }}
                      readOnly
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/user/edit-profile")}
                style={{ background: "#1a2744", color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}
              >
                Edit Profile →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}