import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const GENDER_MAP = { male: "Boys Only", female: "Girls Only", unisex: "Co-ed" };
const AMENITY_ICONS = {
  wifi: "", meals: "", laundry: "", ac: "",
  gym: "", parking: "", security: "",
};
const PG_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&q=70",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=70",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=70",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=70",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=70",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&q=70",
];

export const BrowsePG = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertyImages, setPropertyImages] = useState({}); // { pgId: [url, ...] }
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pgWishlist") || "[]"); } catch { return []; }
  });

  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [gender, setGender] = useState("");
  const [selAmenities, setSelAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");

  const AMENITY_OPTIONS = ["wifi", "meals", "laundry", "ac", "gym", "parking", "security"];

  const fetchProperties = async (currentSort = sortBy) => {
    setLoading(true);
    try {
      const params = {};
      if (location) params.location = location;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (gender) params.gender = gender;
      if (selAmenities.length) params.amenities = selAmenities.join(",");
      const res = await axios.get("/properties", { params });
      let data = res.data.data || [];
      if (currentSort === "low") data = [...data].sort((a, b) => a.rent - b.rent);
      else if (currentSort === "high") data = [...data].sort((a, b) => b.rent - a.rent);
      else if (currentSort === "newest") data = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProperties(data);

      // Fetch real images for all properties in parallel (silently)
      fetchAllImages(data);
    } catch {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  // Fetch images for all properties — populates propertyImages map
  const fetchAllImages = async (props) => {
    const results = await Promise.allSettled(
      props.map(p =>
        axios.get(`/propertyimage/${p._id}`)
          .then(r => {
            const d = r.data;
            const arr = Array.isArray(d) ? d : (d?.images || d?.data || []);
            const urls = arr.map(img => img?.imageUrl || img?.url || img).filter(s => typeof s === "string" && s.startsWith("http"));
            return { id: p._id, urls };
          })
          .catch(() => ({ id: p._id, urls: [] }))
      )
    );
    const map = {};
    results.forEach(r => {
      if (r.status === "fulfilled") map[r.value.id] = r.value.urls;
    });
    setPropertyImages(map);
  };

  // Read URL params on mount (from UserHome search) and pre-fill filters, then fetch
  useEffect(() => {
    const loc = searchParams.get("location") || "";
    const minP = searchParams.get("minPrice") || "";
    const maxP = searchParams.get("maxPrice") || "";
    const rt = searchParams.get("roomType") || "";
    const gen = searchParams.get("gender") || "";

    // Pre-fill sidebar filter state from URL
    if (loc) setLocation(loc);
    if (minP) setMinPrice(minP);
    if (maxP) setMaxPrice(maxP);
    if (gen) setGender(gen);

    // Build params directly from URL (state update is async, so pass them inline)
    const fetchWithUrlParams = async () => {
      setLoading(true);
      try {
        const params = {};
        if (loc) params.location = loc;
        if (minP) params.minPrice = minP;
        if (maxP) params.maxPrice = maxP;
        if (gen) params.gender = gen;
        if (rt) params.roomType = rt;
        const res = await axios.get("/properties", { params });
        let data = res.data.data || [];
        setProperties(data);
        fetchAllImages(data);
      } catch {
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchWithUrlParams();
  }, [searchParams]);

  const toggleAmenity = (a) =>
    setSelAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const clearFilters = () => {
    setLocation(""); setMinPrice(""); setMaxPrice(""); setGender(""); setSelAmenities([]); setSortBy("relevance");
    setTimeout(() => fetchProperties("relevance"), 0);
  };

  const toggleWishlist = (e, propId) => {
    e.stopPropagation();
    const saved = wishlist.includes(propId);
    const next = saved ? wishlist.filter((id) => id !== propId) : [...wishlist, propId];
    setWishlist(next);
    localStorage.setItem("pgWishlist", JSON.stringify(next));
    toast.success(saved ? "Removed from wishlist" : "Saved to wishlist ❤️");
    const existing = JSON.parse(localStorage.getItem("pgWishlistData") || "[]");
    const prop = properties.find((p) => p._id === propId);
    if (!saved && prop) {
      localStorage.setItem("pgWishlistData", JSON.stringify([...existing.filter((p) => p._id !== propId), prop]));
    } else {
      localStorage.setItem("pgWishlistData", JSON.stringify(existing.filter((p) => p._id !== propId)));
    }
  };

  const getBadge = (p, idx) => {
    if (idx % 3 === 0) return { bg: "#1a2744", label: "Verified" };
    if (idx % 3 === 1) return { bg: "#2a7c6f", label: "Top Rated" };
    return { bg: "#e05a3a", label: "New" };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
        .skeleton { background: linear-gradient(90deg,#f0ede8 25%,#e2ddd6 50%,#f0ede8 75%); background-size:200% 100%; animation: shimmer 1.5s infinite; border-radius:8px; }
        .prop-img-hover:hover img { transform: scale(1.05); }
        .wish-saved svg { fill: #e05a3a; stroke: #e05a3a; }
        .wish-unsaved svg { fill: none; stroke: #666; }
      `}</style>

      <div className="flex min-h-[calc(100vh-68px)]" style={{ fontFamily: "'Outfit', sans-serif" }}>

        {/* Filter Sidebar - hidden on mobile */}
        <aside className="hidden md:block w-[272px] flex-shrink-0 bg-white border-r border-[#e2ddd6] px-5 py-7 sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto">
          <div className="flex items-center justify-between mb-6 pb-3.5 border-b border-[#e2ddd6]">
            <span className="font-bold text-[1.05rem] text-[#1a2744]" style={{ fontFamily: "'Fraunces', serif" }}>Filters</span>
            <span className="text-[0.75rem] font-semibold text-[#2a7c6f] cursor-pointer" onClick={clearFilters}>Clear all</span>
          </div>

          {/* City */}
          <div className="mb-5 pb-5 border-b border-[#e2ddd6]">
            <span className="block text-[0.68rem] font-bold uppercase tracking-[1.5px] text-[#8a7f74] mb-2.5">City / Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru, Mumbai"
              className="w-full bg-[#faf9f7] border border-[#e2ddd6] rounded-[8px] py-[9px] px-3 text-[0.85rem] text-[#1a1a1a] outline-none focus:border-[#2a7c6f]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            />
          </div>

          {/* Budget */}
          <div className="mb-5 pb-5 border-b border-[#e2ddd6]">
            <span className="block text-[0.68rem] font-bold uppercase tracking-[1.5px] text-[#8a7f74] mb-2.5">Budget Range (₹/month)</span>
            <div className="flex items-center gap-2">
              <input
                type="number" placeholder="Min" value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1 w-0 bg-[#faf9f7] border border-[#e2ddd6] rounded-[8px] py-[9px] px-2.5 text-[0.85rem] text-[#1a1a1a] outline-none focus:border-[#2a7c6f]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              />
              <span className="text-[#8a7f74] text-[0.85rem]">–</span>
              <input
                type="number" placeholder="Max" value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1 w-0 bg-[#faf9f7] border border-[#e2ddd6] rounded-[8px] py-[9px] px-2.5 text-[0.85rem] text-[#1a1a1a] outline-none focus:border-[#2a7c6f]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="mb-5 pb-5 border-b border-[#e2ddd6]">
            <span className="block text-[0.68rem] font-bold uppercase tracking-[1.5px] text-[#8a7f74] mb-2.5">Gender</span>
            {[["", "All"], ["female", "Girls Only"], ["male", "Boys Only"], ["unisex", "Co-ed"]].map(([val, label]) => (
              <label key={val} className="flex items-center gap-2 text-[0.85rem] text-[#3d3730] py-[5px] cursor-pointer hover:text-[#1a2744] transition-colors duration-200">
                <input type="radio" name="gender" checked={gender === val} onChange={() => setGender(val)} className="accent-[#2a7c6f] w-3.5 h-3.5 cursor-pointer" />
                {label}
              </label>
            ))}
          </div>

          {/* Amenities */}
          <div className="mb-5">
            <span className="block text-[0.68rem] font-bold uppercase tracking-[1.5px] text-[#8a7f74] mb-2.5">Amenities</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {AMENITY_OPTIONS.map((a) => (
                <div
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`py-1 px-[11px] rounded-[20px] text-[0.73rem] font-medium cursor-pointer transition-all duration-300 ${
                    selAmenities.includes(a)
                      ? "bg-[#e8f5f3] border border-[#2a7c6f] text-[#2a7c6f] font-semibold"
                      : "bg-[#faf9f7] border border-[#e2ddd6] text-[#3d3730]"
                  }`}
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {AMENITY_ICONS[a]} {a.charAt(0).toUpperCase() + a.slice(1)}
                </div>
              ))}
            </div>
          </div>

          <button
            className="w-full py-3 rounded-[10px] bg-[#2a7c6f] text-white border-none text-[0.92rem] font-bold cursor-pointer mt-2 transition-all duration-300 hover:bg-[#3a9e8e] hover:-translate-y-px"
            style={{ fontFamily: "'Outfit', sans-serif" }}
            onClick={fetchProperties}
          >
            Apply Filters
          </button>
        </aside>

        {/* Listings Main */}
        <div className="flex-1 px-5 md:px-9 py-7 overflow-y-auto">
          {/* Topbar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-[1.55rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces', serif" }}>
                {location ? `PGs in ${location}` : "All PGs"}
              </h2>
              <p className="text-[#8a7f74] text-[0.85rem] mt-0.5">
                {loading ? "Loading..." : `Showing ${properties.length} verified propert${properties.length === 1 ? "y" : "ies"}`}
              </p>
            </div>
            <select
              value={sortBy}
              onChange={(e) => { const val = e.target.value; setSortBy(val); fetchProperties(val); }}
              className="bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] py-2 px-3.5 text-[0.85rem] text-[#3d3730] outline-none cursor-pointer transition-all duration-300 focus:border-[#2a7c6f]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Skeleton loaders */}
          {loading && (
            <div className="grid gap-[22px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border border-[#e2ddd6] rounded-[14px] overflow-hidden shadow-[0_2px_16px_rgba(26,39,68,0.08)]">
                  <div className="skeleton h-[195px]" />
                  <div className="p-[18px_20px]">
                    <div className="skeleton h-3.5 rounded mb-2.5" />
                    <div className="skeleton h-2.5 w-[60%] rounded mb-3.5" />
                    <div className="skeleton h-3.5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Property grid */}
          {!loading && properties.length > 0 && (
            <div className="grid gap-[22px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
              {properties.map((p, idx) => {
                const badge = getBadge(p, idx);
                // Use first uploaded image if available, otherwise fall back to stock photo
                const realImages = propertyImages[p._id] || [];
                const imgSrc = realImages.length > 0 ? realImages[0] : PG_IMAGES[idx % PG_IMAGES.length];
                const isSaved = wishlist.includes(p._id);

                return (
                  <div
                    key={p._id}
                    className="prop-img-hover bg-white border border-[#e2ddd6] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_2px_16px_rgba(26,39,68,0.08)] hover:-translate-y-[5px] hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)] hover:border-transparent relative"
                    onClick={() => navigate(`/property/${p._id}`)}
                  >
                    {/* Image */}
                    <div className="h-[195px] relative overflow-hidden bg-[#f0ede8]">
                      <img
                        src={imgSrc}
                        alt={p.pgName}
                        className="w-full h-full object-cover transition-transform duration-400"
                        onError={(e) => {
                          // Fall back to stock photo if real image fails
                          const fallback = PG_IMAGES[idx % PG_IMAGES.length];
                          if (e.target.src !== fallback) e.target.src = fallback;
                        }}
                      />
                      <div className="absolute top-3 left-3 text-[0.67rem] font-bold tracking-[0.5px] py-1 px-[11px] rounded-[6px] text-white" style={{ background: badge.bg }}>
                        {badge.label}
                      </div>
                      {/* Real photo count badge */}
                      {realImages.length > 1 && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/55 text-white text-[0.65rem] font-semibold py-[3px] px-2 rounded-[5px] backdrop-blur-sm">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                          {realImages.length} photos
                        </div>
                      )}
                      {/* Wishlist button */}
                      <button
                        className={`absolute top-3 right-3 w-[34px] h-[34px] rounded-full bg-white/92 border-none cursor-pointer flex items-center justify-center transition-all duration-300 z-[2] backdrop-blur-sm hover:bg-white hover:scale-110 ${isSaved ? "wish-saved" : "wish-unsaved"}`}
                        onClick={(e) => toggleWishlist(e, p._id)}
                        title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="transition-all duration-300">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-[18px_20px]">
                      <div className="font-bold text-[1.07rem] text-[#1a2744] mb-1" style={{ fontFamily: "'Fraunces', serif" }}>{p.pgName}</div>
                      <div className="text-[#8a7f74] text-[0.8rem] mb-3 flex items-center gap-[5px]">
                        <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" />
                        </svg>
                        {p.area ? `${p.area}, ` : ""}{p.city}
                      </div>
                      <div className="flex gap-[5px] flex-wrap mb-3.5">
                        {p.amenities?.slice(0, 3).map((a, i) => (
                          <span key={i} className="bg-[#f0ede8] border border-[#e2ddd6] text-[#3d3730] text-[0.71rem] py-[3px] px-2.5 rounded-[20px] font-medium">
                            {AMENITY_ICONS[a] || ""} {a}
                          </span>
                        ))}
                        {p.amenities?.length > 3 && (
                          <span className="bg-[#f0ede8] border border-[#e2ddd6] text-[#3d3730] text-[0.71rem] py-[3px] px-2.5 rounded-[20px] font-medium">
                            +{p.amenities.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between border-t border-[#e2ddd6] pt-3.5 mt-0.5">
                        <div>
                          <div className="font-bold text-[1.08rem] text-[#1a2744]">
                            ₹{p.rent?.toLocaleString()} <span className="text-[#8a7f74] text-[0.76rem] font-normal">/month</span>
                          </div>
                          <div className="text-[0.72rem] text-[#8a7f74] mt-[3px]">{p.roomCategories?.length > 1 ? "Starting from · " : ""}{GENDER_MAP[p.gender] || p.gender}</div>
                        </div>
                        <div className="flex items-center gap-1 text-[#c8922a] text-[0.8rem] font-bold">
                          ★ {(4.2 + (idx % 8) * 0.1).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <svg className="w-14 h-14 text-[#e2ddd6] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
              <h3 className="text-[1.3rem] font-bold text-[#1a2744] mb-2" style={{ fontFamily: "'Fraunces', serif" }}>No properties found</h3>
              <p className="text-[#8a7f74] text-[0.9rem]">Try adjusting your filters or clearing them to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BrowsePG;