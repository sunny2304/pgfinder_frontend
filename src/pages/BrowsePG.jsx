import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
:root{
  --bg:#f5f2ed;--white:#fff;--surface:#faf9f7;--surface2:#f0ede8;--border:#e2ddd6;
  --navy:#1a2744;--navy2:#243356;--teal:#2a7c6f;--teal-light:#3a9e8e;--teal-pale:#e8f5f3;
  --coral:#e05a3a;--coral-pale:#fdf0ec;--gold:#c8922a;--gold-pale:#fdf6e8;
  --blue:#3b6bcc;--blue-pale:#eef2fb;--text:#1a1a1a;--text2:#3d3730;--muted:#8a7f74;
  --radius:14px;--shadow:0 2px 16px rgba(26,39,68,.08);--shadow-lg:0 8px 40px rgba(26,39,68,.13);
  --tr:0.25s cubic-bezier(.4,0,.2,1);
}
.browse-layout{display:flex;min-height:calc(100vh - 68px);}

/* Filter Sidebar */
.filter-sidebar{
  width:272px;flex-shrink:0;background:var(--white);border-right:1px solid var(--border);
  padding:28px 20px;position:sticky;top:68px;height:calc(100vh - 68px);overflow-y:auto;
}
.filter-sidebar h3{font-family:'Fraunces',serif;font-size:1.05rem;font-weight:700;color:var(--navy);
  display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:14px;
  border-bottom:1px solid var(--border);}
.filter-sidebar h3 span{font-family:'Outfit',sans-serif;font-size:0.75rem;font-weight:600;
  color:var(--teal);cursor:pointer;letter-spacing:0;}
.filter-group{margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--border);}
.filter-group:last-of-type{border-bottom:none;}
.filter-label{font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;
  color:var(--muted);display:block;margin-bottom:10px;}
.filter-check{display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--text2);
  padding:5px 0;cursor:pointer;transition:color var(--tr);}
.filter-check:hover{color:var(--navy);}
.filter-check input{accent-color:var(--teal);width:14px;height:14px;cursor:pointer;}
.range-inputs{display:flex;align-items:center;gap:8px;}
.range-inputs input{flex:1;background:var(--surface);border:1.5px solid var(--border);
  border-radius:8px;padding:9px 10px;font-family:'Outfit',sans-serif;font-size:0.85rem;
  color:var(--text);outline:none;transition:var(--tr);width:0;}
.range-inputs input:focus{border-color:var(--teal);}
.range-sep{color:var(--muted);font-size:0.85rem;}
.amenity-chips-filter{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;}
.amenity-chip-f{background:var(--surface);border:1.5px solid var(--border);color:var(--text2);
  padding:4px 11px;border-radius:20px;font-size:0.73rem;font-weight:500;cursor:pointer;
  transition:var(--tr);font-family:'Outfit',sans-serif;}
.amenity-chip-f.sel{background:var(--teal-pale);border-color:var(--teal);color:var(--teal);font-weight:600;}
.btn-apply{width:100%;padding:12px;border-radius:10px;background:var(--teal);color:#fff;
  border:none;font-family:'Outfit',sans-serif;font-size:0.92rem;font-weight:700;cursor:pointer;
  margin-top:8px;transition:var(--tr);}
.btn-apply:hover{background:var(--teal-light);transform:translateY(-1px);}

/* Listings Main */
.listings-main{flex:1;padding:28px 36px;overflow-y:auto;}
.listings-topbar{display:flex;align-items:center;justify-content:space-between;
  margin-bottom:24px;flex-wrap:wrap;gap:12px;}
.listings-topbar h2{font-family:'Fraunces',serif;font-size:1.55rem;font-weight:700;color:var(--navy);}
.listings-topbar p{color:var(--muted);font-size:0.85rem;margin-top:2px;}
.sort-select{background:var(--surface);border:1.5px solid var(--border);border-radius:9px;
  padding:8px 14px;font-family:'Outfit',sans-serif;font-size:0.85rem;color:var(--text2);
  outline:none;cursor:pointer;transition:var(--tr);}
.sort-select:focus{border-color:var(--teal);}

/* Property Grid */
.prop-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:22px;}
.prop-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);
  overflow:hidden;cursor:pointer;transition:var(--tr);box-shadow:var(--shadow);position:relative;}
.prop-card:hover{transform:translateY(-5px);box-shadow:var(--shadow-lg);border-color:transparent;}
.prop-img{height:195px;position:relative;overflow:hidden;background:var(--surface2);}
.prop-img-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,#e8f5f3,#c8e8e3);}
.prop-badge{position:absolute;top:12px;left:12px;font-size:0.67rem;font-weight:700;
  letter-spacing:0.5px;padding:4px 11px;border-radius:6px;}
.badge-verified{background:var(--navy);color:#fff;}
.badge-top{background:var(--teal);color:#fff;}
.badge-new{background:var(--coral);color:#fff;}

/* Wishlist heart */
.wish-btn{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:50%;
  background:rgba(255,255,255,0.92);border:none;cursor:pointer;display:flex;align-items:center;
  justify-content:center;transition:var(--tr);z-index:2;backdrop-filter:blur(6px);}
.wish-btn:hover{background:#fff;transform:scale(1.1);}
.wish-btn svg{width:16px;height:16px;transition:var(--tr);}
.wish-btn.saved svg{fill:var(--coral);stroke:var(--coral);}
.wish-btn:not(.saved) svg{fill:none;stroke:#666;}

.prop-body{padding:18px 20px;}
.prop-name{font-family:'Fraunces',serif;font-size:1.07rem;font-weight:700;color:var(--navy);margin-bottom:4px;}
.prop-loc{color:var(--muted);font-size:0.8rem;margin-bottom:12px;display:flex;align-items:center;gap:5px;}
.prop-tags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px;}
.tag{background:var(--surface2);border:1px solid var(--border);color:var(--text2);
  font-size:0.71rem;padding:3px 10px;border-radius:20px;font-weight:500;}
.prop-footer{display:flex;align-items:center;justify-content:space-between;
  border-top:1px solid var(--border);padding-top:14px;margin-top:2px;}
.prop-price{font-weight:700;font-size:1.08rem;color:var(--navy);}
.prop-price span{color:var(--muted);font-size:0.76rem;font-weight:400;}
.prop-rating{display:flex;align-items:center;gap:4px;color:var(--gold);font-size:0.8rem;font-weight:700;}
.prop-gender{font-size:0.72rem;color:var(--muted);margin-top:3px;}

/* Empty state */
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:80px 24px;text-align:center;}
.empty-state svg{width:56px;height:56px;color:var(--border);margin-bottom:16px;}
.empty-state h3{font-family:'Fraunces',serif;font-size:1.3rem;font-weight:700;color:var(--navy);margin-bottom:8px;}
.empty-state p{color:var(--muted);font-size:0.9rem;}

/* Skeleton loader */
.skeleton{background:linear-gradient(90deg,var(--surface2) 25%,var(--border) 50%,var(--surface2) 75%);
  background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px;}
@keyframes shimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
.skel-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);}
.skel-img{height:195px;}
.skel-body{padding:18px 20px;}
.skel-line{height:14px;border-radius:4px;margin-bottom:10px;}
.skel-line.sm{height:10px;width:60%;}

@media(max-width:900px){
  .filter-sidebar{display:none;}
  .listings-main{padding:20px 16px;}
}
`;

const GENDER_MAP = { male: "Boys Only", female: "Girls Only", unisex: "Co-ed" };
const AMENITY_ICONS = {
  wifi: "📶", meals: "🍽️", laundry: "👕", ac: "❄️",
  gym: "💪", parking: "🅿️", security: "🔒"
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
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pgWishlist") || "[]"); } catch { return []; }
  });

  // Filters
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [gender, setGender] = useState("");
  const [selAmenities, setSelAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");

  const AMENITY_OPTIONS = ["wifi", "meals", "laundry", "ac", "gym", "parking", "security"];

  const fetchProperties = async () => {
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

      if (sortBy === "low") data = [...data].sort((a, b) => a.rent - b.rent);
      else if (sortBy === "high") data = [...data].sort((a, b) => b.rent - a.rent);
      else if (sortBy === "newest") data = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setProperties(data);
    } catch {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const toggleAmenity = (a) =>
    setSelAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const clearFilters = () => {
    setLocation(""); setMinPrice(""); setMaxPrice(""); setGender(""); setSelAmenities([]);
    setTimeout(fetchProperties, 0);
  };

  const toggleWishlist = (e, propId) => {
    e.stopPropagation();
    const saved = wishlist.includes(propId);
    const next = saved ? wishlist.filter(id => id !== propId) : [...wishlist, propId];
    setWishlist(next);
    localStorage.setItem("pgWishlist", JSON.stringify(next));
    toast.success(saved ? "Removed from wishlist" : "Saved to wishlist ❤️");
    // Store full property data too
    const existing = JSON.parse(localStorage.getItem("pgWishlistData") || "[]");
    const prop = properties.find(p => p._id === propId);
    if (!saved && prop) {
      const updated = [...existing.filter(p => p._id !== propId), prop];
      localStorage.setItem("pgWishlistData", JSON.stringify(updated));
    } else {
      const updated = existing.filter(p => p._id !== propId);
      localStorage.setItem("pgWishlistData", JSON.stringify(updated));
    }
  };

  const getBadge = (p, idx) => {
    if (idx % 3 === 0) return { cls: "badge-verified", label: "Verified" };
    if (idx % 3 === 1) return { cls: "badge-top", label: "Top Rated" };
    return { cls: "badge-new", label: "New" };
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="browse-layout">
        {/* ── FILTER SIDEBAR ── */}
        <aside className="filter-sidebar">
          <h3>
            Filters
            <span onClick={clearFilters}>Clear all</span>
          </h3>

          {/* City */}
          <div className="filter-group">
            <span className="filter-label">City / Location</span>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru, Mumbai"
              style={{
                width: "100%", background: "var(--surface)", border: "1.5px solid var(--border)",
                borderRadius: 8, padding: "9px 12px", fontFamily: "'Outfit',sans-serif",
                fontSize: "0.85rem", color: "var(--text)", outline: "none"
              }}
            />
          </div>

          {/* Budget */}
          <div className="filter-group">
            <span className="filter-label">Budget Range (₹/month)</span>
            <div className="range-inputs">
              <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              <span className="range-sep">–</span>
              <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>
          </div>

          {/* Gender */}
          <div className="filter-group">
            <span className="filter-label">Gender</span>
            {[["", "All"], ["female", "Girls Only"], ["male", "Boys Only"], ["unisex", "Co-ed"]].map(([val, label]) => (
              <label key={val} className="filter-check">
                <input type="radio" name="gender" checked={gender === val} onChange={() => setGender(val)} />
                {label}
              </label>
            ))}
          </div>

          {/* Amenities */}
          <div className="filter-group">
            <span className="filter-label">Amenities</span>
            <div className="amenity-chips-filter">
              {AMENITY_OPTIONS.map(a => (
                <div
                  key={a}
                  className={`amenity-chip-f${selAmenities.includes(a) ? " sel" : ""}`}
                  onClick={() => toggleAmenity(a)}
                >
                  {AMENITY_ICONS[a]} {a.charAt(0).toUpperCase() + a.slice(1)}
                </div>
              ))}
            </div>
          </div>

          <button className="btn-apply" onClick={fetchProperties}>Apply Filters</button>
        </aside>

        {/* ── LISTINGS MAIN ── */}
        <div className="listings-main">
          <div className="listings-topbar">
            <div>
              <h2>{location ? `PGs in ${location}` : "All PGs"}</h2>
              <p>
                {loading ? "Loading..." : `Showing ${properties.length} verified propert${properties.length === 1 ? "y" : "ies"}`}
              </p>
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); fetchProperties(); }}
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Skeleton loaders */}
          {loading && (
            <div className="prop-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skel-card">
                  <div className="skel-img skeleton" />
                  <div className="skel-body">
                    <div className="skel-line skeleton" />
                    <div className="skel-line sm skeleton" />
                    <div className="skel-line skeleton" style={{ marginTop: 14 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Property grid */}
          {!loading && properties.length > 0 && (
            <div className="prop-grid">
              {properties.map((p, idx) => {
                const badge = getBadge(p, idx);
                const imgSrc = PG_IMAGES[idx % PG_IMAGES.length];
                const isSaved = wishlist.includes(p._id);

                return (
                  <div
                    key={p._id}
                    className="prop-card"
                    onClick={() => navigate(`/user/property/${p._id}`)}
                  >
                    <div className="prop-img">
                      <img
                        src={imgSrc}
                        alt={p.pgName}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                        onError={e => { e.target.style.display = "none"; }}
                      />
                      <div className={`prop-badge ${badge.cls}`}>{badge.label}</div>

                      {/* Wishlist button */}
                      <button
                        className={`wish-btn${isSaved ? " saved" : ""}`}
                        onClick={e => toggleWishlist(e, p._id)}
                        title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                      >
                        <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                      </button>
                    </div>

                    <div className="prop-body">
                      <div className="prop-name">{p.pgName}</div>
                      <div className="prop-loc">
                        <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" />
                        </svg>
                        {p.area ? `${p.area}, ` : ""}{p.city}
                      </div>
                      <div className="prop-tags">
                        {p.amenities?.slice(0, 3).map((a, i) => (
                          <span key={i} className="tag">{AMENITY_ICONS[a] || ""} {a}</span>
                        ))}
                        {p.amenities?.length > 3 && (
                          <span className="tag">+{p.amenities.length - 3}</span>
                        )}
                      </div>
                      <div className="prop-footer">
                        <div>
                          <div className="prop-price">₹{p.rent?.toLocaleString()} <span>/month</span></div>
                          <div className="prop-gender">{GENDER_MAP[p.gender] || p.gender}</div>
                        </div>
                        <div className="prop-rating">★ {(4.2 + (idx % 8) * 0.1).toFixed(1)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && properties.length === 0 && (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
              <h3>No properties found</h3>
              <p>Try adjusting your filters or clearing them to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BrowsePG;