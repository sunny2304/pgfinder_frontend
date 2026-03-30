import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PG_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&q=70",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=70",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=70",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=70",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&q=70",
];

const AMENITY_ICONS = {
  wifi: "📶", meals: "🍽️", laundry: "👕", ac: "❄️",
  gym: "💪", parking: "🅿️", security: "🔒",
};

const SavedPgs = () => {
  const navigate = useNavigate();
  const [savedProps, setSavedProps] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("pgWishlistData") || "[]");
      setSavedProps(data);
    } catch {
      setSavedProps([]);
    }
  }, []);

  const handleRemove = (propId) => {
    const updatedIds = JSON.parse(localStorage.getItem("pgWishlist") || "[]").filter((id) => id !== propId);
    localStorage.setItem("pgWishlist", JSON.stringify(updatedIds));
    const updatedData = savedProps.filter((p) => p._id !== propId);
    localStorage.setItem("pgWishlistData", JSON.stringify(updatedData));
    setSavedProps(updatedData);
    toast.success("Removed from wishlist");
  };

  const avgRent =
    savedProps.length > 0
      ? Math.round(savedProps.reduce((s, p) => s + (p.rent || 0), 0) / savedProps.length)
      : 0;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>

      <div
        className="max-w-[1100px] mx-auto px-6 pt-10 pb-20"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <h1
          className="text-[2rem] font-black text-[#1a2744] mb-1.5"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Saved PGs
        </h1>
        <p className="text-[#8a7f74] text-[0.9rem] mb-8">Your wishlist of properties you love.</p>

        {/* Summary card */}
        {savedProps.length > 0 && (
          <div className="bg-white border border-[#e2ddd6] rounded-[14px] px-7 py-5 mb-8 flex items-center gap-6 shadow-[0_2px_16px_rgba(26,39,68,0.08)]">
            <div className="text-center">
              <div
                className="text-[1.8rem] font-black text-[#1a2744]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {savedProps.length}
              </div>
              <div className="text-[0.75rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mt-0.5">
                Saved Properties
              </div>
            </div>
            <div className="w-px bg-[#e2ddd6] h-10" />
            <div className="text-center">
              <div
                className="text-[1.8rem] font-black text-[#1a2744]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                ₹{avgRent.toLocaleString()}
              </div>
              <div className="text-[0.75rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mt-0.5">
                Avg. Monthly Rent
              </div>
            </div>
            <div className="w-px bg-[#e2ddd6] h-10" />
            <div className="text-center">
              <div
                className="text-[1.8rem] font-black text-[#1a2744]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {[...new Set(savedProps.map((p) => p.city))].length}
              </div>
              <div className="text-[0.75rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mt-0.5">
                Cities
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {savedProps.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[22px]">
            {savedProps.map((p, idx) => {
              const imgSrc = PG_IMAGES[idx % PG_IMAGES.length];
              const rating = (4.2 + ((p.pgName?.length % 8) * 0.1)).toFixed(1);

              return (
                <div
                  key={p._id}
                  className="bg-white border border-[#e2ddd6] rounded-[14px] overflow-hidden transition-all duration-300 shadow-[0_2px_16px_rgba(26,39,68,0.08)] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)] hover:border-transparent relative group"
                >
                  {/* Image */}
                  <div className="h-[195px] overflow-hidden relative bg-[#f0ede8]">
                    <img
                      src={imgSrc}
                      alt={p.pgName}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="absolute top-3 left-3 text-[0.67rem] font-bold tracking-[0.5px] py-1 px-[11px] rounded-[6px] bg-[#1a2744] text-white">
                      Verified
                    </div>
                    <button
                      className="absolute top-3 right-3 w-[34px] h-[34px] rounded-full bg-white/92 border-none cursor-pointer flex items-center justify-center transition-all duration-300 backdrop-blur-sm hover:bg-white hover:scale-110"
                      onClick={() => handleRemove(p._id)}
                      title="Remove from wishlist"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" strokeWidth="2" stroke="#e05a3a" fill="#e05a3a">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-[18px_20px]">
                    <div
                      className="text-[1.07rem] font-bold text-[#1a2744] mb-1"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {p.pgName}
                    </div>
                    <div className="text-[#8a7f74] text-[0.8rem] mb-2.5 flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" />
                      </svg>
                      {p.area ? `${p.area}, ` : ""}{p.city}
                    </div>
                    <div className="flex gap-[5px] flex-wrap mb-3.5">
                      {p.amenities?.slice(0, 3).map((a, i) => (
                        <span
                          key={i}
                          className="bg-[#f0ede8] border border-[#e2ddd6] text-[#3d3730] text-[0.71rem] py-[3px] px-[10px] rounded-[20px] font-medium"
                        >
                          {AMENITY_ICONS[a] || ""} {a}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-[#e2ddd6] pt-3.5">
                      <div className="font-bold text-[1.05rem] text-[#1a2744]">
                        ₹{p.rent?.toLocaleString()}{" "}
                        <span className="text-[#8a7f74] text-[0.76rem] font-normal">/month</span>
                      </div>
                      <div className="text-[#c8922a] text-[0.8rem] font-bold">★ {rating}</div>
                    </div>
                    <div className="flex gap-2 mt-3.5">
                      <button
                        className="flex-1 py-2.5 rounded-[9px] border border-[#e2ddd6] bg-white text-[#1a2744] text-[0.83rem] font-semibold cursor-pointer transition-all duration-300 hover:border-[#1a2744] hover:bg-[#f0ede8]"
                        onClick={() => navigate(`/user/property/${p._id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="flex-1 py-2.5 rounded-[9px] border-none bg-[#2a7c6f] text-white text-[0.83rem] font-bold cursor-pointer transition-all duration-300 hover:bg-[#3a9e8e]"
                        onClick={() => navigate(`/user/property/${p._id}`)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#fdf0ec] flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e05a3a" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <h3
              className="text-[1.4rem] font-bold text-[#1a2744] mb-2"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              No saved PGs yet
            </h3>
            <p className="text-[#8a7f74] text-[0.9rem] mb-6">
              Browse properties and tap the heart icon to save your favourites here.
            </p>
            <button
              className="py-3 px-7 rounded-[11px] bg-[#2a7c6f] text-white border-none text-[0.93rem] font-bold cursor-pointer transition-all duration-300 hover:bg-[#3a9e8e] hover:-translate-y-px"
              onClick={() => navigate("/user/browse")}
            >
              Browse PGs
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SavedPgs;