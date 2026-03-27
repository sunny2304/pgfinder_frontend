import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const BrowsePG = () => {
  const navigate = useNavigate();

  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters state
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [gender, setGender] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");

  const amenityList = ["wifi", "ac", "meals", "laundry", "gym", "parking", "security"];

  // ── Fetch PGs from backend
  const fetchPGs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (location) params.location = location;
      if (gender) params.gender = gender;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(",");

      const res = await axios.get("/properties", { params });
      let data = res.data.data || [];

      // sort on frontend (simple)
      if (sortBy === "low") data = [...data].sort((a, b) => a.rent - b.rent);
      if (sortBy === "high") data = [...data].sort((a, b) => b.rent - a.rent);
      if (sortBy === "newest") data = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPgs(data);
    } catch (err) {
      console.error("Error fetching PGs:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPGs();
  }, [sortBy]);

  // toggle amenity chip
  const toggleAmenity = (item) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // apply filters
  const handleApply = () => {
    fetchPGs();
  };

  // clear all filters
  const handleClear = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setGender("");
    setSelectedAmenities([]);
    setSortBy("relevance");
    // fetch with empty params
    setTimeout(() => fetchPGs(), 0);
  };

  // badge helper
  const getBadge = (pg) => {
    if (pg.verified) return { label: "Verified", color: "#1a2744" };
    if (pg.topRated) return { label: "Top Rated", color: "#2a7c6f" };
    return null;
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f5f2ed", minHeight: "100vh", paddingTop: 68 }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .filter-check-label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #3d3730; cursor: pointer; padding: 4px 0; }
        .filter-check-label input { accent-color: #2a7c6f; width: 15px; height: 15px; }
        .amenity-chip { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; cursor: pointer; border: 1.5px solid #e2ddd6; background: #faf9f7; color: #8a7f74; transition: all 0.2s; text-transform: capitalize; }
        .amenity-chip.sel { border-color: #2a7c6f; background: #e8f5f3; color: #2a7c6f; }
        .prop-card { background: #fff; border: 1px solid #e2ddd6; border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 2px 16px rgba(26,39,68,0.08); }
        .prop-card:hover { transform: translateY(-5px); box-shadow: 0 8px 40px rgba(26,39,68,0.13); border-color: transparent; }
        .sort-select { background: #fff; border: 1.5px solid #e2ddd6; border-radius: 9px; color: #1a2744; font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 500; padding: 9px 14px; outline: none; cursor: pointer; }
        .sort-select:focus { border-color: #2a7c6f; }
        .filter-input { width: 100%; background: #faf9f7; border: 1.5px solid #e2ddd6; border-radius: 9px; color: #1a1a1a; font-family: 'Outfit', sans-serif; font-size: 0.88rem; padding: 10px 13px; outline: none; transition: border-color 0.2s; }
        .filter-input:focus { border-color: #2a7c6f; }
      `}</style>

      <div style={{ display: "flex", maxWidth: 1400, margin: "0 auto", padding: "28px 24px", gap: 24 }}>

        {/* ── FILTER SIDEBAR ── */}
        <aside style={{
          width: 260, flexShrink: 0,
          background: "#fff", border: "1px solid #e2ddd6",
          borderRadius: 16, padding: "24px 20px",
          height: "fit-content", position: "sticky", top: 88,
          boxShadow: "0 2px 16px rgba(26,39,68,0.08)",
        }}>

          {/* Sidebar header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.05rem", fontWeight: 700, color: "#1a2744" }}>
              Filters
            </h3>
            <button
              onClick={handleClear}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "#2a7c6f", fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}
            >
              Clear all
            </button>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#8a7f74", marginBottom: 10 }}>
              Location / City
            </div>
            <input
              className="filter-input"
              type="text"
              placeholder="e.g. Bengaluru, Pune..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Budget */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#8a7f74", marginBottom: 10 }}>
              Budget Range (₹/month)
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                className="filter-input"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{ width: "50%" }}
              />
              <span style={{ color: "#8a7f74", fontWeight: 600 }}>–</span>
              <input
                className="filter-input"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ width: "50%" }}
              />
            </div>
          </div>

          {/* Gender */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#8a7f74", marginBottom: 10 }}>
              Gender
            </div>
            {[{ label: "Girls Only", val: "female" }, { label: "Boys Only", val: "male" }, { label: "Co-ed", val: "unisex" }].map((g) => (
              <label key={g.val} className="filter-check-label">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === g.val}
                  onChange={() => setGender(g.val)}
                  style={{ accentColor: "#2a7c6f" }}
                />
                {g.label}
              </label>
            ))}
            {gender && (
              <button onClick={() => setGender("")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#8a7f74", marginTop: 4, fontFamily: "'Outfit', sans-serif" }}>
                × Clear gender
              </button>
            )}
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#8a7f74", marginBottom: 10 }}>
              Amenities
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {amenityList.map((item) => (
                <div
                  key={item}
                  className={`amenity-chip ${selectedAmenities.includes(item) ? "sel" : ""}`}
                  onClick={() => toggleAmenity(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            style={{
              width: "100%", background: "#2a7c6f", color: "#fff",
              border: "none", borderRadius: 10, padding: "12px 0",
              fontFamily: "'Outfit', sans-serif", fontSize: "0.93rem",
              fontWeight: 700, cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1f6159"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#2a7c6f"}
          >
            Apply Filters
          </button>
        </aside>

        {/* ── LISTINGS MAIN ── */}
        <div style={{ flex: 1 }}>

          {/* Topbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.7rem", fontWeight: 700, color: "#1a2744" }}>
                {location ? `PGs in ${location}` : "Browse All PGs"}
              </h2>
              <p style={{ color: "#8a7f74", fontSize: "0.85rem", marginTop: 3 }}>
                Showing {pgs.length} verified {pgs.length === 1 ? "property" : "properties"}
              </p>
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#8a7f74" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
              <p style={{ fontWeight: 500 }}>Finding the best PGs for you...</p>
            </div>
          )}

          {/* No results */}
          {!loading && pgs.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🏠</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", color: "#1a2744", marginBottom: 8 }}>
                No PGs found
              </h3>
              <p style={{ color: "#8a7f74" }}>Try adjusting your filters or search a different location.</p>
              <button
                onClick={handleClear}
                style={{
                  marginTop: 20, background: "#1a2744", color: "#fff",
                  border: "none", borderRadius: 10, padding: "11px 24px",
                  fontFamily: "'Outfit', sans-serif", fontWeight: 600, cursor: "pointer",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* PG Cards Grid */}
          {!loading && pgs.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 22 }}>
              {pgs.map((pg) => {
                const badge = getBadge(pg);
                return (
                  <div
                    key={pg._id}
                    className="prop-card"
                    onClick={() => navigate(`/user/property/${pg._id}`)}
                  >
                    {/* Image */}
                    <div style={{ height: 200, position: "relative", overflow: "hidden", background: "#e8f5f3" }}>
                      {pg.image ? (
                        <img
                          src={pg.image}
                          alt={pg.pgName}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #e8f5f3, #c8e8e3)" }}>
                          <svg width="60" height="60" viewBox="0 0 64 64" fill="none" opacity="0.35">
                            <path d="M10 32L32 14l22 18v20H10V32z" stroke="#2a7c6f" strokeWidth="2.5" fill="#2a7c6f" fillOpacity="0.15" />
                          </svg>
                        </div>
                      )}
                      {badge && (
                        <span style={{
                          position: "absolute", top: 12, left: 12,
                          background: badge.color, color: "#fff",
                          fontSize: "0.68rem", fontWeight: 700,
                          padding: "4px 12px", borderRadius: 6,
                        }}>
                          {badge.label}
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: 20 }}>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.08rem", fontWeight: 700, color: "#1a2744", marginBottom: 4 }}>
                        {pg.pgName}
                      </div>
                      <div style={{ color: "#8a7f74", fontSize: "0.82rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" />
                        </svg>
                        {pg.area}, {pg.city}
                      </div>

                      {/* Amenity tags */}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                        {(pg.amenities || []).slice(0, 3).map((tag) => (
                          <span key={tag} style={{
                            background: "#f0ede8", border: "1px solid #e2ddd6",
                            color: "#3d3730", fontSize: "0.72rem",
                            padding: "4px 11px", borderRadius: 20, fontWeight: 500,
                            textTransform: "capitalize",
                          }}>
                            {tag}
                          </span>
                        ))}
                        {pg.gender && (
                          <span style={{
                            background: "#eef2fb", border: "1px solid #d4e0f8",
                            color: "#3b6bcc", fontSize: "0.72rem",
                            padding: "4px 11px", borderRadius: 20, fontWeight: 500,
                            textTransform: "capitalize",
                          }}>
                            {pg.gender}
                          </span>
                        )}
                      </div>

                      {/* Price + rating row */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e2ddd6", paddingTop: 14 }}>
                        <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1a2744" }}>
                          ₹{pg.rent?.toLocaleString()}
                          <span style={{ color: "#8a7f74", fontSize: "0.76rem", fontWeight: 400 }}> /month</span>
                        </div>
                        <div style={{ color: "#c8922a", fontSize: "0.82rem", fontWeight: 700 }}>
                          ★ {pg.rating || "New"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePG