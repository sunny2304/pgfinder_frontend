import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
:root{
  --bg:#f5f2ed;--white:#fff;--surface:#faf9f7;--surface2:#f0ede8;--border:#e2ddd6;
  --navy:#1a2744;--navy2:#243356;--teal:#2a7c6f;--teal-light:#3a9e8e;--teal-pale:#e8f5f3;
  --coral:#e05a3a;--coral-pale:#fdf0ec;--gold:#c8922a;--text:#1a1a1a;--text2:#3d3730;--muted:#8a7f74;
  --radius:14px;--shadow:0 2px 16px rgba(26,39,68,.08);--shadow-lg:0 8px 40px rgba(26,39,68,.13);
  --tr:0.25s cubic-bezier(.4,0,.2,1);
}
.saved-wrap{max-width:1100px;margin:0 auto;padding:40px 24px 80px;}
.page-title{font-family:'Fraunces',serif;font-size:2rem;font-weight:900;color:var(--navy);margin-bottom:6px;}
.page-sub{color:var(--muted);font-size:0.9rem;margin-bottom:32px;}

/* Summary card */
.summary-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);
  padding:20px 28px;margin-bottom:32px;display:flex;align-items:center;gap:24px;box-shadow:var(--shadow);}
.sc-stat{text-align:center;}
.sc-stat-num{font-family:'Fraunces',serif;font-size:1.8rem;font-weight:900;color:var(--navy);}
.sc-stat-label{font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-top:2px;font-family:'Outfit',sans-serif;}
.sc-divider{width:1px;background:var(--border);height:40px;}

/* Grid */
.saved-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:22px;}
.prop-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);
  overflow:hidden;transition:var(--tr);box-shadow:var(--shadow);position:relative;}
.prop-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:transparent;}
.prop-img{height:195px;overflow:hidden;position:relative;background:var(--surface2);}
.prop-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;}
.prop-card:hover .prop-img img{transform:scale(1.05);}
.prop-badge{position:absolute;top:12px;left:12px;font-size:0.67rem;font-weight:700;
  letter-spacing:0.5px;padding:4px 11px;border-radius:6px;background:var(--navy);color:#fff;}
.remove-btn{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:50%;
  background:rgba(255,255,255,0.92);border:none;cursor:pointer;display:flex;align-items:center;
  justify-content:center;transition:var(--tr);backdrop-filter:blur(6px);}
.remove-btn:hover{background:#fff;transform:scale(1.1);}
.remove-btn svg{width:15px;height:15px;fill:var(--coral);stroke:var(--coral);}

.prop-body{padding:18px 20px;}
.prop-name{font-family:'Fraunces',serif;font-size:1.07rem;font-weight:700;color:var(--navy);margin-bottom:4px;}
.prop-loc{color:var(--muted);font-size:0.8rem;margin-bottom:10px;display:flex;align-items:center;gap:4px;}
.prop-tags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px;}
.tag{background:var(--surface2);border:1px solid var(--border);color:var(--text2);
  font-size:0.71rem;padding:3px 10px;border-radius:20px;font-weight:500;}
.prop-footer{display:flex;align-items:center;justify-content:space-between;
  border-top:1px solid var(--border);padding-top:14px;}
.prop-price{font-weight:700;font-size:1.05rem;color:var(--navy);}
.prop-price span{color:var(--muted);font-size:0.76rem;font-weight:400;}
.prop-rating{color:var(--gold);font-size:0.8rem;font-weight:700;}

.card-actions{display:flex;gap:8px;margin-top:14px;}
.btn-view{flex:1;padding:10px;border-radius:9px;border:1.5px solid var(--border);background:var(--white);
  color:var(--navy);font-family:'Outfit',sans-serif;font-size:0.83rem;font-weight:600;cursor:pointer;transition:var(--tr);}
.btn-view:hover{border-color:var(--navy);background:var(--surface2);}
.btn-book{flex:1;padding:10px;border-radius:9px;border:none;background:var(--teal);color:#fff;
  font-family:'Outfit',sans-serif;font-size:0.83rem;font-weight:700;cursor:pointer;transition:var(--tr);}
.btn-book:hover{background:var(--teal-light);}

/* Empty */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:80px 24px;text-align:center;}
.empty-heart{width:80px;height:80px;border-radius:50%;background:var(--coral-pale);
  display:flex;align-items:center;justify-content:center;margin:0 auto 24px;}
.empty-heart svg{width:36px;height:36px;color:var(--coral);}
.empty h3{font-family:'Fraunces',serif;font-size:1.4rem;font-weight:700;color:var(--navy);margin-bottom:8px;}
.empty p{color:var(--muted);font-size:0.9rem;margin-bottom:24px;}
.btn-browse{padding:12px 28px;border-radius:11px;background:var(--teal);color:#fff;border:none;
  font-family:'Outfit',sans-serif;font-size:0.93rem;font-weight:700;cursor:pointer;transition:var(--tr);}
.btn-browse:hover{background:var(--teal-light);transform:translateY(-1px);}
`;

const PG_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&q=70",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=70",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=70",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=70",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&q=70",
];

const AMENITY_ICONS = { wifi: "📶", meals: "🍽️", laundry: "👕", ac: "❄️", gym: "💪", parking: "🅿️", security: "🔒" };

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
    const updatedIds = JSON.parse(localStorage.getItem("pgWishlist") || "[]").filter(id => id !== propId);
    localStorage.setItem("pgWishlist", JSON.stringify(updatedIds));

    const updatedData = savedProps.filter(p => p._id !== propId);
    localStorage.setItem("pgWishlistData", JSON.stringify(updatedData));
    setSavedProps(updatedData);
    toast.success("Removed from wishlist");
  };

  const avgRent = savedProps.length > 0
    ? Math.round(savedProps.reduce((s, p) => s + (p.rent || 0), 0) / savedProps.length)
    : 0;

  return (
    <>
      <style>{CSS}</style>
      <div className="saved-wrap">
        <h1 className="page-title">Saved PGs</h1>
        <p className="page-sub">Your wishlist of properties you love.</p>

        {savedProps.length > 0 && (
          <div className="summary-card">
            <div className="sc-stat">
              <div className="sc-stat-num">{savedProps.length}</div>
              <div className="sc-stat-label">Saved Properties</div>
            </div>
            <div className="sc-divider" />
            <div className="sc-stat">
              <div className="sc-stat-num">₹{avgRent.toLocaleString()}</div>
              <div className="sc-stat-label">Avg. Monthly Rent</div>
            </div>
            <div className="sc-divider" />
            <div className="sc-stat">
              <div className="sc-stat-num">{[...new Set(savedProps.map(p => p.city))].length}</div>
              <div className="sc-stat-label">Cities</div>
            </div>
          </div>
        )}

        {savedProps.length > 0 ? (
          <div className="saved-grid">
            {savedProps.map((p, idx) => {
              const imgSrc = PG_IMAGES[idx % PG_IMAGES.length];
              const rating = (4.2 + (p.pgName?.length % 8) * 0.1).toFixed(1);

              return (
                <div key={p._id} className="prop-card">
                  <div className="prop-img">
                    <img src={imgSrc} alt={p.pgName} onError={e => { e.target.style.display = "none"; }} />
                    <div className="prop-badge">Verified</div>
                    <button className="remove-btn" onClick={() => handleRemove(p._id)} title="Remove from wishlist">
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
                    </div>
                    <div className="prop-footer">
                      <div className="prop-price">₹{p.rent?.toLocaleString()} <span>/month</span></div>
                      <div className="prop-rating">★ {rating}</div>
                    </div>
                    <div className="card-actions">
                      <button className="btn-view" onClick={() => navigate(`/user/property/${p._id}`)}>View Details</button>
                      <button className="btn-book" onClick={() => navigate(`/user/property/${p._id}`)}>Book Now</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty">
            <div className="empty-heart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <h3>No saved PGs yet</h3>
            <p>Browse properties and tap the heart icon to save your favourites here.</p>
            <button className="btn-browse" onClick={() => navigate("/user/browse")}>Browse PGs</button>
          </div>
        )}
      </div>
    </>
  );
};

export default SavedPgs;