import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);

  // booking form state
  const [moveInDate, setMoveInDate] = useState("");
  const [duration, setDuration] = useState(6);

  // ── Fetch property from backend
  useEffect(() => {
    axios
      .get(`/properties/${id}`)
      .then((res) => {
        setPg(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Could not load property.");
        setLoading(false);
      });
  }, [id]);

  // ── Booking cost calculation
  const securityDeposit = pg ? pg.rent * 2 : 0;
  const serviceFee = 500;
  const total = pg ? pg.rent * duration + securityDeposit + serviceFee : 0;

  // ── Navigate to booking page
  const handleReserve = () => {
    if (!moveInDate) {
      toast.error("Please select a move-in date.");
      return;
    }
    navigate(`/user/book/${id}`);
  };

  // ── Gender display helper
  const genderLabel = (g) => {
    if (g === "female") return "Girls";
    if (g === "male") return "Boys";
    return "Co-ed";
  };

  // ── Gender color
  const genderColor = (g) => {
    if (g === "female") return "#e05a3a";
    if (g === "male") return "#3b6bcc";
    return "#2a7c6f";
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", paddingTop: 68, minHeight: "100vh", background: "#f5f2ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#8a7f74" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>⏳</div>
          <p style={{ fontWeight: 500, fontSize: "1rem" }}>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", paddingTop: 68, minHeight: "100vh", background: "#f5f2ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🏠</div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", color: "#1a2744" }}>Property not found</h3>
          <button onClick={() => navigate("/user/browse")} style={{ marginTop: 20, background: "#1a2744", color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, cursor: "pointer" }}>
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f5f2ed", minHeight: "100vh", paddingTop: 68 }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .detail-input { width: 100%; background: #faf9f7; border: 1.5px solid #e2ddd6; border-radius: 9px; color: #1a1a1a; font-family: 'Outfit', sans-serif; font-size: 0.9rem; padding: 11px 14px; outline: none; transition: border-color 0.2s; }
        .detail-input:focus { border-color: #2a7c6f; box-shadow: 0 0 0 3px rgba(42,124,111,0.1); }
        .amenity-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .amenity-item { display: flex; align-items: center; gap: 10px; background: #faf9f7; border: 1px solid #e2ddd6; border-radius: 10px; padding: 12px 14px; font-size: 0.86rem; color: #3d3730; font-weight: 500; }
      `}</style>

      {/* ── HERO IMAGE ── */}
      <div style={{ height: 420, position: "relative", overflow: "hidden", background: "#1a2744" }}>
        {pg.image ? (
          <img
            src={pg.image}
            alt={pg.pgName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1a2744, #2a4066)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="80" height="80" viewBox="0 0 64 64" fill="none" opacity="0.3">
              <path d="M10 32L32 14l22 18v20H10V32z" stroke="#fff" strokeWidth="2" fill="#fff" fillOpacity="0.15" />
            </svg>
          </div>
        )}

        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(26,39,68,0.2) 0%, rgba(26,39,68,0.55) 100%)" }} />

        {/* Badges */}
        <div style={{ position: "absolute", top: 20, left: 24, display: "flex", gap: 8 }}>
          {pg.verified && (
            <span style={{ background: "#1a2744", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "5px 14px", borderRadius: 7 }}>
              Verified
            </span>
          )}
          {pg.topRated && (
            <span style={{ background: "#2a7c6f", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "5px 14px", borderRadius: 7 }}>
              Top Rated
            </span>
          )}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate("/user/browse")}
          style={{
            position: "absolute", top: 20, right: 24,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff", borderRadius: 10,
            padding: "9px 18px", cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.85rem", fontWeight: 600,
          }}
        >
          ← Back to listings
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 24px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }}>

        {/* ── LEFT: Main info ── */}
        <div>

          {/* Name + location */}
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 700, color: "#1a2744", marginBottom: 8 }}>
            {pg.pgName}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8a7f74", fontSize: "0.9rem", marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" />
            </svg>
            {pg.address ? pg.address : `${pg.area}, ${pg.city}`}
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32, flexWrap: "wrap" }}>
            {[
              { val: pg.rating ? `★ ${pg.rating}` : "—", lbl: "Rating", color: pg.rating ? "#c8922a" : "#8a7f74" },
              { val: pg.reviewCount || "0", lbl: "Reviews" },
              { val: pg.totalRooms || "—", lbl: "Rooms" },
              { val: pg.occupiedRooms || "—", lbl: "Occupied" },
              { val: genderLabel(pg.gender), lbl: "Gender", color: genderColor(pg.gender) },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", padding: "0 20px" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: item.color || "#1a2744", fontFamily: "'Fraunces', serif" }}>
                    {item.val}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#8a7f74", marginTop: 3 }}>{item.lbl}</div>
                </div>
                {i < 4 && <div style={{ width: 1, height: 36, background: "#e2ddd6" }} />}
              </div>
            ))}
          </div>

          {/* About */}
          {pg.description && (
            <>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 700, color: "#1a2744", marginBottom: 12 }}>
                About this property
              </h3>
              <p style={{ color: "#3d3730", fontSize: "0.93rem", lineHeight: 1.8, marginBottom: 32 }}>
                {pg.description}
              </p>
            </>
          )}

          {/* Amenities */}
          {pg.amenities && pg.amenities.length > 0 && (
            <>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 700, color: "#1a2744", marginBottom: 16 }}>
                Amenities
              </h3>
              <div className="amenity-row" style={{ marginBottom: 36 }}>
                {pg.amenities.map((item) => (
                  <div key={item} className="amenity-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2a7c6f" strokeWidth="2" width="16" height="16">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span style={{ textTransform: "capitalize" }}>{item}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Reviews — static placeholder (no review model in backend yet) */}
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 700, color: "#1a2744", marginBottom: 16 }}>
            Reviews
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* If backend has reviews, map them; otherwise show a placeholder */}
            {(pg.reviews && pg.reviews.length > 0) ? (
              pg.reviews.map((r, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #e2ddd6", borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1a2744", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                        {r.name ? r.name[0].toUpperCase() : "U"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1a2744", fontSize: "0.9rem" }}>{r.name || "Tenant"}</div>
                        <div style={{ fontSize: "0.75rem", color: "#8a7f74" }}>{r.date || ""}</div>
                      </div>
                    </div>
                    <div style={{ color: "#c8922a", fontWeight: 700 }}>{"★".repeat(r.rating || 5)}</div>
                  </div>
                  <p style={{ color: "#3d3730", fontSize: "0.88rem", lineHeight: 1.65 }}>{r.comment}</p>
                </div>
              ))
            ) : (
              <div style={{ background: "#faf9f7", border: "1px dashed #e2ddd6", borderRadius: 14, padding: "28px", textAlign: "center", color: "#8a7f74", fontSize: "0.88rem" }}>
                No reviews yet. Be the first to review this property!
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Booking Card ── */}
        <div style={{
          background: "#fff", border: "1px solid #e2ddd6",
          borderRadius: 16, padding: "28px",
          boxShadow: "0 8px 40px rgba(26,39,68,0.12)",
          position: "sticky", top: 88,
        }}>

          {/* Price */}
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 900, color: "#1a2744", marginBottom: 4 }}>
            ₹{pg.rent?.toLocaleString()}
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: 400, color: "#8a7f74" }}> /month</span>
          </div>
          <p style={{ color: "#2a7c6f", fontSize: "0.82rem", fontWeight: 600, marginBottom: 22 }}>
            ✓ {pg.available !== false ? "Available now" : "Currently unavailable"}
          </p>

          {/* Move-in date */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "#8a7f74", marginBottom: 8 }}>
              Move-in Date
            </label>
            <input
              className="detail-input"
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Duration */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "#8a7f74", marginBottom: 8 }}>
              Duration
            </label>
            <select
              className="detail-input"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <option value={1}>1 Month</option>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months</option>
            </select>
          </div>

          {/* Room type */}
          {pg.roomType && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "#8a7f74", marginBottom: 8 }}>
                Room Type
              </label>
              <div style={{ background: "#faf9f7", border: "1.5px solid #e2ddd6", borderRadius: 9, padding: "11px 14px", fontSize: "0.9rem", color: "#1a2744", fontWeight: 500, textTransform: "capitalize" }}>
                {pg.roomType} Occupancy — ₹{pg.rent?.toLocaleString()}
              </div>
            </div>
          )}

          {/* Cost breakdown */}
          <div style={{ borderTop: "1px solid #e2ddd6", paddingTop: 18, marginBottom: 20 }}>
            {[
              { label: `₹${pg.rent?.toLocaleString()} × ${duration} month${duration > 1 ? "s" : ""}`, val: `₹${(pg.rent * duration).toLocaleString()}` },
              { label: "Security Deposit", val: `₹${securityDeposit.toLocaleString()}` },
              { label: "Service Fee", val: `₹${serviceFee}` },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#8a7f74", marginBottom: 10 }}>
                <span>{row.label}</span>
                <span>{row.val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", fontWeight: 700, color: "#1a2744", borderTop: "1px solid #e2ddd6", paddingTop: 12, marginTop: 4 }}>
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Reserve button */}
          <button
            onClick={handleReserve}
            style={{
              width: "100%", background: "#2a7c6f", color: "#fff",
              border: "none", borderRadius: 10, padding: "14px",
              fontFamily: "'Outfit', sans-serif", fontSize: "0.96rem",
              fontWeight: 700, cursor: "pointer", marginBottom: 10,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1f6159"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#2a7c6f"}
          >
            Reserve Now →
          </button>

          {/* Message landlord */}
          <button
            onClick={() => toast.info("Messaging feature coming soon!")}
            style={{
              width: "100%", background: "#f0ede8", color: "#1a2744",
              border: "1px solid #e2ddd6", borderRadius: 10, padding: "13px",
              fontFamily: "'Outfit', sans-serif", fontSize: "0.93rem",
              fontWeight: 600, cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#e2ddd6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#f0ede8"}
          >
            Message Landlord
          </button>

          <p style={{ textAlign: "center", color: "#8a7f74", fontSize: "0.75rem", marginTop: 12 }}>
            You won't be charged yet
          </p>
        </div>
      </div>
    </div>
  );
}