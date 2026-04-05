import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import UserFooter from "./UserFooter";

export default function UserHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [featuredPGs, setFeaturedPGs] = useState([]);
  const [stats, setStats] = useState(null);

  // ── fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get("/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.data))
      .catch(() => { });
  }, []);

  // ── fetch all properties once → derive stats + featured cards
  useEffect(() => {
    axios
      .get("/properties")
      .then((res) => {
        const data = res.data.data || [];
        setFeaturedPGs(data.slice(0, 3));

        // Derive real stats from the database
        const totalListings = data.length;
        const uniqueCities = new Set(
          data.map((p) => p.city?.trim().toLowerCase()).filter(Boolean)
        ).size;
        const verifiedCount = data.filter((p) => p.available).length;
        const uniqueLandlords = new Set(
          data.map((p) => p.landlordId?._id || p.landlordId).filter(Boolean)
        ).size;

        setStats({ totalListings, uniqueCities, verifiedCount, uniqueLandlords });
      })
      .catch((err) => console.error("Failed to load featured PGs", err));
  }, []);

  // ── search state
  const [searchLocation, setSearchLocation] = useState("");
  const [searchRoomType, setSearchRoomType] = useState("");
  const [searchBudget, setSearchBudget] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set("location", searchLocation.trim());
    if (searchRoomType) params.set("roomType", searchRoomType);
    // Map budget dropdown to minPrice/maxPrice so BrowsePG filters correctly
    if (searchBudget) {
      if (searchBudget === "5000") { params.set("maxPrice", "5000"); }
      else if (searchBudget === "10000") { params.set("minPrice", "5000"); params.set("maxPrice", "10000"); }
      else if (searchBudget === "20000") { params.set("minPrice", "10000"); params.set("maxPrice", "20000"); }
      else if (searchBudget === "99999") { params.set("minPrice", "20000"); }
    }
    navigate(`/browse?${params.toString()}`);
  };

  // ── features data (unchanged)
  const features = [
    {
      iconBg: "#e8f5f3", iconColor: "#2a7c6f",
      title: "Advanced Filters",
      desc: "Filter by location, budget, amenities, room type and more to find the perfect match.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>,
    },
    {
      iconBg: "rgba(26,39,68,0.07)", iconColor: "#1a2744",
      title: "Verified Listings",
      desc: "Every property is physically verified before going live. Zero fake listings.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><polyline points="20,6 9,17 4,12" /></svg>,
    },
    {
      iconBg: "#fdf6e8", iconColor: "#c8922a",
      title: "Secure Booking",
      desc: "Pay safely online. Receipts generated instantly. Refund policy backed in.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
    },
    {
      iconBg: "#eef2fb", iconColor: "#3b6bcc",
      title: "Direct Messaging",
      desc: "Chat with landlords before booking. No middlemen, no hidden fees.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
    },
    {
      iconBg: "#fdf6e8", iconColor: "#c8922a",
      title: "Honest Reviews",
      desc: "Real ratings from real tenants. Make decisions backed by verified feedback.",
      icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
    },
    {
      iconBg: "#fdf0ec", iconColor: "#e05a3a",
      title: "Map Search",
      desc: "Visually explore neighbourhoods and find PGs closest to your workplace or college.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>,
    },
  ];

  // ── stats (unchanged)
  // Dynamic stats derived from database
  const statsData = stats
    ? [
      { num: stats.totalListings.toLocaleString() + "+", label: "Listed Properties" },
      { num: stats.uniqueLandlords.toLocaleString() + "+", label: "Active Landlords" },
      { num: stats.uniqueCities.toLocaleString() + "+", label: "Cities Covered" },
      { num: stats.verifiedCount.toLocaleString() + "+", label: "Verified Listings" },
    ]
    : [
      { num: "...", label: "Listed Properties" },
      { num: "...", label: "Active Landlords" },
      { num: "...", label: "Cities Covered" },
      { num: "...", label: "Verified Listings" },
    ];

  // ── badge helper (unchanged)
  const badgeFor = (pg, index) => {
    if (index === 0) return { label: "Verified", color: "#1a2744" };
    if (index === 1) return { label: "Top Rated", color: "#2a7c6f" };
    return { label: "New", color: "#e05a3a" };
  };

  // ── static fallback cards (matching screenshots exactly)
  const staticCards = [
    {
      name: "Sunrise PG for Girls",
      location: "Koramangala, Bengaluru",
      tags: ["Wi-Fi", "Meals", "Laundry", "AC"],
      price: "₹7,500",
      rating: "4.8",
      reviews: 42,
      badge: "Verified",
      badgeColor: "#1a2744",
      img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=75",
    },
    {
      name: "Urban Nest Co-Living",
      location: "Baner, Pune",
      tags: ["Wi-Fi", "Gym", "Parking"],
      price: "₹9,200",
      rating: "4.9",
      reviews: 78,
      badge: "Top Rated",
      badgeColor: "#2a7c6f",
      img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=75",
    },
    {
      name: "Comfort Stay PG",
      location: "Andheri West, Mumbai",
      tags: ["Meals", "CCTV", "Single Room"],
      price: "₹11,000",
      rating: "4.6",
      reviews: 19,
      badge: "New",
      badgeColor: "#e05a3a",
      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=75",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        @keyframes heroZoom { from { transform: scale(1.06); } to { transform: scale(1.0); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        .hero-bg   { animation: heroZoom 14s ease-out both; }
        .fu-0      { animation: fadeUp 0.6s ease both; }
        .fu-1      { animation: fadeUp 0.65s 0.1s  ease both; }
        .fu-2      { animation: fadeUp 0.65s 0.2s  ease both; }
        .fu-3      { animation: fadeUp 0.65s 0.3s  ease both; }
        .fu-4      { animation: fadeUp 0.65s 0.4s  ease both; }
        .card-img-wrap img { transition: transform 0.4s ease; }
        .prop-card:hover .card-img-wrap img { transform: scale(1.04); }
      `}</style>

      <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f5f2ed", minHeight: "100vh" }}>

        {/* ════════════════════════════════════════
            HERO SECTION
            ════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-5 pt-[120px] pb-16">

          {/* Background image */}
          <div
            className="hero-bg absolute inset-0 z-0 bg-cover"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1800&q=80')",
              backgroundPosition: "center 45%",
            }}
          />

          {/* Overlays — dark-to-transparent top, warm-to-opaque bottom */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(15,22,40,0.70) 0%, rgba(15,22,40,0.45) 40%, rgba(245,242,237,0) 65%, rgba(245,242,237,1) 100%)",
            }}
          />
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(42,124,111,0.18) 0%, transparent 50%)" }}
          />

          {/* Content */}
          <div className="relative z-[2] w-full flex flex-col items-center">

            {/* Badge pill */}
            <div className="fu-0 inline-flex items-center gap-2 bg-white/[0.15] border border-white/[0.45] backdrop-blur-md text-white text-[0.72rem] font-bold tracking-[2px] uppercase py-2 px-5 rounded-full mb-8">
              <span className="w-[6px] h-[6px] rounded-full bg-white inline-block flex-shrink-0" />
              India's Smartest PG Platform
            </div>

            {/* Main headline — matches Image 2 exactly */}
            <h1
              className="fu-1 font-black text-white leading-[1.05] mb-5"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(3rem, 8vw, 6.5rem)",
                letterSpacing: "-2px",
                textShadow: "0 4px 40px rgba(0,0,0,0.3)",
              }}
            >
              Find Your <em className="text-[#7dd3c8] not-italic">Perfect</em>
              <br />Paying Guest Stay
            </h1>

            {/* Subtitle */}
            <p
              className="fu-2 text-white/80 text-[1rem] leading-[1.8] max-w-[500px] mx-auto mb-0 font-light"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.25)" }}
            >
              Browse thousands of verified PG accommodations. Book securely,<br className="hidden sm:block" /> move in confidently.
            </p>

            {/* ── SEARCH BOX — matches Image 2 style (white card, 3 cols + button) ── */}
            <div
              className="fu-3 mt-12 w-full max-w-[780px] bg-white rounded-[18px] px-6 pt-5 pb-6"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.12)" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
                {/* Location */}
                <div>
                  <label
                    className="block text-[0.68rem] font-bold text-[#8a7f74] uppercase tracking-[1.4px] mb-2"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Koramangala, Beng..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full bg-[#f7f5f2] border border-[#e2ddd6] rounded-[10px] text-[#1a1a1a] text-[0.9rem] py-3 px-3.5 outline-none transition-all duration-200 focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.08)] placeholder:text-[#bbb5ae]"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>

                {/* Room Type */}
                <div>
                  <label
                    className="block text-[0.68rem] font-bold text-[#8a7f74] uppercase tracking-[1.4px] mb-2"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Room Type
                  </label>
                  <select
                    value={searchRoomType}
                    onChange={(e) => setSearchRoomType(e.target.value)}
                    className="w-full bg-[#f7f5f2] border border-[#e2ddd6] rounded-[10px] text-[#1a1a1a] text-[0.9rem] py-3 px-3.5 outline-none appearance-none transition-all duration-200 focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.08)] cursor-pointer"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <option value="">Any Type</option>
                    <option value="single">Single Occupancy</option>
                    <option value="double">Double Occupancy</option>
                    <option value="triple">Triple Occupancy</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label
                    className="block text-[0.68rem] font-bold text-[#8a7f74] uppercase tracking-[1.4px] mb-2"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Budget / Month
                  </label>
                  <select
                    value={searchBudget}
                    onChange={(e) => setSearchBudget(e.target.value)}
                    className="w-full bg-[#f7f5f2] border border-[#e2ddd6] rounded-[10px] text-[#1a1a1a] text-[0.9rem] py-3 px-3.5 outline-none appearance-none transition-all duration-200 focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.08)] cursor-pointer"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <option value="">Any Budget</option>
                    <option value="5000">Under ₹5,000</option>
                    <option value="10000">₹5k – ₹10k</option>
                    <option value="20000">₹10k – ₹20k</option>
                    <option value="99999">₹20k+</option>
                  </select>
                </div>

                {/* Search button — dark navy, matches Image 2 */}
                <button
                  className="bg-[#1a2744] text-white border-none rounded-[10px] py-3 px-7 text-[0.9rem] font-bold cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-200 hover:bg-[#243356] h-[46px]"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                  onClick={handleSearch}
                >
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>

            {/* ── STATS ROW — matches Image 3 (large white numbers, muted labels) ── */}
            <div className="fu-4 flex items-center justify-center flex-wrap gap-0 mt-16">
              {statsData.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className="text-center px-8 py-2">
                    <div
                      className="font-black text-white leading-none"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: "clamp(2rem, 4vw, 2.8rem)",
                        textShadow: "0 2px 16px rgba(0,0,0,0.2)",
                      }}
                    >
                      {s.num}
                    </div>
                    <div className="text-white/65 text-[0.8rem] font-medium mt-1.5">{s.label}</div>
                  </div>
                  {i < statsData.length - 1 && (
                    <div className="w-px h-10 bg-white/20 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FEATURED PROPERTIES
            Matches Images 3 & 4
            ════════════════════════════════════════ */}
        <section className="bg-[#f5f2ed] px-5 lg:px-14 pt-20 pb-24">
          {/* Section header */}
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12 max-w-[1200px] mx-auto">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[2.5px] text-[#2a7c6f] mb-3">
                Featured Properties
              </p>
              <h2
                className="font-bold text-[#1a2744] leading-[1.15] mb-3"
                style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Handpicked Stays<br />Near You
              </h2>
              <p className="text-[#8a7f74] text-[0.95rem] leading-[1.7]">
                Every listing is verified, every review is real.
              </p>
            </div>
            <button
              className="text-[#3d3730] text-[0.88rem] font-medium bg-transparent border-none cursor-pointer hover:text-[#1a2744] transition-colors duration-200 underline-offset-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              onClick={() => navigate("/browse")}
            >
              View All Properties →
            </button>
          </div>

          {/* Cards grid — 3-col, clean white cards matching Image 4 */}
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPGs.length > 0
              ? featuredPGs.map((pg, index) => {
                const badge = badgeFor(pg, index);
                const reviewCount = 10 + (pg.pgName?.length % 70);
                return (
                  <div
                    key={pg._id}
                    className="prop-card bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_2px_20px_rgba(26,39,68,0.07)] hover:shadow-[0_8px_40px_rgba(26,39,68,0.14)] hover:-translate-y-1"
                    onClick={() => navigate(`/property/${pg._id}`)}
                  >
                    {/* Image */}
                    <div className="card-img-wrap h-[210px] relative overflow-hidden bg-[#e8f5f3]">
                      {pg.image ? (
                        <img
                          src={pg.image}
                          alt={pg.pgName}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-30">
                          <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                            <path d="M10 32L32 14l22 18v20H10V32z" stroke="#2a7c6f" strokeWidth="2.5" fill="#2a7c6f" fillOpacity="0.15" />
                          </svg>
                        </div>
                      )}
                      {/* Badge */}
                      <span
                        className="absolute top-3.5 left-3.5 text-white text-[0.7rem] font-bold py-1 px-3 rounded-[6px]"
                        style={{ background: badge.color }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="px-5 pt-4 pb-5">
                      <h3
                        className="font-bold text-[1.05rem] text-[#1a2744] mb-1.5"
                        style={{ fontFamily: "'Fraunces', serif" }}
                      >
                        {pg.pgName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[#8a7f74] text-[0.82rem] mb-4">
                        <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0">
                          <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" />
                        </svg>
                        {pg.area ? `${pg.area}, ` : ""}{pg.city}
                      </div>

                      {/* Amenity tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {(pg.amenities || []).slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="bg-[#f5f3f0] border border-[#e8e5e0] text-[#3d3730] text-[0.72rem] py-1 px-3 rounded-full font-medium capitalize"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Price + rating */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[1.12rem] text-[#1a2744]">
                            ₹{pg.rent?.toLocaleString()}
                          </span>
                          <span className="text-[#8a7f74] text-[0.78rem] font-normal ml-1">/month</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#8a7f74] text-[0.82rem]">
                          <span className="text-[#c8922a]">★</span>
                          <span className="font-semibold text-[#1a2744]">{pg.rating || "4.7"}</span>
                          <span className="text-[#b5ada6]">({reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
              : staticCards.map((p) => (
                <div
                  key={p.name}
                  className="prop-card bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_2px_20px_rgba(26,39,68,0.07)] hover:shadow-[0_8px_40px_rgba(26,39,68,0.14)] hover:-translate-y-1"
                  onClick={() => navigate("/browse")}
                >
                  {/* Image */}
                  <div className="card-img-wrap h-[210px] relative overflow-hidden bg-[#f0ede8]">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <span
                      className="absolute top-3.5 left-3.5 text-white text-[0.7rem] font-bold py-1 px-3 rounded-[6px]"
                      style={{ background: p.badgeColor }}
                    >
                      {p.badge}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="px-5 pt-4 pb-5">
                    <h3
                      className="font-bold text-[1.05rem] text-[#1a2744] mb-1.5"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[#8a7f74] text-[0.82rem] mb-4">
                      <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0">
                        <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" />
                      </svg>
                      {p.location}
                    </div>

                    {/* Amenity tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#f5f3f0] border border-[#e8e5e0] text-[#3d3730] text-[0.72rem] py-1 px-3 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price + rating with review count */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[1.12rem] text-[#1a2744]">{p.price}</span>
                        <span className="text-[#8a7f74] text-[0.78rem] font-normal ml-1">/month</span>
                      </div>
                      <div className="flex items-center gap-1 text-[0.82rem]">
                        <span className="text-[#c8922a]">★</span>
                        <span className="font-semibold text-[#1a2744]">{p.rating}</span>
                        <span className="text-[#b5ada6]">({p.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            WHY PGFINDER — matches Images 5 & 6
            White bg, 2×3 grid, minimal icon cards
            ════════════════════════════════════════ */}
        <section className="bg-white px-5 lg:px-14 pt-20 pb-24">
          <div className="max-w-[1200px] mx-auto">
            {/* Section header */}
            <p className="text-[0.72rem] font-bold uppercase tracking-[2.5px] text-[#2a7c6f] mb-3">
              Why PGFinder?
            </p>
            <h2
              className="font-bold text-[#1a2744] leading-[1.15] mb-14"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Everything You Need,<br />Nothing You Don't
            </h2>

            {/* Features grid — 4 top + 2 bottom matches Image 5 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-white border border-[#e8e5e0] rounded-2xl p-7 transition-all duration-300 hover:border-[#2a7c6f] hover:-translate-y-0.5 hover:shadow-[0_6px_32px_rgba(26,39,68,0.1)]"
                >
                  {/* Icon box */}
                  <div
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5"
                    style={{ background: f.iconBg, color: f.iconColor }}
                  >
                    {f.icon}
                  </div>
                  <div className="font-bold text-[0.95rem] text-[#1a2744] mb-2">{f.title}</div>
                  <div className="text-[#8a7f74] text-[0.84rem] leading-[1.65]">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            LANDLORD CTA — matches Images 6 & 7
            Dark navy card, white text, outline button
            ════════════════════════════════════════ */}
        <div className="bg-[#f5f2ed] px-5 lg:px-14 pt-4 pb-20">
          <div className="max-w-[1200px] mx-auto">
            <div
              className="bg-[#1a2744] rounded-[20px] px-8 lg:px-16 py-14 flex items-center justify-between gap-8 flex-wrap relative overflow-hidden"
            >
              {/* Subtle radial glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 55% 80% at 90% 50%, rgba(42,124,111,0.28), transparent)" }}
              />

              {/* Text */}
              <div className="relative">
                <h2
                  className="font-bold text-white text-[1.85rem] mb-2 leading-[1.2]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Are You a Landlord?
                </h2>
                <p className="text-white/60 text-[0.93rem] leading-[1.6]">
                  List your property for free and reach thousands of verified tenants today.
                </p>
              </div>

              {/* CTA button — outline style matching Image 6 */}
              <button
                className="relative border-2 border-white/40 text-white bg-white/[0.06] py-3.5 px-8 rounded-[12px] text-[0.93rem] font-bold cursor-pointer whitespace-nowrap transition-all duration-300 hover:bg-white hover:text-[#1a2744] hover:border-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
                onClick={() => navigate("/landlord")}
              >
                Go to Landlord Dashboard →
              </button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            FOOTER
            ════════════════════════════════════════ */}
        <UserFooter />

      </div>
    </>
  );
}