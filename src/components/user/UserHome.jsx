import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import UserFooter from "./UserFooter";

export default function UserHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [featuredPGs, setFeaturedPGs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get("/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get("/properties")
      .then((res) => {
        const data = res.data.data || [];
        setFeaturedPGs(data.slice(0, 3));
      })
      .catch((err) => console.error("Failed to load featured PGs", err));
  }, []);

  const [searchLocation, setSearchLocation] = useState("");
  const [searchRoomType, setSearchRoomType] = useState("");
  const [searchBudget, setSearchBudget] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set("location", searchLocation);
    if (searchBudget) params.set("budget", searchBudget);
    navigate(`/user/browse?${params.toString()}`);
  };

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

  const badgeFor = (pg, index) => {
    if (index === 0) return { label: "Verified", color: "#1a2744" };
    if (index === 1) return { label: "Top Rated", color: "#2a7c6f" };
    return { label: "New", color: "#e05a3a" };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        @keyframes heroZoom { from { transform: scale(1.07); } to { transform: scale(1.0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
        .animate-heroZoom { animation: heroZoom 14s ease-out both; }
        .animate-fadeUp-0 { animation: fadeUp 0.6s ease both; }
        .animate-fadeUp-1 { animation: fadeUp 0.65s 0.08s ease both; }
        .animate-fadeUp-2 { animation: fadeUp 0.65s 0.16s ease both; }
        .animate-fadeUp-3 { animation: fadeUp 0.65s 0.24s ease both; }
        .animate-fadeUp-4 { animation: fadeUp 0.65s 0.32s ease both; }
        .prop-img-inner { transition: transform 0.4s ease; width: 100%; height: 100%; object-fit: cover; }
        .prop-card-home:hover .prop-img-inner { transform: scale(1.05); }
      `}</style>

      <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f5f2ed", minHeight: "100vh" }}>

        {/* ══ HERO ══ */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[130px] pb-20 relative overflow-hidden">
          {/* BG image */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center animate-heroZoom"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1800&q=80')", backgroundPosition: "center 45%" }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(26,39,68,0.65) 0%, rgba(26,39,68,0.42) 38%, rgba(245,242,237,0) 62%, rgba(245,242,237,1) 100%), linear-gradient(135deg, rgba(42,124,111,0.2) 0%, transparent 55%)" }} />

          <div className="relative z-[2] w-full flex flex-col items-center">
            {/* Badge */}
            <div className="animate-fadeUp-0 inline-flex items-center gap-2 bg-white/16 border border-white/40 backdrop-blur-xl text-white text-[0.75rem] font-bold tracking-[1.8px] uppercase py-[7px] px-[18px] rounded-[40px] mb-8">
              <span className="w-[7px] h-[7px] rounded-full bg-white inline-block" />
              India's Smartest PG Platform
            </div>

            {/* Headline */}
            <h1
              className="animate-fadeUp-1 font-black leading-[1.06] text-white"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.8rem, 7.5vw, 6rem)", letterSpacing: "-2.5px", textShadow: "0 4px 32px rgba(15,15,15,0.35)" }}
            >
              Find Your{" "}
              <em className="text-[#7dd3c8]">Perfect</em>
              <br />Paying Guest Stay
            </h1>

            <p className="animate-fadeUp-2 max-w-[520px] mx-auto mt-[22px] text-white/82 text-[1.05rem] leading-[1.75] font-light" style={{ textShadow: "0 1px 8px rgba(15,15,15,0.3)" }}>
              Browse thousands of verified PG accommodations. Book securely, move in confidently.
            </p>

            {/* Search box */}
            <div
              className="animate-fadeUp-3 mt-[52px] bg-white/97 border border-white/60 rounded-[20px] p-7 w-full max-w-[800px] grid gap-3.5 items-end backdrop-blur-2xl"
              style={{ gridTemplateColumns: "1fr 1fr 1fr auto", boxShadow: "0 24px 80px rgba(15,15,15,0.35), 0 4px 16px rgba(15,15,15,0.15)" }}
            >
              <div>
                <label className="block text-[0.7rem] font-bold text-[#8a7f74] uppercase tracking-[1.2px] mb-2">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Koramangala, Bengaluru"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-[#faf9f7] border border-[#e2ddd6] rounded-[10px] text-[#1a1a1a] text-[0.93rem] py-3 px-3.5 outline-none appearance-none transition-all duration-300 focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.1)]"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-[0.7rem] font-bold text-[#8a7f74] uppercase tracking-[1.2px] mb-2">Room Type</label>
                <select
                  value={searchRoomType}
                  onChange={(e) => setSearchRoomType(e.target.value)}
                  className="w-full bg-[#faf9f7] border border-[#e2ddd6] rounded-[10px] text-[#1a1a1a] text-[0.93rem] py-3 px-3.5 outline-none appearance-none transition-all duration-300 focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.1)] cursor-pointer"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <option>Any Type</option>
                  <option>Single Occupancy</option>
                  <option>Double Occupancy</option>
                  <option>Triple Occupancy</option>
                </select>
              </div>
              <div>
                <label className="block text-[0.7rem] font-bold text-[#8a7f74] uppercase tracking-[1.2px] mb-2">Budget / Month</label>
                <select
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  className="w-full bg-[#faf9f7] border border-[#e2ddd6] rounded-[10px] text-[#1a1a1a] text-[0.93rem] py-3 px-3.5 outline-none appearance-none transition-all duration-300 focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.1)] cursor-pointer"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <option value="">Any Budget</option>
                  <option value="5000">Under ₹5,000</option>
                  <option value="10000">₹5k – ₹10k</option>
                  <option value="20000">₹10k – ₹20k</option>
                  <option value="99999">₹20k+</option>
                </select>
              </div>
              <button
                className="bg-[#1a2744] text-white border-none rounded-[10px] py-[13px] px-[30px] text-[0.93rem] font-bold cursor-pointer flex items-center gap-2 whitespace-nowrap transition-colors duration-200 hover:bg-[#243356]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
                onClick={handleSearch}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" /></svg>
                Search
              </button>
            </div>

            {/* Stats */}
            <div className="animate-fadeUp-4 flex justify-center flex-wrap items-center mt-[68px]">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className="text-center px-7">
                    <div
                      className="text-[2.5rem] font-black text-white"
                      style={{ fontFamily: "'Fraunces', serif", textShadow: "0 2px 12px rgba(15,15,15,0.25)" }}
                    >
                      {s.num}
                    </div>
                    <div className="text-white/72 text-[0.82rem] mt-1 font-medium">{s.label}</div>
                  </div>
                  {i < stats.length - 1 && <div className="w-px h-10 bg-white/20" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURED PROPERTIES ══ */}
        <section className="px-6 lg:px-14 py-24 bg-[#f5f2ed]">
          <div className="flex items-end justify-between flex-wrap gap-5 mb-12">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[2.5px] text-[#2a7c6f] mb-3.5">Featured Properties</p>
              <h2
                className="font-bold text-[#1a2744] leading-[1.2] mb-3.5"
                style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)" }}
              >
                Handpicked Stays<br />Near You
              </h2>
              <p className="text-[#8a7f74] text-[1rem] max-w-[460px] leading-[1.75]">Every listing is verified, every review is real.</p>
            </div>
            <button
              className="bg-[#f0ede8] border border-[#e2ddd6] text-[#3d3730] rounded-[10px] py-2.5 px-5 text-[0.88rem] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#e2ddd6]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              onClick={() => navigate("browse")}
            >
              View All Properties →
            </button>
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {featuredPGs.length > 0 ? (
              featuredPGs.map((pg, index) => {
                const badge = badgeFor(pg, index);
                return (
                  <div
                    key={pg._id}
                    className="prop-card-home bg-white border border-[#e2ddd6] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_2px_16px_rgba(26,39,68,0.08)] hover:-translate-y-[5px] hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)] hover:border-transparent"
                    onClick={() => navigate(`/property/${pg._id}`)}
                  >
                    <div className="h-[200px] relative overflow-hidden bg-[#e8f5f3]">
                      {pg.image ? (
                        <img className="prop-img-inner" src={pg.image} alt={pg.pgName} onError={(e) => { e.target.style.display = "none"; }} />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${index === 0 ? "#e8f5f3, #c8e8e3" : index === 1 ? "#eef2fb, #d4e0f8" : "#fdf6e8, #f5e4c0"})` }}
                        >
                          <svg width="60" height="60" viewBox="0 0 64 64" fill="none" opacity="0.3">
                            <path d="M10 32L32 14l22 18v20H10V32z" stroke="#2a7c6f" strokeWidth="2.5" fill="#2a7c6f" fillOpacity="0.15" />
                          </svg>
                        </div>
                      )}
                      <span className="absolute top-3.5 left-3.5 text-white text-[0.68rem] font-bold py-1 px-3 rounded-[6px]" style={{ background: badge.color }}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="p-[22px]">
                      <div className="font-bold text-[1.12rem] text-[#1a2744] mb-1" style={{ fontFamily: "'Fraunces', serif" }}>{pg.pgName}</div>
                      <div className="text-[#8a7f74] text-[0.83rem] mb-3.5 flex items-center gap-[5px]">
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" /></svg>
                        {pg.area}, {pg.city}
                      </div>
                      <div className="flex gap-1.5 flex-wrap mb-4">
                        {(pg.amenities || []).slice(0, 4).map((tag) => (
                          <span key={tag} className="bg-[#f0ede8] border border-[#e2ddd6] text-[#3d3730] text-[0.73rem] py-1 px-[11px] rounded-[20px] font-medium capitalize">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-[#e2ddd6] pt-4">
                        <div className="font-bold text-[1.12rem] text-[#1a2744]">₹{pg.rent?.toLocaleString()} <span className="text-[#8a7f74] text-[0.78rem] font-normal">/month</span></div>
                        <div className="text-[#c8922a] text-[0.83rem] font-bold">★ {pg.rating || "New"}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              [
                { name: "Sunrise PG for Girls", location: "Koramangala, Bengaluru", tags: ["Wi-Fi", "Meals", "Laundry", "AC"], price: "₹7,500", rating: "4.8", badge: "Verified", badgeColor: "#1a2744", img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=75" },
                { name: "Urban Nest Co-Living", location: "Baner, Pune", tags: ["Wi-Fi", "Gym", "Parking"], price: "₹9,200", rating: "4.9", badge: "Top Rated", badgeColor: "#2a7c6f", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=75" },
                { name: "Comfort Stay PG", location: "Andheri West, Mumbai", tags: ["Meals", "CCTV", "Single Room"], price: "₹11,000", rating: "4.6", badge: "New", badgeColor: "#e05a3a", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=75" },
              ].map((p) => (
                <div
                  key={p.name}
                  className="prop-card-home bg-white border border-[#e2ddd6] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_2px_16px_rgba(26,39,68,0.08)] hover:-translate-y-[5px] hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)] hover:border-transparent"
                  onClick={() => navigate(`/browse`)}
                >
                  <div className="h-[200px] relative overflow-hidden bg-[#f0ede8]">
                    <img className="prop-img-inner" src={p.img} alt={p.name} onError={(e) => { e.target.style.display = "none"; }} />
                    <span className="absolute top-3.5 left-3.5 text-white text-[0.68rem] font-bold py-1 px-3 rounded-[6px]" style={{ background: p.badgeColor }}>{p.badge}</span>
                  </div>
                  <div className="p-[22px]">
                    <div className="font-bold text-[1.12rem] text-[#1a2744] mb-1" style={{ fontFamily: "'Fraunces', serif" }}>{p.name}</div>
                    <div className="text-[#8a7f74] text-[0.83rem] mb-3.5 flex items-center gap-[5px]">
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" /></svg>
                      {p.location}
                    </div>
                    <div className="flex gap-1.5 flex-wrap mb-4">
                      {p.tags.map((tag) => (<span key={tag} className="bg-[#f0ede8] border border-[#e2ddd6] text-[#3d3730] text-[0.73rem] py-1 px-[11px] rounded-[20px] font-medium">{tag}</span>))}
                    </div>
                    <div className="flex items-center justify-between border-t border-[#e2ddd6] pt-4">
                      <div className="font-bold text-[1.12rem] text-[#1a2744]">{p.price} <span className="text-[#8a7f74] text-[0.78rem] font-normal">/month</span></div>
                      <div className="text-[#c8922a] text-[0.83rem] font-bold">★ {p.rating}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ══ WHY PGFINDER ══ */}
        <section className="px-6 lg:px-14 py-24 bg-white">
          <p className="text-[0.72rem] font-bold uppercase tracking-[2.5px] text-[#2a7c6f] mb-3.5">Why PGFinder?</p>
          <h2
            className="font-bold text-[#1a2744] leading-[1.2] mb-12"
            style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)" }}
          >
            Everything You Need,<br />Nothing You Don't
          </h2>
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-[#e2ddd6] rounded-[14px] p-[30px] transition-all duration-300 shadow-[0_2px_16px_rgba(26,39,68,0.08)] hover:border-[#2a7c6f] hover:-translate-y-[3px] hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)]"
              >
                <div
                  className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center mb-4"
                  style={{ background: f.iconBg, color: f.iconColor }}
                >
                  {f.icon}
                </div>
                <div className="font-bold text-[0.98rem] text-[#1a2744] mb-2">{f.title}</div>
                <div className="text-[#8a7f74] text-[0.86rem] leading-[1.65]">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ LANDLORD CTA ══ */}
        <div className="px-6 lg:px-14 pb-20">
          <div className="bg-[#1a2744] rounded-[20px] py-16 px-6 lg:px-14 flex items-center justify-between gap-8 flex-wrap relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(42,124,111,0.3), transparent)" }} />
            <div className="relative">
              <h2 className="text-[2rem] font-bold text-white mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Are You a Landlord?</h2>
              <p className="text-white/60 text-[0.96rem]">List your property for free and reach thousands of verified tenants today.</p>
            </div>
            <button
              className="relative bg-white/8 border-2 border-white/30 text-white py-3.5 px-8 rounded-[12px] text-[0.96rem] font-bold cursor-pointer whitespace-nowrap transition-all duration-300 hover:bg-white hover:text-[#1a2744] hover:border-white"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              onClick={() => navigate("/landlord")}
            >
              Go to Landlord Dashboard →
            </button>
          </div>
        </div>

        {/* ══ FOOTER ══ */}
        <UserFooter />
      </div>
    </>
  );
}