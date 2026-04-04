import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

.mybookings-wrap{max-width:1000px;margin:0 auto;padding:40px 24px 80px;}
.page-title{font-family:'Fraunces',serif;font-size:2rem;font-weight:900;color:var(--navy);margin-bottom:6px;}
.page-sub{color:var(--muted);font-size:0.9rem;margin-bottom:32px;}

/* Filter tabs */
.filter-tabs{display:flex;gap:6px;margin-bottom:28px;flex-wrap:wrap;}
.ftab{padding:7px 18px;border-radius:20px;border:1.5px solid var(--border);background:var(--white);
  color:var(--text2);font-family:'Outfit',sans-serif;font-size:0.83rem;font-weight:600;
  cursor:pointer;transition:var(--tr);}
.ftab:hover{border-color:var(--navy);color:var(--navy);}
.ftab.active{background:var(--navy);color:#fff;border-color:var(--navy);}

/* Booking cards */
.bookings-grid{display:grid;gap:20px;}
.booking-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);
  padding:24px;box-shadow:var(--shadow);transition:var(--tr);}
.booking-card:hover{box-shadow:var(--shadow-lg);}
.booking-card.cancelled{background:var(--surface);opacity:0.75;}
.bc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;gap:12px;flex-wrap:wrap;}
.bc-pg-name{font-family:'Fraunces',serif;font-size:1.2rem;font-weight:700;color:var(--navy);margin-bottom:4px;}
.bc-loc{color:var(--muted);font-size:0.83rem;display:flex;align-items:center;gap:5px;}

/* Status pills */
.status-pill{display:inline-flex;align-items:center;gap:5px;font-size:0.73rem;font-weight:700;
  padding:5px 13px;border-radius:20px;white-space:nowrap;}
.status-pill::before{content:'';width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.sp-pending{background:var(--gold-pale);color:var(--gold);}
.sp-pending::before{background:var(--gold);}
.sp-confirmed{background:rgba(42,124,111,0.1);color:var(--teal);}
.sp-confirmed::before{background:var(--teal);}
.sp-cancelled{background:var(--coral-pale);color:var(--coral);}
.sp-cancelled::before{background:var(--coral);}

.bc-info{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:18px;}
.bc-info-item{background:var(--surface);border-radius:9px;padding:10px 14px;border:1px solid var(--border);}
.bc-info-label{font-size:0.67rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:3px;font-family:'Outfit',sans-serif;}
.bc-info-val{font-size:0.88rem;font-weight:600;color:var(--navy);font-family:'Outfit',sans-serif;}

.bc-actions{display:flex;gap:10px;flex-wrap:wrap;}
.btn-view{flex:1;min-width:120px;padding:10px;border-radius:9px;border:1.5px solid var(--border);
  background:var(--white);color:var(--navy);font-family:'Outfit',sans-serif;font-size:0.85rem;
  font-weight:600;cursor:pointer;transition:var(--tr);text-align:center;}
.btn-view:hover{border-color:var(--navy);background:var(--surface2);}
.btn-cancel{flex:1;min-width:120px;padding:10px;border-radius:9px;border:none;
  background:var(--coral-pale);color:var(--coral);font-family:'Outfit',sans-serif;font-size:0.85rem;
  font-weight:600;cursor:pointer;transition:var(--tr);}
.btn-cancel:hover{background:rgba(224,90,58,0.18);}
.btn-review{flex:1;min-width:120px;padding:10px;border-radius:9px;border:none;
  background:var(--teal-pale);color:var(--teal);font-family:'Outfit',sans-serif;font-size:0.85rem;
  font-weight:600;cursor:pointer;transition:var(--tr);}
.btn-review:hover{background:rgba(42,124,111,0.18);}
.btn-dispute{flex:1;min-width:120px;padding:10px;border-radius:9px;border:none;
  background:var(--gold-pale);color:var(--gold);font-family:'Outfit',sans-serif;font-size:0.85rem;
  font-weight:600;cursor:pointer;transition:var(--tr);}
.btn-dispute:hover{background:rgba(200,146,42,0.18);}
.btn-dispute.has-dispute{background:var(--surface2);color:var(--muted);cursor:default;}

/* Empty */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:80px 24px;text-align:center;}
.empty svg{width:56px;height:56px;color:var(--border);margin-bottom:20px;}
.empty h3{font-family:'Fraunces',serif;font-size:1.4rem;font-weight:700;color:var(--navy);margin-bottom:8px;}
.empty p{color:var(--muted);font-size:0.9rem;margin-bottom:24px;}
.btn-browse{padding:12px 28px;border-radius:11px;background:var(--teal);color:#fff;border:none;
  font-family:'Outfit',sans-serif;font-size:0.93rem;font-weight:700;cursor:pointer;transition:var(--tr);}
.btn-browse:hover{background:var(--teal-light);transform:translateY(-1px);}

/* Skeleton */
.skel{background:linear-gradient(90deg,var(--surface2) 25%,var(--border) 50%,var(--surface2) 75%);
  background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px;}
@keyframes shimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}

/* Modals */
.modal-overlay{position:fixed;inset:0;background:rgba(26,39,68,0.5);z-index:1000;
  display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}
.modal-box{background:var(--white);border-radius:20px;padding:32px;width:100%;max-width:480px;
  box-shadow:var(--shadow-lg);animation:fadeUp 0.3s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
.modal-box h3{font-family:'Fraunces',serif;font-size:1.25rem;font-weight:700;color:var(--navy);margin-bottom:6px;}
.modal-box .modal-sub{color:var(--muted);font-size:0.85rem;margin-bottom:20px;}
.star-row{display:flex;gap:6px;margin-bottom:16px;}
.star-btn{font-size:1.6rem;cursor:pointer;transition:var(--tr);background:none;border:none;line-height:1;}
.star-btn:hover{transform:scale(1.15);}
.modal-actions{display:flex;gap:10px;margin-top:20px;}
.btn-submit{flex:1;padding:12px;border-radius:10px;background:var(--teal);color:#fff;border:none;
  font-family:'Outfit',sans-serif;font-size:0.93rem;font-weight:700;cursor:pointer;transition:var(--tr);}
.btn-submit:hover{background:var(--teal-light);}
.btn-submit:disabled{opacity:0.6;cursor:not-allowed;}
.btn-submit.gold{background:var(--gold);}
.btn-submit.gold:hover{background:#b07d20;}
.btn-modal-cancel{flex:1;padding:12px;border-radius:10px;background:var(--surface2);color:var(--text2);
  border:none;font-family:'Outfit',sans-serif;font-size:0.93rem;font-weight:600;cursor:pointer;transition:var(--tr);}
.btn-modal-cancel:hover{background:var(--border);}

/* Dispute badge on card */
.dispute-badge{display:inline-flex;align-items:center;gap:5px;font-size:0.72rem;font-weight:700;
  padding:4px 10px;border-radius:20px;background:var(--gold-pale);color:var(--gold);margin-top:10px;}
.dispute-badge.resolved{background:var(--teal-pale);color:var(--teal);}

/* Dispute modal textarea */
.dispute-textarea{width:100%;background:var(--surface);border:1.5px solid var(--border);
  border-radius:10px;padding:12px 14px;font-family:'Outfit',sans-serif;font-size:0.9rem;
  color:var(--text);outline:none;resize:none;transition:var(--tr);}
.dispute-textarea:focus{border-color:var(--gold);}
.dispute-info-box{background:var(--gold-pale);border:1px solid rgba(200,146,42,0.25);
  border-radius:10px;padding:12px 14px;margin-bottom:18px;font-size:0.83rem;
  color:var(--gold);font-family:'Outfit',sans-serif;display:flex;gap:8px;align-items:flex-start;}

/* My disputes tab badge */
.disputes-view .dv-item{background:var(--white);border:1px solid var(--border);
  border-radius:var(--radius);padding:20px 24px;box-shadow:var(--shadow);margin-bottom:16px;}
.dv-item-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;}
.dv-item-pg{font-family:'Fraunces',serif;font-size:1rem;font-weight:700;color:var(--navy);}
.dv-item-desc{font-size:0.88rem;color:var(--text2);margin-bottom:10px;line-height:1.55;}
.dv-item-meta{font-size:0.77rem;color:var(--muted);display:flex;gap:16px;flex-wrap:wrap;}
`;

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [myDisputes, setMyDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Review modal
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Dispute modal
  const [disputeModal, setDisputeModal] = useState(null); // { bookingId, pgName }
  const [disputeDesc, setDisputeDesc] = useState("");
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchBookings();
    fetchMyDisputes();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`/users/${userId}/bookings`);
      setBookings(res.data || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyDisputes = async () => {
    try {
      const res = await axios.get(`/users/${userId}/disputes`);
      setMyDisputes(res.data || []);
    } catch {
      // silently fail — disputes tab just shows empty
    }
  };

  // returns the dispute for a given bookingId (if any)
  const getBookingDispute = (bookingId) =>
    myDisputes.find(d => {
      const id = typeof d.bookingId === "string" ? d.bookingId : d.bookingId?._id;
      return id === bookingId;
    });

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.patch(`/bookings/${bookingId}/status`, { status: "cancelled" });
      toast.success("Booking cancelled");
      fetchBookings();
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  const handleReviewSubmit = async () => {
    if (!rating) { toast.error("Please select a rating"); return; }
    try {
      await axios.post(`/users/${userId}/properties/${reviewModal.pgId}/reviews`, {
        rating, reviewText,
      });
      toast.success("Review submitted! Thank you 🙏");
      setReviewModal(null); setRating(0); setReviewText("");
    } catch {
      toast.error("Failed to submit review");
    }
  };

  const openDisputeModal = (booking) => {
    setDisputeDesc("");
    setDisputeModal({ bookingId: booking._id, pgName: booking.pgId?.pgName || "Property", city: booking.pgId?.city });
  };

  const handleDisputeSubmit = async () => {
    if (!disputeDesc.trim()) { toast.error("Please describe your issue"); return; }
    if (disputeDesc.trim().length < 20) { toast.error("Please provide more detail (at least 20 characters)"); return; }
    setDisputeSubmitting(true);
    try {
      await axios.post("/disputes", {
        bookingId: disputeModal.bookingId,
        userId,
        description: disputeDesc.trim(),
      });
      toast.success("Dispute raised successfully. Our team will review it shortly.");
      setDisputeModal(null);
      setDisputeDesc("");
      fetchMyDisputes();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to raise dispute";
      toast.error(msg);
    } finally {
      setDisputeSubmitting(false);
    }
  };

  const statusPillClass = (s) => {
    if (s === "confirmed") return "status-pill sp-confirmed";
    if (s === "cancelled") return "status-pill sp-cancelled";
    return "status-pill sp-pending";
  };

  const FILTERS = [
    { key: "all", label: "All Bookings" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "cancelled", label: "Cancelled" },
    { key: "disputes", label: "My Disputes" },
  ];

  const filtered = filter === "disputes"
    ? bookings // handled separately below
    : filter === "all"
      ? bookings
      : bookings.filter(b => b.bookingStatus === filter);

  return (
    <>
      <style>{CSS}</style>
      <div className="mybookings-wrap">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-sub">Track and manage all your PG bookings in one place.</p>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button key={f.key} className={`ftab${filter === f.key ? " active" : ""}`} onClick={() => setFilter(f.key)}>
              {f.label}
              {f.key === "disputes" ? (
                myDisputes.length > 0 && (
                  <span style={{ marginLeft: 6, background: filter === f.key ? "rgba(255,255,255,0.25)" : "var(--gold-pale)", color: filter === f.key ? "#fff" : "var(--gold)", padding: "1px 7px", borderRadius: 10, fontSize: "0.72rem", fontWeight: 700 }}>
                    {myDisputes.length}
                  </span>
                )
              ) : f.key !== "all" ? (
                <span style={{ marginLeft: 6, background: filter === f.key ? "rgba(255,255,255,0.25)" : "var(--border)", color: filter === f.key ? "#fff" : "var(--muted)", padding: "1px 7px", borderRadius: 10, fontSize: "0.72rem" }}>
                  {bookings.filter(b => b.bookingStatus === f.key).length}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── MY DISPUTES VIEW ── */}
        {filter === "disputes" && (
          <div className="disputes-view">
            {myDisputes.length === 0 ? (
              <div className="empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <h3>No Disputes Raised</h3>
                <p>You haven't raised any disputes yet. If you have an issue with a confirmed booking, you can raise a dispute from the booking card.</p>
              </div>
            ) : (
              myDisputes.map((d, i) => {
                const pg = typeof d.bookingId === "object" ? d.bookingId?.pgId : null;
                const isResolved = d.status === "resolved";
                return (
                  <div key={d._id || i} className="dv-item">
                    <div className="dv-item-top">
                      <div className="dv-item-pg">
                        {pg?.pgName || "Property"}
                        {pg?.city && <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 400, fontSize: "0.8rem", color: "var(--muted)", marginLeft: 8 }}>· {pg.city}</span>}
                      </div>
                      <span className={`dispute-badge${isResolved ? " resolved" : ""}`}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: isResolved ? "var(--teal)" : "var(--gold)", display: "inline-block" }} />
                        {isResolved ? "Resolved" : "Open — Under Review"}
                      </span>
                    </div>
                    <p className="dv-item-desc">{d.description}</p>
                    <div className="dv-item-meta">
                      <span>Raised on: <strong>{fmt(d.createdAt)}</strong></span>
                      <span>Dispute ID: <strong>#{d._id?.slice(-8).toUpperCase()}</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── BOOKING CARDS ── */}
        {filter !== "disputes" && (
          <>
            {/* Skeleton */}
            {loading && (
              <div className="bookings-grid">
                {[1, 2, 3].map(i => (
                  <div key={i} className="booking-card">
                    <div className="skel" style={{ height: 24, width: "50%", marginBottom: 12 }} />
                    <div className="skel" style={{ height: 16, width: "30%", marginBottom: 20 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
                      {[1, 2, 3, 4].map(j => <div key={j} className="skel" style={{ height: 52 }} />)}
                    </div>
                    <div className="skel" style={{ height: 40, borderRadius: 9 }} />
                  </div>
                ))}
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="bookings-grid">
                {filtered.map((b) => {
                  const isCancelled = b.bookingStatus === "cancelled";
                  const isConfirmed = b.bookingStatus === "confirmed";
                  const existingDispute = getBookingDispute(b._id);

                  return (
                    <div key={b._id} className={`booking-card${isCancelled ? " cancelled" : ""}`}>
                      <div className="bc-top">
                        <div>
                          <div className="bc-pg-name">{b.pgId?.pgName || "Property"}</div>
                          <div className="bc-loc">
                            <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" />
                            </svg>
                            {b.pgId?.city || "—"}
                          </div>
                        </div>
                        <span className={statusPillClass(b.bookingStatus)}>{b.bookingStatus}</span>
                      </div>

                      <div className="bc-info">
                        <div className="bc-info-item">
                          <div className="bc-info-label">Monthly Rent</div>
                          <div className="bc-info-val">₹{b.pgId?.rent?.toLocaleString() || "—"}</div>
                        </div>
                        <div className="bc-info-item">
                          <div className="bc-info-label">Room Type</div>
                          <div className="bc-info-val" style={{ textTransform: "capitalize" }}>{b.roomType}</div>
                        </div>
                        <div className="bc-info-item">
                          <div className="bc-info-label">Check-in</div>
                          <div className="bc-info-val">{fmt(b.checkInDate)}</div>
                        </div>
                        <div className="bc-info-item">
                          <div className="bc-info-label">Check-out</div>
                          <div className="bc-info-val">{fmt(b.checkOutDate)}</div>
                        </div>
                      </div>

                      {/* Show dispute status badge if one exists */}
                      {existingDispute && (
                        <div style={{ marginBottom: 12 }}>
                          <span className={`dispute-badge${existingDispute.status === "resolved" ? " resolved" : ""}`}>
                            ⚖️ Dispute {existingDispute.status === "resolved" ? "Resolved" : "Open — Under Review"}
                          </span>
                        </div>
                      )}

                      <div className="bc-actions">
                        <button
                          className="btn-view"
                          onClick={() => navigate(`/property/${b.pgId?._id}`)}
                        >
                          View Property
                        </button>

                        {!isCancelled && (
                          <button className="btn-cancel" onClick={() => handleCancel(b._id)}>
                            Cancel Booking
                          </button>
                        )}

                        {isConfirmed && (
                          <button
                            className="btn-review"
                            onClick={() => setReviewModal({ bookingId: b._id, pgId: b.pgId?._id })}
                          >
                            Leave Review
                          </button>
                        )}

                        {/* Raise Dispute — only for confirmed bookings, only if no open dispute yet */}
                        {isConfirmed && !existingDispute && (
                          <button
                            className="btn-dispute"
                            onClick={() => openDisputeModal(b)}
                          >
                            Raise Dispute
                          </button>
                        )}

                        {/* Already has open dispute — show disabled state */}
                        {isConfirmed && existingDispute && existingDispute.status === "open" && (
                          <button className="btn-dispute has-dispute" disabled>
                            Dispute Raised
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <h3>{filter === "all" ? "No bookings yet" : `No ${filter} bookings`}</h3>
                <p>{filter === "all" ? "Find your perfect PG and make your first booking." : `You don't have any ${filter} bookings right now.`}</p>
                {filter === "all" && (
                  <button className="btn-browse" onClick={() => navigate("/browse")}>Browse PGs</button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ══ REVIEW MODAL ══ */}
      {reviewModal && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Leave a Review</h3>
            <p className="modal-sub">Share your experience to help other students.</p>
            <div className="star-row">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} className="star-btn" onClick={() => setRating(s)}>
                  <span style={{ color: s <= rating ? "#f59e0b" : "#d1d5db" }}>★</span>
                </button>
              ))}
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", color: "var(--muted)", alignSelf: "center", marginLeft: 4 }}>
                {rating > 0 ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating] : "Select rating"}
              </span>
            </div>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Share your experience about this PG..."
              rows={4}
              style={{ width: "100%", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "12px 14px", fontFamily: "'Outfit',sans-serif", fontSize: "0.9rem", color: "var(--text)", outline: "none", resize: "none", transition: "var(--tr)" }}
            />
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setReviewModal(null)}>Cancel</button>
              <button className="btn-submit" onClick={handleReviewSubmit}>Submit Review</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DISPUTE MODAL ══ */}
      {disputeModal && (
        <div className="modal-overlay" onClick={() => { setDisputeModal(null); setDisputeDesc(""); }}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Raise a Dispute</h3>
            <p className="modal-sub">
              {disputeModal.pgName}{disputeModal.city ? ` · ${disputeModal.city}` : ""}
            </p>

            <div className="dispute-info-box">
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚠️</span>
              <span>Disputes are reviewed by our admin team within 2–3 business days. Only raise a dispute if you have a genuine issue with your confirmed booking.</span>
            </div>

            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>
              Describe your issue <span style={{ color: "var(--coral)" }}>*</span>
            </label>
            <textarea
              className="dispute-textarea"
              value={disputeDesc}
              onChange={e => setDisputeDesc(e.target.value)}
              placeholder="Explain the issue clearly — e.g. 'The property condition was different from what was advertised. The AC was not working and there was no hot water supply...'"
              rows={5}
            />
            <div style={{ textAlign: "right", fontSize: "0.75rem", color: disputeDesc.length < 20 ? "var(--coral)" : "var(--muted)", fontFamily: "'Outfit',sans-serif", marginTop: 4 }}>
              {disputeDesc.length} chars {disputeDesc.length < 20 ? `(min 20)` : "✓"}
            </div>

            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => { setDisputeModal(null); setDisputeDesc(""); }}>Cancel</button>
              <button
                className="btn-submit gold"
                onClick={handleDisputeSubmit}
                disabled={disputeSubmitting || disputeDesc.trim().length < 20}
              >
                {disputeSubmitting ? "Submitting…" : "Submit Dispute"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyBookings;