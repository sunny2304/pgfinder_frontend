import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import UserFooter from "./UserFooter";

export default function UserHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [featuredPGs, setFeaturedPGs] = useState([]);

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

  // ── Fetch featured PGs (first 3 from backend)
  useEffect(() => {
    axios
      .get("/properties")
      .then((res) => {
        const data = res.data.data || [];
        setFeaturedPGs(data.slice(0, 3));
      })
      .catch((err) => console.error("Failed to load featured PGs", err));
  }, []);

  // ── Search handler
  const [searchLocation, setSearchLocation] = useState("");
  const [searchRoomType, setSearchRoomType] = useState("");
  const [searchBudget, setSearchBudget] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set("location", searchLocation);
    if (searchBudget) params.set("budget", searchBudget);
    navigate(`/user/browse?${params.toString()}`);
  };

  // ── Features data
  const features = [
    { iconBg: "#e8f5f3", iconColor: "#2a7c6f", title: "Advanced Filters", desc: "Filter by location, budget, amenities, room type and more to find the perfect match.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg> },
    { iconBg: "rgba(26,39,68,0.07)", iconColor: "#1a2744", title: "Verified Listings", desc: "Every property is physically verified before going live. Zero fake listings.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><polyline points="20,6 9,17 4,12" /></svg> },
    { iconBg: "#fdf6e8", iconColor: "#c8922a", title: "Secure Booking", desc: "Pay safely online. Receipts generated instantly. Refund policy backed in.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> },
    { iconBg: "#eef2fb", iconColor: "#3b6bcc", title: "Direct Messaging", desc: "Chat with landlords before booking. No middlemen, no hidden fees.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg> },
    { iconBg: "#fdf6e8", iconColor: "#c8922a", title: "Honest Reviews", desc: "Real ratings from real tenants. Make decisions backed by verified feedback.", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg> },
    { iconBg: "#fdf0ec", iconColor: "#e05a3a", title: "Map Search", desc: "Visually explore neighbourhoods and find PGs closest to your workplace or college.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg> },
  ];

  const stats = [
    { num: "12,400+", label: "Listed Properties" },
    { num: "48,000+", label: "Happy Tenants" },
    { num: "320+", label: "Cities Covered" },
    { num: "98%", label: "Verified Listings" },
  ];

  // badge for featured cards
  const badgeFor = (pg, index) => {
    if (index === 0) return { label: "Verified", color: "#1a2744" };
    if (index === 1) return { label: "Top Rated", color: "#2a7c6f" };
    return { label: "New", color: "#e05a3a" };
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f5f2ed", minHeight: "100vh" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        @keyframes heroZoom { from { transform: scale(1.07); } to { transform: scale(1.0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
        .prop-card-home { background: #fff; border: 1px solid #e2ddd6; border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 2px 16px rgba(26,39,68,0.08); }
        .prop-card-home:hover { transform: translateY(-5px); box-shadow: 0 8px 40px rgba(26,39,68,0.13); border-color: transparent; }
        .prop-card-home:hover .prop-img-inner { transform: scale(1.05); }
        .prop-img-inner { transition: transform 0.4s ease; width: 100%; height: 100%; object-fit: cover; }
        .feat-card-home { background: #fff; border: 1px solid #e2ddd6; border-radius: 14px; padding: 30px; transition: all 0.25s ease; box-shadow: 0 2px 16px rgba(26,39,68,0.08); }
        .feat-card-home:hover { border-color: #2a7c6f; transform: translateY(-3px); box-shadow: 0 8px 40px rgba(26,39,68,0.13); }
        .search-input-home { width: 100%; background: #faf9f7; border: 1.5px solid #e2ddd6; border-radius: 10px; color: #1a1a1a; font-family: 'Outfit', sans-serif; font-size: 0.93rem; padding: 12px 14px; outline: none; appearance: none; transition: all 0.25s; }
        .search-input-home:focus { border-color: #2a7c6f; box-shadow: 0 0 0 3px rgba(42,124,111,0.1); }
        .search-btn-home { background: #1a2744; color: #fff; border: none; border-radius: 10px; padding: 13px 30px; font-family: 'Outfit', sans-serif; font-size: 0.93rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; white-space: nowrap; transition: background 0.2s; }
        .search-btn-home:hover { background: #243356; }
        .view-all-btn { background: #f0ede8; border: 1px solid #e2ddd6; color: #3d3730; border-radius: 10px; padding: 10px 20px; font-size: 0.88rem; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
        .view-all-btn:hover { background: #e2ddd6; }
        .cta-landlord-btn { position: relative; background: rgba(255,255,255,0.08); border: 2px solid rgba(255,255,255,0.3); color: #fff; padding: 14px 32px; border-radius: 12px; font-family: 'Outfit', sans-serif; font-size: 0.96rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.25s; }
        .cta-landlord-btn:hover { background: #fff; color: #1a2744; border-color: #fff; }

        /* Responsive hero search box */
        @media (max-width: 768px) {
          .hero-search-box { grid-template-columns: 1fr !important; }
          .hero-stats { flex-direction: column !important; gap: 24px !important; }
          .hero-stats .stat-divider { display: none !important; }
          .hero-section { padding: 110px 16px 60px !important; }
          .features-section { padding: 64px 20px !important; }
          .props-section { padding: 64px 20px !important; }
          .cta-section { margin: 0 20px 60px !important; padding: 40px 24px !important; flex-direction: column !important; }
        }
        @media (max-width: 560px) {
          .hero-h1 { font-size: 2.6rem !important; letter-spacing: -1.5px !important; }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section className="hero-section" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "130px 24px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* BG image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1800&q=80')", backgroundSize: "cover", backgroundPosition: "center 45%", animation: "heroZoom 14s ease-out both" }} />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to bottom, rgba(26,39,68,0.65) 0%, rgba(26,39,68,0.42) 38%, rgba(245,242,237,0) 62%, rgba(245,242,237,1) 100%), linear-gradient(135deg, rgba(42,124,111,0.2) 0%, transparent 55%)" }} />

        <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(12px)", color: "#fff", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", padding: "7px 18px", borderRadius: 40, marginBottom: 32, animation: "fadeUp 0.6s ease both" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
            India's Smartest PG Platform
          </div>

          {/* Headline */}
          <h1 className="hero-h1" style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.8rem, 7.5vw, 6rem)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-2.5px", color: "#fff", textShadow: "0 4px 32px rgba(15,15,15,0.35)", animation: "fadeUp 0.65s 0.08s ease both" }}>
            Find Your{" "}
            <span style={{ color: "#7dd3c8", fontStyle: "italic" }}>Perfect</span>
            <br />Paying Guest Stay
          </h1>

          <p style={{ maxWidth: 520, margin: "22px auto 0", color: "rgba(255,255,255,0.82)", fontSize: "1.05rem", lineHeight: 1.75, fontWeight: 300, textShadow: "0 1px 8px rgba(15,15,15,0.3)", animation: "fadeUp 0.65s 0.16s ease both" }}>
            Browse thousands of verified PG accommodations. Book securely, move in confidently.
          </p>

          {/* Search box */}
          <div className="hero-search-box" style={{ marginTop: 52, background: "rgba(255,255,255,0.97)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 800, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 14, alignItems: "end", boxShadow: "0 24px 80px rgba(15,15,15,0.35), 0 4px 16px rgba(15,15,15,0.15)", backdropFilter: "blur(16px)", animation: "fadeUp 0.65s 0.24s ease both" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#8a7f74", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>Location</label>
              <input className="search-input-home" type="text" placeholder="e.g. Koramangala, Bengaluru" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#8a7f74", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>Room Type</label>
              <select className="search-input-home" value={searchRoomType} onChange={(e) => setSearchRoomType(e.target.value)}>
                <option>Any Type</option>
                <option>Single Occupancy</option>
                <option>Double Occupancy</option>
                <option>Triple Occupancy</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#8a7f74", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>Budget / Month</label>
              <select className="search-input-home" value={searchBudget} onChange={(e) => setSearchBudget(e.target.value)}>
                <option value="">Any Budget</option>
                <option value="5000">Under ₹5,000</option>
                <option value="10000">₹5k – ₹10k</option>
                <option value="20000">₹10k – ₹20k</option>
                <option value="99999">₹20k+</option>
              </select>
            </div>
            <button className="search-btn-home" onClick={handleSearch}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" /></svg>
              Search
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats" style={{ display: "flex", gap: 0, justifyContent: "center", marginTop: 68, flexWrap: "wrap", alignItems: "center", animation: "fadeUp 0.65s 0.32s ease both" }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", padding: "0 28px" }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2.5rem", fontWeight: 900, color: "#fff", textShadow: "0 2px 12px rgba(15,15,15,0.25)" }}>{s.num}</div>
                  <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.82rem", marginTop: 5, fontWeight: 500 }}>{s.label}</div>
                </div>
                {i < stats.length - 1 && <div className="stat-divider" style={{ width: 1, height: 40, background: "rgba(255,255,255,0.2)" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PROPERTIES ══ */}
      <section className="props-section" style={{ padding: "96px 56px", background: "#f5f2ed" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.5px", color: "#2a7c6f", marginBottom: 14 }}>Featured Properties</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#1a2744", lineHeight: 1.2, marginBottom: 14 }}>
              Handpicked Stays<br />Near You
            </h2>
            <p style={{ color: "#8a7f74", fontSize: "1rem", maxWidth: 460, lineHeight: 1.75 }}>Every listing is verified, every review is real.</p>
          </div>
          <button className="view-all-btn" onClick={() => navigate("/user/browse")}>
            View All Properties →
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {featuredPGs.length > 0 ? (
            featuredPGs.map((pg, index) => {
              const badge = badgeFor(pg, index);
              return (
                <div key={pg._id} className="prop-card-home" onClick={() => navigate(`/user/property/${pg._id}`)}>
                  <div style={{ height: 200, position: "relative", overflow: "hidden", background: "#e8f5f3" }}>
                    {pg.image ? (
                      <img className="prop-img-inner" src={pg.image} alt={pg.pgName} onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${index === 0 ? "#e8f5f3, #c8e8e3" : index === 1 ? "#eef2fb, #d4e0f8" : "#fdf6e8, #f5e4c0"})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="60" height="60" viewBox="0 0 64 64" fill="none" opacity="0.3">
                          <path d="M10 32L32 14l22 18v20H10V32z" stroke="#2a7c6f" strokeWidth="2.5" fill="#2a7c6f" fillOpacity="0.15" />
                        </svg>
                      </div>
                    )}
                    <span style={{ position: "absolute", top: 14, left: 14, background: badge.color, color: "#fff", fontSize: "0.68rem", fontWeight: 700, padding: "4px 12px", borderRadius: 6 }}>
                      {badge.label}
                    </span>
                  </div>
                  <div style={{ padding: 22 }}>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.12rem", fontWeight: 700, color: "#1a2744", marginBottom: 4 }}>{pg.pgName}</div>
                    <div style={{ color: "#8a7f74", fontSize: "0.83rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" /></svg>
                      {pg.area}, {pg.city}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                      {(pg.amenities || []).slice(0, 4).map((tag) => (
                        <span key={tag} style={{ background: "#f0ede8", border: "1px solid #e2ddd6", color: "#3d3730", fontSize: "0.73rem", padding: "4px 11px", borderRadius: 20, fontWeight: 500, textTransform: "capitalize" }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e2ddd6", paddingTop: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: "1.12rem", color: "#1a2744" }}>₹{pg.rent?.toLocaleString()} <span style={{ color: "#8a7f74", fontSize: "0.78rem", fontWeight: 400 }}>/month</span></div>
                      <div style={{ color: "#c8922a", fontSize: "0.83rem", fontWeight: 700 }}>★ {pg.rating || "New"}</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback static cards if no backend data
            [
              { name: "Sunrise PG for Girls", location: "Koramangala, Bengaluru", tags: ["Wi-Fi", "Meals", "Laundry", "AC"], price: "₹7,500", rating: "4.8", badge: "Verified", badgeColor: "#1a2744", img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=75" },
              { name: "Urban Nest Co-Living", location: "Baner, Pune", tags: ["Wi-Fi", "Gym", "Parking"], price: "₹9,200", rating: "4.9", badge: "Top Rated", badgeColor: "#2a7c6f", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=75" },
              { name: "Comfort Stay PG", location: "Andheri West, Mumbai", tags: ["Meals", "CCTV", "Single Room"], price: "₹11,000", rating: "4.6", badge: "New", badgeColor: "#e05a3a", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=75" },
            ].map((p) => (
              <div key={p.name} className="prop-card-home" onClick={() => navigate("/user/browse")}>
                <div style={{ height: 200, position: "relative", overflow: "hidden", background: "#f0ede8" }}>
                  <img className="prop-img-inner" src={p.img} alt={p.name} onError={(e) => { e.target.style.display = "none"; }} />
                  <span style={{ position: "absolute", top: 14, left: 14, background: p.badgeColor, color: "#fff", fontSize: "0.68rem", fontWeight: 700, padding: "4px 12px", borderRadius: 6 }}>{p.badge}</span>
                </div>
                <div style={{ padding: 22 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.12rem", fontWeight: 700, color: "#1a2744", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ color: "#8a7f74", fontSize: "0.83rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" /></svg>
                    {p.location}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    {p.tags.map((tag) => (<span key={tag} style={{ background: "#f0ede8", border: "1px solid #e2ddd6", color: "#3d3730", fontSize: "0.73rem", padding: "4px 11px", borderRadius: 20, fontWeight: 500 }}>{tag}</span>))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e2ddd6", paddingTop: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: "1.12rem", color: "#1a2744" }}>{p.price} <span style={{ color: "#8a7f74", fontSize: "0.78rem", fontWeight: 400 }}>/month</span></div>
                    <div style={{ color: "#c8922a", fontSize: "0.83rem", fontWeight: 700 }}>★ {p.rating}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ══ WHY PGFINDER ══ */}
      <section className="features-section" style={{ padding: "96px 56px", background: "#ffffff" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.5px", color: "#2a7c6f", marginBottom: 14 }}>Why PGFinder?</p>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#1a2744", lineHeight: 1.2, marginBottom: 48 }}>
          Everything You Need,<br />Nothing You Don't
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {features.map((f) => (
            <div key={f.title} className="feat-card-home">
              <div style={{ width: 50, height: 50, background: f.iconBg, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: f.iconColor, marginBottom: 18 }}>
                {f.icon}
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.98rem", color: "#1a2744", marginBottom: 8 }}>{f.title}</div>
              <div style={{ color: "#8a7f74", fontSize: "0.86rem", lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ LANDLORD CTA ══ */}
      <div style={{ padding: "0 56px 80px" }} className="cta-section">
        <div style={{ background: "#1a2744", borderRadius: 20, padding: "64px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(42,124,111,0.3), transparent)" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>Are You a Landlord?</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.96rem" }}>List your property for free and reach thousands of verified tenants today.</p>
          </div>
          <button className="cta-landlord-btn" onClick={() => navigate("/landlord")}>
            Go to Landlord Dashboard →
          </button>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <UserFooter />
    </div>
  );
}