import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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

/* Detail Hero */
.detail-hero{height:400px;position:relative;overflow:hidden;background:var(--navy);}
.detail-hero img{width:100%;height:100%;object-fit:cover;}
.detail-hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(26,39,68,0.6) 100%);}
.detail-hero-badges{position:absolute;top:20px;left:20px;display:flex;gap:8px;}
.detail-back{position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.9);
  border:none;padding:9px 18px;border-radius:9px;font-family:'Outfit',sans-serif;
  font-size:0.85rem;font-weight:600;color:var(--navy);cursor:pointer;transition:var(--tr);
  backdrop-filter:blur(8px);}
.detail-back:hover{background:#fff;}
.prop-badge{font-size:0.67rem;font-weight:700;letter-spacing:0.5px;padding:5px 13px;border-radius:6px;}
.badge-verified{background:var(--navy);color:#fff;}
.badge-top{background:var(--teal);color:#fff;}
.badge-new{background:var(--coral);color:#fff;}

/* Detail Content */
.detail-wrap{max-width:1100px;margin:0 auto;padding:40px 24px 80px;}
.detail-content{display:grid;grid-template-columns:1fr 360px;gap:36px;align-items:start;}
.detail-main{}
.detail-name{font-family:'Fraunces',serif;font-size:2rem;font-weight:900;color:var(--navy);margin-bottom:8px;}
.detail-loc{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:0.9rem;margin-bottom:20px;}
.detail-rating-row{display:flex;align-items:center;gap:4px;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:28px;flex-wrap:wrap;gap:0;}
.detail-rating-item{text-align:center;padding:0 20px;}
.detail-rating-item:first-child{padding-left:0;}
.detail-rating-item .val{font-family:'Fraunces',serif;font-size:1.15rem;font-weight:700;color:var(--navy);}
.detail-rating-item .lbl{font-size:0.72rem;color:var(--muted);font-weight:500;margin-top:2px;}
.detail-divider{width:1px;background:var(--border);height:36px;align-self:center;}

.detail-section-title{font-family:'Fraunces',serif;font-size:1.05rem;font-weight:700;
  color:var(--navy);margin-bottom:14px;margin-top:28px;}
.detail-desc{color:var(--text2);font-size:0.9rem;line-height:1.8;}
.detail-amenities{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;}
.detail-amenity{display:flex;align-items:center;gap:10px;font-size:0.88rem;color:var(--text2);
  padding:10px 14px;background:var(--surface);border-radius:9px;border:1px solid var(--border);}
.detail-amenity svg{width:15px;height:15px;color:var(--teal);flex-shrink:0;}

/* Reviews */
.review-card{background:var(--surface);border-radius:12px;padding:18px;border:1px solid var(--border);margin-bottom:12px;}
.review-header{display:flex;align-items:center;gap:12px;margin-bottom:10px;}
.review-ava{width:38px;height:38px;border-radius:50%;background:var(--navy);
  display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.9rem;flex-shrink:0;}
.review-name{font-weight:600;color:var(--navy);font-size:0.9rem;}
.review-date{color:var(--muted);font-size:0.77rem;margin-top:2px;}
.review-stars{color:var(--gold);font-size:0.85rem;margin-left:auto;}
.review-text{color:var(--text2);font-size:0.87rem;line-height:1.65;}

/* Booking Card */
.booking-card{background:var(--white);border:1px solid var(--border);border-radius:20px;
  padding:28px;box-shadow:var(--shadow-lg);position:sticky;top:88px;}
.booking-card-price{font-family:'Fraunces',serif;font-size:2rem;font-weight:900;color:var(--navy);margin-bottom:4px;}
.booking-card-price span{font-family:'Outfit',sans-serif;font-size:0.88rem;font-weight:400;color:var(--muted);}
.booking-card-rating{display:flex;align-items:center;gap:6px;color:var(--gold);font-size:0.85rem;margin-bottom:20px;}
.form-group-bc{margin-bottom:14px;}
.form-group-bc label{display:block;font-size:0.7rem;font-weight:700;text-transform:uppercase;
  letter-spacing:1px;color:var(--muted);margin-bottom:7px;}
.form-input-bc{width:100%;background:var(--surface);border:1.5px solid var(--border);
  border-radius:10px;color:var(--text);font-family:'Outfit',sans-serif;font-size:0.9rem;
  padding:11px 14px;outline:none;transition:var(--tr);}
.form-input-bc:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(42,124,111,0.1);}
.room-btns{display:flex;gap:7px;}
.room-btn{flex:1;padding:9px 8px;border-radius:8px;border:1.5px solid var(--border);
  background:var(--surface);color:var(--text2);font-family:'Outfit',sans-serif;
  font-size:0.82rem;font-weight:600;cursor:pointer;transition:var(--tr);text-transform:capitalize;}
.room-btn.active{background:var(--navy);color:#fff;border-color:var(--navy);}
.room-btn:hover:not(.active){border-color:var(--navy);color:var(--navy);}
.booking-summary{background:var(--surface);border-radius:10px;padding:16px;margin:16px 0;}
.booking-summary-row{display:flex;justify-content:space-between;font-size:0.86rem;
  padding:7px 0;border-bottom:1px solid var(--border);color:var(--text2);}
.booking-summary-row:last-child{border-bottom:none;font-weight:700;color:var(--navy);font-size:0.95rem;padding-top:10px;}
.btn-reserve{width:100%;padding:15px;border-radius:12px;background:var(--navy);color:#fff;
  border:none;font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;
  transition:var(--tr);margin-top:4px;}
.btn-reserve:hover{background:var(--navy2);transform:translateY(-1px);}
.btn-reserve.teal{background:var(--teal);}
.btn-reserve.teal:hover{background:var(--teal-light);}
.secure-badge{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:0.77rem;
  margin-top:12px;padding:9px 12px;background:var(--surface);border-radius:8px;}
.secure-badge svg{width:13px;height:13px;color:var(--teal);}

/* Wish button in detail */
.wish-detail-btn{display:flex;align-items:center;gap:8px;background:none;border:1.5px solid var(--border);
  border-radius:9px;padding:9px 16px;color:var(--text2);font-family:'Outfit',sans-serif;
  font-size:0.85rem;font-weight:600;cursor:pointer;transition:var(--tr);}
.wish-detail-btn:hover{border-color:var(--coral);color:var(--coral);}
.wish-detail-btn.saved{border-color:var(--coral);color:var(--coral);background:var(--coral-pale);}

/* Status pill */
.status-pill{display:inline-flex;align-items:center;gap:5px;font-size:0.75rem;font-weight:700;
  padding:5px 13px;border-radius:20px;}
.sp-pending{background:var(--gold-pale);color:var(--gold);}
.sp-confirmed{background:rgba(42,124,111,0.1);color:var(--teal);}
.sp-cancelled{background:var(--coral-pale);color:var(--coral);}

/* Image Gallery / Slider */
.gallery-hero{position:relative;height:420px;background:var(--navy);overflow:hidden;}
.gallery-main-img{width:100%;height:100%;object-fit:cover;transition:opacity 0.35s ease;}
.gallery-hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(26,39,68,0.55) 100%);pointer-events:none;}
.gallery-nav-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.92);border:none;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;z-index:3;backdrop-filter:blur(6px);}
.gallery-nav-btn:hover{background:#fff;transform:translateY(-50%) scale(1.08);}
.gallery-nav-btn.left{left:16px;}
.gallery-nav-btn.right{right:16px;}
.gallery-dots{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:3;}
.gallery-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.5);cursor:pointer;transition:all 0.2s;border:none;}
.gallery-dot.active{background:#fff;width:20px;border-radius:4px;}
.gallery-counter{position:absolute;bottom:14px;right:16px;background:rgba(0,0,0,0.5);color:#fff;font-size:0.72rem;font-weight:600;padding:4px 10px;border-radius:20px;z-index:3;backdrop-filter:blur(4px);font-family:'Outfit',sans-serif;}
.gallery-thumbs{display:flex;gap:8px;padding:10px 0 4px;overflow-x:auto;scrollbar-width:none;}
.gallery-thumbs::-webkit-scrollbar{display:none;}
.gallery-thumb{width:72px;height:54px;flex-shrink:0;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:border-color 0.2s;opacity:0.7;}
.gallery-thumb.active{border-color:var(--teal);opacity:1;}
.gallery-thumb:hover{opacity:1;}
.gallery-thumb img{width:100%;height:100%;object-fit:cover;}
.no-image-hero{height:420px;background:linear-gradient(135deg,var(--navy) 0%,var(--teal) 100%);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;color:rgba(255,255,255,0.6);font-family:'Outfit',sans-serif;}

/* Loading */
.skel{background:linear-gradient(90deg,var(--surface2) 25%,var(--border) 50%,var(--surface2) 75%);
  background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px;}
@keyframes shimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}

@media(max-width:900px){
  .detail-content{grid-template-columns:1fr;}
  .detail-amenities{grid-template-columns:1fr;}
  .booking-card{position:static;}
}
`;



const AMENITY_ICONS = { wifi: "", meals: "", laundry: "", ac: "", gym: "", parking: "", security: "" };
const GENDER_MAP = { male: "Boys Only", female: "Girls Only", unisex: "Co-ed / Unisex" };

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertyImages, setPropertyImages] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  // Booking form
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [roomType, setRoomType] = useState("single");
  const [months, setMonths] = useState(0);

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pgWishlist") || "[]"); } catch { return []; }
  });

  // Booking status from MyBookings navigation
  const bookingStatus = location.state?.bookingStatus;

  useEffect(() => {
    const load = async () => {
      try {
        const [propRes, revRes, imgRes] = await Promise.allSettled([
          axios.get(`/properties/${id}`),
          axios.get(`/properties/${id}/reviews`),
          axios.get(`/propertyimage/${id}`),
        ]);
        if (propRes.status === "fulfilled") setProperty(propRes.value.data);
        if (revRes.status === "fulfilled") setReviews(revRes.value.data || []);
        if (imgRes.status === "fulfilled") {
          const imgs = (imgRes.value.data?.images || []).map(img => img.imageUrl).filter(Boolean);
          setPropertyImages(imgs);
        }
      } catch {
        toast.error("Failed to load property");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const diff = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24 * 30);
      setMonths(Math.max(0, Math.round(diff)));
    }
  }, [checkInDate, checkOutDate]);

  const toggleWishlist = () => {
    const isSaved = wishlist.includes(id);
    const next = isSaved ? wishlist.filter(x => x !== id) : [...wishlist, id];
    setWishlist(next);
    localStorage.setItem("pgWishlist", JSON.stringify(next));
    if (!isSaved && property) {
      const existing = JSON.parse(localStorage.getItem("pgWishlistData") || "[]");
      const updated = [...existing.filter(p => p._id !== id), property];
      localStorage.setItem("pgWishlistData", JSON.stringify(updated));
    } else {
      const existing = JSON.parse(localStorage.getItem("pgWishlistData") || "[]");
      localStorage.setItem("pgWishlistData", JSON.stringify(existing.filter(p => p._id !== id)));
    }
    toast.success(isSaved ? "Removed from wishlist" : "Saved to wishlist ❤️");
  };

  const handleReserve = () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error("Check-out must be after check-in");
      return;
    }
    navigate(`/checkout/${id}`, {
      state: { checkInDate, checkOutDate, roomType, months, property }
    });
  };

  const totalRent = property ? property.rent * months : 0;
  const isSaved = wishlist.includes(id);

  const statusPillClass = (s) => {
    if (s === "confirmed") return "status-pill sp-confirmed";
    if (s === "cancelled") return "status-pill sp-cancelled";
    return "status-pill sp-pending";
  };

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 68px)", padding: "0 0 60px" }}>
          <div className="skel" style={{ height: 400 }} />
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
            <div className="skel" style={{ height: 36, width: "60%", marginBottom: 16 }} />
            <div className="skel" style={{ height: 20, width: "40%", marginBottom: 32 }} />
          </div>
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", fontFamily: "'Outfit',sans-serif" }}>
          <h2 style={{ color: "var(--navy)", fontFamily: "'Fraunces',serif" }}>Property not found</h2>
          <button onClick={() => navigate("/user/browse")} style={{ marginTop: 16, padding: "10px 24px", background: "var(--teal)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>← Back to Browse</button>
        </div>
      </>
    );
  }

  const rating = (4.2 + (property.pgName?.length % 8) * 0.1).toFixed(1);

  const prevSlide = () => setActiveSlide(i => (i - 1 + propertyImages.length) % propertyImages.length);
  const nextSlide = () => setActiveSlide(i => (i + 1) % propertyImages.length);

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 68px)", paddingBottom: 80 }}>

        {/* ── IMAGE GALLERY ── */}
        {propertyImages.length > 0 ? (
          <div className="gallery-hero">
            <img
              src={propertyImages[activeSlide]}
              alt={`${property.pgName} - photo ${activeSlide + 1}`}
              className="gallery-main-img"
              onError={e => { e.target.style.display = "none"; }}
            />
            <div className="gallery-hero-overlay" />
            {/* Badges */}
            <div className="detail-hero-badges">
              <span className="prop-badge badge-verified">Verified</span>
              {property.available && <span className="prop-badge badge-top">Available</span>}
            </div>
            {/* Back button */}
            <button className="detail-back" onClick={() => navigate(-1)}>← Back to listings</button>
            {/* Prev/Next arrows */}
            {propertyImages.length > 1 && (
              <>
                <button className="gallery-nav-btn left" onClick={prevSlide} aria-label="Previous">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a2744" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
                </button>
                <button className="gallery-nav-btn right" onClick={nextSlide} aria-label="Next">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a2744" strokeWidth="2.5"><polyline points="9,6 15,12 9,18"/></svg>
                </button>
                {/* Dots */}
                <div className="gallery-dots">
                  {propertyImages.map((_, i) => (
                    <button key={i} className={`gallery-dot${i === activeSlide ? " active" : ""}`} onClick={() => setActiveSlide(i)} aria-label={`Go to photo ${i+1}`} />
                  ))}
                </div>
                {/* Counter */}
                <div className="gallery-counter">{activeSlide + 1} / {propertyImages.length}</div>
              </>
            )}
          </div>
        ) : (
          <div className="no-image-hero">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
            <span style={{fontSize:"0.9rem"}}>No images uploaded yet</span>
            {/* Badges + back on no-image hero */}
            <div className="detail-hero-badges" style={{top:20,left:20,position:"absolute",display:"flex",gap:8}}>
              <span className="prop-badge badge-verified">Verified</span>
              {property.available && <span className="prop-badge badge-top">Available</span>}
            </div>
            <button className="detail-back" onClick={() => navigate(-1)}>← Back to listings</button>
          </div>
        )}

        {/* ── CONTENT ── */}
        <div className="detail-wrap">
          {/* Thumbnail strip */}
          {propertyImages.length > 1 && (
            <div className="gallery-thumbs" style={{marginBottom:8}}>
              {propertyImages.map((url, i) => (
                <div key={i} className={`gallery-thumb${i === activeSlide ? " active" : ""}`} onClick={() => setActiveSlide(i)}>
                  <img src={url} alt={`Thumbnail ${i+1}`} onError={e=>{e.target.style.display="none";}}/>
                </div>
              ))}
            </div>
          )}
          {/* Booking status banner if came from My Bookings */}
          {bookingStatus && (
            <div style={{ marginBottom: 20, padding: "12px 20px", background: bookingStatus === "confirmed" ? "var(--teal-pale)" : bookingStatus === "cancelled" ? "var(--coral-pale)" : "var(--gold-pale)", borderRadius: 12, border: `1px solid ${bookingStatus === "confirmed" ? "rgba(42,124,111,0.3)" : bookingStatus === "cancelled" ? "rgba(224,90,58,0.3)" : "rgba(200,146,42,0.3)"}`, display: "flex", alignItems: "center", gap: 10, fontFamily: "'Outfit',sans-serif", fontSize: "0.88rem", color: "var(--text2)" }}>
              <span className={statusPillClass(bookingStatus)}>{bookingStatus}</span>
              Your booking for this property is <strong>{bookingStatus}</strong>.
            </div>
          )}

          <div className="detail-content">
            {/* ── LEFT: Detail Main ── */}
            <div className="detail-main">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                <div className="detail-name">{property.pgName}</div>
                <button className={`wish-detail-btn${isSaved ? " saved" : ""}`} onClick={toggleWishlist}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  {isSaved ? "Saved" : "Save"}
                </button>
              </div>

              <div className="detail-loc">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" />
                </svg>
                {property.address || ""}{property.address && property.area ? ", " : ""}{property.area || ""}{property.area && property.city ? ", " : ""}{property.city}
              </div>

              {/* Stats row */}
              <div className="detail-rating-row">
                <div className="detail-rating-item"><div className="val" style={{ color: "var(--gold)" }}>★ {rating}</div><div className="lbl">Rating</div></div>
                <div className="detail-divider" />
                <div className="detail-rating-item"><div className="val">{reviews.length}</div><div className="lbl">Reviews</div></div>
                <div className="detail-divider" />
                <div className="detail-rating-item"><div className="val" style={{ textTransform: "capitalize" }}>{property.roomType || "—"}</div><div className="lbl">Room Type</div></div>
                <div className="detail-divider" />
                <div className="detail-rating-item"><div className="val" style={{ color: property.available ? "var(--teal)" : "var(--coral)" }}>{property.available ? "Available" : "Full"}</div><div className="lbl">Status</div></div>
                <div className="detail-divider" />
                <div className="detail-rating-item"><div className="val" style={{ color: "var(--blue)", textTransform: "capitalize" }}>{GENDER_MAP[property.gender] || property.gender}</div><div className="lbl">Gender</div></div>
              </div>

              {/* About */}
              <div className="detail-section-title">About this property</div>
              <div className="detail-desc">
                {property.description || `${property.pgName} is a premium paying guest accommodation located in ${property.area || property.city}. Offering comfortable, well-furnished rooms with essential amenities in a safe and welcoming environment.`}
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <>
                  <div className="detail-section-title">Amenities</div>
                  <div className="detail-amenities">
                    {property.amenities.map((a, i) => (
                      <div key={i} className="detail-amenity">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                        {AMENITY_ICONS[a] || ""} {a.charAt(0).toUpperCase() + a.slice(1)}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Reviews */}
              <div className="detail-section-title">Reviews</div>
              {reviews.length > 0 ? (
                reviews.slice(0, 6).map((r, i) => {
                  // After the ReviewController fix, populated field is `userId`
                  // Support both old docs (r.user) and new docs (r.userId) for backward compatibility
                  const reviewer = r.userId || r.user || {};
                  const firstName = reviewer?.firstName || "Tenant";
                  const lastName = reviewer?.lastName || "";
                  const initial = firstName[0]?.toUpperCase() || "T";
                  return (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <div className="review-ava" style={{background: ["#1a2744","#2a7c6f","#3b6bcc","#c8922a","#e05a3a"][i%5]}}>{initial}</div>
                      <div>
                        <div className="review-name">{firstName} {lastName}</div>
                        <div className="review-date">{new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</div>
                      </div>
                      <div className="review-stars">{"★".repeat(r.rating || 5)}{"☆".repeat(5-(r.rating||5))}</div>
                    </div>
                    <div className="review-text">{r.reviewText}</div>
                  </div>
                  );
                })
              ) : (
                <div style={{ color: "var(--muted)", fontSize: "0.87rem", fontFamily: "'Outfit',sans-serif", padding: "12px 0" }}>No reviews yet. Be the first to stay here!</div>
              )}

              {/* House rules */}
              <div className="detail-section-title">House Rules</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "'Outfit',sans-serif" }}>
                {["No late night entry after 11 PM", "No smoking on premises", "Guests allowed till 9 PM", "Rent due by 5th of each month", "ID proof required at check-in"].map((rule, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.87rem", color: "var(--text2)", padding: "8px 12px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--teal)", fontSize: "1rem" }}>•</span> {rule}
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Booking Card ── */}
            <div>
              <div className="booking-card">
                <div className="booking-card-price">₹{property.rent?.toLocaleString()} <span>/ month</span></div>
                <div className="booking-card-rating">★ {rating} · {reviews.length} reviews · {GENDER_MAP[property.gender]}</div>

                {/* Room type */}
                <div className="form-group-bc">
                  <label>Room Type</label>
                  <div className="room-btns">
                    {["single", "double", "triple"].map(t => (
                      <button key={t} className={`room-btn${roomType === t ? " active" : ""}`} onClick={() => setRoomType(t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div className="form-group-bc">
                    <label>Check-in</label>
                    <input type="date" className="form-input-bc" value={checkInDate} min={new Date().toISOString().split("T")[0]} onChange={e => setCheckInDate(e.target.value)} />
                  </div>
                  <div className="form-group-bc">
                    <label>Check-out</label>
                    <input type="date" className="form-input-bc" value={checkOutDate} min={checkInDate || new Date().toISOString().split("T")[0]} onChange={e => setCheckOutDate(e.target.value)} />
                  </div>
                </div>

                {/* Summary */}
                {months > 0 && (
                  <div className="booking-summary">
                    <div className="booking-summary-row"><span>₹{property.rent?.toLocaleString()} × {months} month{months > 1 ? "s" : ""}</span><span>₹{totalRent.toLocaleString()}</span></div>
                    <div className="booking-summary-row"><span>Platform fee</span><span>₹0</span></div>
                    <div className="booking-summary-row"><span>Total</span><span>₹{totalRent.toLocaleString()}</span></div>
                  </div>
                )}

                {property.available ? (
                  <button className="btn-reserve teal" onClick={handleReserve}>
                    Reserve Now →
                  </button>
                ) : (
                  <button className="btn-reserve" disabled style={{ background: "var(--border)", cursor: "not-allowed", transform: "none" }}>
                    Currently Unavailable
                  </button>
                )}

                <div className="secure-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Secure booking. No payment charged yet.
                </div>

                {/* Landlord info */}
                {property.landlordId && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", marginBottom: 10, fontFamily: "'Outfit',sans-serif" }}>Hosted by</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>
                        {property.landlordId?.firstName?.[0]?.toUpperCase() || "L"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.9rem", fontFamily: "'Outfit',sans-serif" }}>{property.landlordId?.firstName} {property.landlordId?.lastName}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "'Outfit',sans-serif" }}>Usually responds within 24 hrs</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;