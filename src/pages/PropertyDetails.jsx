// FILE: PropertyDetails.jsx
// FOLDER: /pages  (route: /user/property/:id)
// Depends on: axios, react-toastify, react-router-dom

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
  :root {
    --bg: #f5f2ed; --white: #ffffff; --surface: #faf9f7; --surface2: #f0ede8;
    --border: #e2ddd6; --navy: #1a2744; --navy2: #243356; --teal: #2a7c6f;
    --teal-light: #3a9e8e; --teal-pale: #e8f5f3; --coral: #e05a3a;
    --gold: #c8922a; --text: #1a1a1a; --text2: #3d3730; --muted: #8a7f74;
    --radius: 14px; --shadow: 0 2px 16px rgba(26,39,68,0.08);
    --shadow-lg: 0 8px 40px rgba(26,39,68,0.13); --transition: 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .detail-page { padding-top: 68px; font-family: 'Outfit', sans-serif; background: var(--bg); min-height: 100vh; }
  .detail-hero { height: 460px; position: relative; overflow: hidden; background: #e8f5f3; }
  .detail-hero img { width: 100%; height: 100%; object-fit: cover; }
  .detail-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(26,39,68,0.7) 0%, transparent 50%); }
  .detail-hero-badges { position: absolute; top: 28px; left: 40px; display: flex; gap: 10px; }
  .detail-back { position: absolute; top: 28px; right: 40px; background: rgba(255,255,255,0.9); border: 1px solid var(--border); border-radius: 10px; padding: 8px 16px; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 600; color: var(--navy); transition: var(--transition); }
  .detail-back:hover { background: white; }
  .prop-badge { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.5px; padding: 4px 12px; border-radius: 6px; }
  .badge-verified { background: var(--navy); color: #fff; }
  .badge-top { background: var(--teal); color: #fff; }
  .badge-new { background: var(--coral); color: #fff; }
  .detail-content { max-width: 1100px; margin: 0 auto; padding: 40px 40px 80px; display: grid; grid-template-columns: 1fr 380px; gap: 40px; align-items: start; }
  .detail-name { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 900; color: var(--navy); margin-bottom: 6px; }
  .detail-loc { display: flex; align-items: center; gap: 6px; color: var(--muted); font-size: 0.9rem; margin-bottom: 20px; }
  .detail-rating-row { display: flex; align-items: center; gap: 20px; padding: 16px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 28px; flex-wrap: wrap; }
  .detail-rating-item { text-align: center; }
  .detail-rating-item .val { font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 900; color: var(--navy); }
  .detail-rating-item .lbl { color: var(--muted); font-size: 0.75rem; margin-top: 2px; }
  .detail-section-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 700; color: var(--navy); margin-bottom: 16px; margin-top: 28px; }
  .detail-desc { color: var(--text2); font-size: 0.93rem; line-height: 1.75; }
  .detail-amenities { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px; }
  .detail-amenity { display: flex; align-items: center; gap: 10px; font-size: 0.88rem; color: var(--text2); padding: 10px 14px; background: var(--surface); border-radius: 10px; }
  .detail-amenity svg { width: 16px; height: 16px; color: var(--teal); flex-shrink: 0; }
  .detail-reviews { display: flex; flex-direction: column; gap: 16px; }
  .review-card { background: var(--surface); border-radius: 12px; padding: 18px; }
  .review-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .review-ava { width: 38px; height: 38px; border-radius: 50%; background: var(--navy); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.88rem; flex-shrink: 0; }
  .review-name { font-weight: 600; color: var(--navy); font-size: 0.9rem; }
  .review-date { color: var(--muted); font-size: 0.77rem; margin-top: 2px; }
  .review-stars { color: var(--gold); font-size: 0.85rem; margin-left: auto; }
  .review-text { color: var(--text2); font-size: 0.87rem; line-height: 1.65; }
  .booking-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow-lg); position: sticky; top: 88px; }
  .booking-card-price { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 900; color: var(--navy); margin-bottom: 4px; }
  .booking-card-price span { font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 400; color: var(--muted); }
  .form-group { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
  .form-group label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.9px; color: var(--muted); }
  .form-group input, .form-group select { background: var(--surface); border: 1.5px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'Outfit', sans-serif; font-size: 0.92rem; padding: 12px 14px; outline: none; appearance: none; transition: var(--transition); width: 100%; }
  .form-group input:focus, .form-group select:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(42,124,111,0.1); background: var(--white); }
  .booking-summary { background: var(--surface); border-radius: 10px; padding: 16px; margin: 16px 0; }
  .booking-summary-row { display: flex; justify-content: space-between; font-size: 0.87rem; padding: 6px 0; border-bottom: 1px solid var(--border); color: var(--text2); }
  .booking-summary-row:last-child { border-bottom: none; font-weight: 700; color: var(--navy); font-size: 0.95rem; }
  .btn-full { width: 100%; padding: 14px; border-radius: 12px; background: var(--navy); color: #fff; border: none; font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer; margin-top: 8px; transition: var(--transition); }
  .btn-full:hover { background: var(--navy2); transform: translateY(-1px); }
  .btn-full.teal { background: var(--teal); }
  .btn-full.teal:hover { background: var(--teal-light); }
  @media (max-width: 900px) {
    .detail-content { grid-template-columns: 1fr; padding: 24px 16px 60px; }
    .detail-hero { height: 280px; }
    .detail-amenities { grid-template-columns: 1fr; }
  }
`;

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking card state
  const [checkInDate, setCheckInDate] = useState("");
  const [duration, setDuration] = useState("6");
  const [roomType, setRoomType] = useState("single");

  // If coming from MyBookings, read the passed status
  const bookingStatus = location.state?.bookingStatus || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, reviewRes] = await Promise.all([
          axios.get(`/properties/${id}`),
          axios.get(`/properties/${id}/reviews`),
        ]);
        setProperty(propRes.data);
        setReviews(reviewRes.data || []);
      } catch (err) {
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Price calculation helpers
  const getMonthlyRent = () => property?.rent || 0;
  const getSecurityDeposit = () => getMonthlyRent() * 2;
  const getServiceFee = () => 500;
  const getTotalAmount = () => {
    const months = parseInt(duration) || 1;
    return getMonthlyRent() * months + getSecurityDeposit() + getServiceFee();
  };

  const handleReserve = () => {
    if (!checkInDate) {
      toast.error("Please select a move-in date");
      return;
    }
    // Pass booking details to BookPG via navigation state
    navigate(`/user/book/${id}`, {
      state: {
        checkInDate,
        duration,
        roomType,
        property,
        totalAmount: getTotalAmount(),
        monthlyRent: getMonthlyRent(),
        securityDeposit: getSecurityDeposit(),
        serviceFee: getServiceFee(),
      },
    });
  };

  const handleMessageLandlord = () => {
    toast.success("Message sent to landlord!", { autoClose: 2000 });
  };

  if (loading) {
    return (
      <div style={{ paddingTop: 68, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif", background: "#f5f2ed" }}>
        <div style={{ textAlign: "center", color: "#8a7f74" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
          <p style={{ fontWeight: 500 }}>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ paddingTop: 68, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif", background: "#f5f2ed" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🏠</div>
          <h3 style={{ fontFamily: "'Fraunces', serif", color: "#1a2744", marginBottom: 8 }}>Property not found</h3>
          <button onClick={() => navigate("/user/browse")} style={{ marginTop: 16, background: "#1a2744", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, cursor: "pointer" }}>
            Browse PGs
          </button>
        </div>
      </div>
    );
  }

  const months = parseInt(duration) || 1;

  return (
    <div className="detail-page">
      <style>{STYLES}</style>

      {/* ── HERO IMAGE ── */}
      <div className="detail-hero">
        {property.image ? (
          <img src={property.image} alt={property.pgName} onError={(e) => { e.target.style.display = "none"; }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #e8f5f3, #c8e8e3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="80" height="80" viewBox="0 0 64 64" fill="none" opacity="0.3">
              <path d="M10 32L32 14l22 18v20H10V32z" stroke="#2a7c6f" strokeWidth="2.5" fill="#2a7c6f" fillOpacity="0.15" />
            </svg>
          </div>
        )}
        <div className="detail-hero-overlay" />

        {/* Badges */}
        <div className="detail-hero-badges">
          <span className="prop-badge badge-verified">Verified</span>
          {property.rating && <span className="prop-badge badge-top">Top Rated</span>}
        </div>

        {/* Back button */}
        <button className="detail-back" onClick={() => navigate("/user/browse")}>
          ← Back to listings
        </button>
      </div>

      {/* ── DETAIL CONTENT ── */}
      <div className="detail-content">

        {/* LEFT: Main Info */}
        <div className="detail-main">
          <div className="detail-name">{property.pgName}</div>
          <div className="detail-loc">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" />
            </svg>
            {property.address && `${property.address}, `}{property.area}, {property.city}
          </div>

          {/* Stats Row */}
          <div className="detail-rating-row">
            <div className="detail-rating-item">
              <div className="val" style={{ color: "#c8922a" }}>★ {property.rating || "New"}</div>
              <div className="lbl">Rating</div>
            </div>
            <div style={{ width: 1, background: "#e2ddd6", margin: "0 8px", alignSelf: "stretch" }} />
            <div className="detail-rating-item">
              <div className="val">{reviews.length}</div>
              <div className="lbl">Reviews</div>
            </div>
            <div style={{ width: 1, background: "#e2ddd6", margin: "0 8px", alignSelf: "stretch" }} />
            <div className="detail-rating-item">
              <div className="val" style={{ textTransform: "capitalize" }}>{property.roomType || "—"}</div>
              <div className="lbl">Room Type</div>
            </div>
            <div style={{ width: 1, background: "#e2ddd6", margin: "0 8px", alignSelf: "stretch" }} />
            <div className="detail-rating-item">
              <div className="val" style={{ color: "#2a7c6f", textTransform: "capitalize" }}>{property.gender || "Any"}</div>
              <div className="lbl">Gender</div>
            </div>
          </div>

          {/* Booking Status Banner (if coming from MyBookings) */}
          {bookingStatus && (
            <div style={{ background: bookingStatus === "confirmed" ? "#e8f5f3" : bookingStatus === "cancelled" ? "#fdf0ec" : "#fdf6e8", border: `1px solid ${bookingStatus === "confirmed" ? "#2a7c6f" : bookingStatus === "cancelled" ? "#e05a3a" : "#c8922a"}`, borderRadius: 10, padding: "12px 18px", marginBottom: 20, fontSize: "0.88rem", fontWeight: 600, color: bookingStatus === "confirmed" ? "#2a7c6f" : bookingStatus === "cancelled" ? "#e05a3a" : "#c8922a" }}>
              Booking Status: {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
            </div>
          )}

          {/* About */}
          <div className="detail-section-title">About this property</div>
          <div className="detail-desc">
            {property.description || `${property.pgName} is a verified paying guest accommodation located in ${property.area}, ${property.city}. It offers a safe, comfortable environment with modern amenities for a pleasant stay.`}
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <>
              <div className="detail-section-title">Amenities</div>
              <div className="detail-amenities">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="detail-amenity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span style={{ textTransform: "capitalize" }}>{amenity}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Reviews */}
          <div className="detail-section-title">Reviews</div>
          {reviews.length === 0 ? (
            <div style={{ background: "#faf9f7", borderRadius: 12, padding: "24px", textAlign: "center", color: "#8a7f74", fontSize: "0.9rem" }}>
              No reviews yet. Be the first to review this PG!
            </div>
          ) : (
            <div className="detail-reviews">
              {reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="review-ava">
                      {review.userId?.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="review-name">
                        {review.userId?.firstName} {review.userId?.lastName}
                      </div>
                      <div className="review-date">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <div className="review-stars">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <div className="review-text">{review.reviewText}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Booking Card */}
        <div>
          <div className="booking-card">
            <div className="booking-card-price">
              ₹{property.rent?.toLocaleString()} <span>/month</span>
            </div>
            <p style={{ color: "#2a7c6f", fontSize: "0.8rem", fontWeight: 600, marginBottom: 20 }}>
              ✓ {property.available !== false ? "Available" : "Not Available"}
            </p>

            <div className="form-group">
              <label>Move-in Date</label>
              <input
                type="date"
                value={checkInDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
              </select>
            </div>

            <div className="form-group">
              <label>Room Type</label>
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                <option value="single">Single Occupancy — ₹{property.rent?.toLocaleString()}</option>
                <option value="double">Double Occupancy — ₹{Math.round((property.rent || 0) * 0.75)?.toLocaleString()}</option>
                <option value="triple">Triple Occupancy — ₹{Math.round((property.rent || 0) * 0.6)?.toLocaleString()}</option>
              </select>
            </div>

            {/* Price Summary */}
            <div className="booking-summary">
              <div className="booking-summary-row">
                <span>₹{getMonthlyRent().toLocaleString()} × {months} month{months > 1 ? "s" : ""}</span>
                <span>₹{(getMonthlyRent() * months).toLocaleString()}</span>
              </div>
              <div className="booking-summary-row">
                <span>Security Deposit</span>
                <span>₹{getSecurityDeposit().toLocaleString()}</span>
              </div>
              <div className="booking-summary-row">
                <span>Service Fee</span>
                <span>₹{getServiceFee().toLocaleString()}</span>
              </div>
              <div className="booking-summary-row">
                <span>Total</span>
                <span>₹{getTotalAmount().toLocaleString()}</span>
              </div>
            </div>

            <button className="btn-full teal" onClick={handleReserve}>
              Reserve Now →
            </button>
            <button
              className="btn-full"
              style={{ background: "#f0ede8", color: "#1a2744", marginTop: 10 }}
              onClick={handleMessageLandlord}
            >
              Message Landlord
            </button>
            <p style={{ textAlign: "center", color: "#8a7f74", fontSize: "0.76rem", marginTop: 14 }}>
              You won't be charged yet
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyDetails;