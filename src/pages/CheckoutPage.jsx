import { useState } from "react";
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
.checkout-page{min-height:calc(100vh - 68px);background:var(--bg);padding-bottom:80px;}
.checkout-wrap{max-width:1020px;margin:0 auto;padding:44px 24px;}

/* Steps */
.checkout-steps{display:flex;align-items:center;margin-bottom:40px;}
.cs-step{display:flex;align-items:center;gap:10px;flex:1;}
.cs-circle{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-weight:700;font-size:0.83rem;flex-shrink:0;transition:var(--tr);
  font-family:'Outfit',sans-serif;}
.cs-circle.done{background:var(--teal);color:#fff;}
.cs-circle.active{background:var(--navy);color:#fff;}
.cs-circle.pending{background:var(--border);color:var(--muted);}
.cs-label{font-size:0.8rem;font-weight:600;color:var(--muted);font-family:'Outfit',sans-serif;}
.cs-label.active{color:var(--navy);}
.cs-connector{flex:1;height:2px;background:var(--border);margin:0 10px;}
.cs-connector.done{background:var(--teal);}

/* Grid */
.checkout-title{font-family:'Fraunces',serif;font-size:2rem;font-weight:900;color:var(--navy);margin-bottom:6px;}
.checkout-sub{color:var(--muted);font-size:0.92rem;margin-bottom:36px;}
.checkout-grid{display:grid;grid-template-columns:1fr 356px;gap:32px;align-items:start;}

/* Cards */
.checkout-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);
  padding:28px;box-shadow:var(--shadow);margin-bottom:20px;}
.checkout-card h3{font-family:'Fraunces',serif;font-size:1.12rem;font-weight:700;color:var(--navy);
  margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border);}

/* Form */
.form-group{display:flex;flex-direction:column;gap:7px;margin-bottom:16px;}
.form-group label{font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);}
.form-input{background:var(--surface);border:1.5px solid var(--border);border-radius:10px;
  color:var(--text);font-family:'Outfit',sans-serif;font-size:0.92rem;padding:12px 14px;
  outline:none;width:100%;transition:var(--tr);}
.form-input:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(42,124,111,0.1);background:var(--white);}
.form-input.error{border-color:var(--coral);}
.form-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}

/* Payment Methods */
.pay-methods{display:flex;gap:10px;margin-bottom:20px;}
.pay-method{border:1.5px solid var(--border);border-radius:10px;padding:12px 18px;cursor:pointer;
  transition:var(--tr);display:flex;align-items:center;gap:8px;font-size:0.84rem;font-weight:600;
  color:var(--text2);background:var(--surface);font-family:'Outfit',sans-serif;}
.pay-method:hover{border-color:var(--navy);}
.pay-method.active{border-color:var(--teal);background:var(--teal-pale);color:var(--teal);}

/* Order Summary */
.order-summary-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);
  padding:24px;box-shadow:var(--shadow);position:sticky;top:88px;}
.order-summary-card h3{font-family:'Fraunces',serif;font-size:1.05rem;font-weight:700;color:var(--navy);margin-bottom:18px;}
.order-prop-img{width:100%;height:136px;object-fit:cover;border-radius:10px;margin-bottom:14px;background:var(--surface2);}
.order-prop-name{font-weight:700;color:var(--navy);font-size:0.93rem;margin-bottom:4px;font-family:'Fraunces',serif;}
.order-prop-loc{color:var(--muted);font-size:0.8rem;margin-bottom:16px;font-family:'Outfit',sans-serif;}
.order-line{display:flex;justify-content:space-between;font-size:0.86rem;padding:8px 0;
  border-bottom:1px solid var(--border);color:var(--text2);font-family:'Outfit',sans-serif;}
.order-line:last-child{border-bottom:none;font-weight:700;color:var(--navy);font-size:0.96rem;padding-top:12px;}
.order-line.deduct{color:var(--teal);}

/* Buttons */
.btn-pay{width:100%;padding:15px;border-radius:12px;background:var(--navy);color:#fff;
  border:none;font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;
  margin-top:8px;transition:var(--tr);display:flex;align-items:center;justify-content:center;gap:8px;}
.btn-pay:hover:not(:disabled){background:var(--navy2);transform:translateY(-1px);}
.btn-pay:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
.btn-pay.teal{background:var(--teal);}
.btn-pay.teal:hover:not(:disabled){background:var(--teal-light);}
.secure-row{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:0.77rem;
  margin-top:12px;padding:9px;background:var(--surface);border-radius:8px;font-family:'Outfit',sans-serif;}
.secure-row svg{color:var(--teal);width:13px;height:13px;}

/* Success Screen */
.success-screen{text-align:center;padding:60px 24px;animation:fadeUp 0.5s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.success-icon{width:84px;height:84px;border-radius:50%;background:var(--teal-pale);
  border:3px solid var(--teal);display:flex;align-items:center;justify-content:center;margin:0 auto 28px;}
.success-icon svg{width:38px;height:38px;color:var(--teal);}
.success-screen h2{font-family:'Fraunces',serif;font-size:2.2rem;font-weight:900;color:var(--navy);margin-bottom:10px;}
.success-screen p{color:var(--muted);font-size:0.97rem;max-width:480px;margin:0 auto 32px;line-height:1.75;}
.booking-ref{background:var(--teal-pale);border:1.5px solid rgba(42,124,111,0.3);border-radius:14px;
  padding:18px 32px;display:inline-block;margin-bottom:36px;}
.booking-ref span{font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;
  color:var(--teal);display:block;margin-bottom:4px;font-family:'Outfit',sans-serif;}
.booking-ref strong{font-family:'Fraunces',serif;font-size:1.5rem;font-weight:900;color:var(--navy);}
.success-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.btn-action{padding:12px 28px;border-radius:11px;font-family:'Outfit',sans-serif;font-size:0.93rem;
  font-weight:700;cursor:pointer;transition:var(--tr);border:none;}
.btn-action:hover{transform:translateY(-1px);}
.btn-action.navy{background:var(--navy);color:#fff;}
.btn-action.ghost{background:var(--surface2);color:var(--text2);}
.next-steps{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);
  padding:24px;max-width:500px;margin:40px auto 0;text-align:left;}
.next-steps h4{font-family:'Fraunces',serif;color:var(--navy);margin-bottom:16px;font-size:1rem;}
.next-step-item{display:flex;gap:12px;font-size:0.87rem;color:var(--text2);margin-bottom:12px;
  font-family:'Outfit',sans-serif;line-height:1.6;}
.step-num{width:26px;height:26px;border-radius:50%;background:var(--teal);color:#fff;
  display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;flex-shrink:0;}

/* Spinner */
.spin{width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top-color:#fff;
  border-radius:50%;animation:spin 0.7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}

@media(max-width:800px){
  .checkout-grid{grid-template-columns:1fr;}
  .order-summary-card{position:static;}
  .form-grid-2{grid-template-columns:1fr;}
  .pay-methods{flex-wrap:wrap;}
}
`;

const PG_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=70",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=70",
];

const PLATFORM_FEE_PCT = 5; // 5% platform fee from landlord

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [step, setStep] = useState(1); // 1: booking details, 2: payment, 3: success
  const [paying, setPaying] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [refCode, setRefCode] = useState("");

  // Card form
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const userId = localStorage.getItem("userId");

  const { checkInDate, checkOutDate, roomType, months, property } = state || {};

  if (!property) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", fontFamily: "'Outfit',sans-serif" }}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", color: "var(--navy)" }}>No booking data found</h3>
            <button onClick={() => navigate("/user/browse")} style={{ marginTop: 16, padding: "10px 24px", background: "var(--teal)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>Browse PGs</button>
          </div>
        </div>
      </>
    );
  }

  const totalRent = property.rent * (months || 1);
  const platformFee = Math.round(totalRent * PLATFORM_FEE_PCT / 100);
  const landlordAmount = totalRent - platformFee;
  const imgSrc = PG_IMAGES[property.pgName?.length % PG_IMAGES.length] || PG_IMAGES[0];

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
  const fmtCard = (val) => val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const fmtExpiry = (val) => val.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);

  const handleConfirmBooking = async () => {
    try {
      const res = await axios.post(`/users/${userId}/properties/${id}/bookings`, {
        checkInDate, checkOutDate, roomType,
        gender: property.gender,
      });
      const bId = res.data.data._id;
      setBookingId(bId);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Try again.");
    }
  };

  const handlePayment = async () => {
    if (!cardName || cardNumber.replace(/\s/g, "").length < 16 || cardExpiry.length < 5 || cardCvv.length < 3) {
      toast.error("Please fill in all card details correctly");
      return;
    }

    setPaying(true);
    try {
      // Simulate card processing delay
      await new Promise(r => setTimeout(r, 1800));

      // Create payment record
      await axios.post(`/bookings/${bookingId}/payments`, {
        userId,
        amount: totalRent,
        paymentMethod: "card",
        paymentStatus: "success",
        landlordAmount,
        platformFee,
      });

      // Update booking status to confirmed
      await axios.patch(`/bookings/${bookingId}/status`, { status: "confirmed" });

      const code = "PGF-" + Date.now().toString().slice(-8).toUpperCase();
      setRefCode(code);
      setStep(3);
      toast.success("Payment successful! 🎉");
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const steps = [
    { label: "Booking Details" },
    { label: "Payment" },
    { label: "Confirmation" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="checkout-page">
        <div className="checkout-wrap">

          {/* Steps */}
          <div className="checkout-steps">
            {steps.map((s, i) => (
              <div key={i} className="cs-step" style={{ flex: i < steps.length - 1 ? "1" : "none" }}>
                <div className={`cs-circle ${step > i + 1 ? "done" : step === i + 1 ? "active" : "pending"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`cs-label ${step === i + 1 ? "active" : ""}`}>{s.label}</span>
                {i < steps.length - 1 && <div className={`cs-connector${step > i + 1 ? " done" : ""}`} />}
              </div>
            ))}
          </div>

          {/* ══ STEP 1: BOOKING DETAILS ══ */}
          {step === 1 && (
            <>
              <div className="checkout-title">Review Your Booking</div>
              <div className="checkout-sub">Double-check your dates and details before proceeding.</div>

              <div className="checkout-grid">
                <div>
                  <div className="checkout-card">
                    <h3>Booking Details</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "'Outfit',sans-serif" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text2)" }}>
                        <span style={{ fontWeight: 600 }}>Property</span>
                        <span>{property.pgName}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text2)" }}>
                        <span style={{ fontWeight: 600 }}>Location</span>
                        <span>{property.area ? `${property.area}, ` : ""}{property.city}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text2)" }}>
                        <span style={{ fontWeight: 600 }}>Room Type</span>
                        <span style={{ textTransform: "capitalize" }}>{roomType}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text2)" }}>
                        <span style={{ fontWeight: 600 }}>Check-in</span>
                        <span>{fmt(checkInDate)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text2)" }}>
                        <span style={{ fontWeight: 600 }}>Check-out</span>
                        <span>{fmt(checkOutDate)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text2)" }}>
                        <span style={{ fontWeight: 600 }}>Duration</span>
                        <span>{months} month{months !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>

                  <div className="checkout-card">
                    <h3>Cancellation Policy</h3>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.87rem", color: "var(--text2)", lineHeight: 1.75 }}>
                      Free cancellation within 48 hours of booking. After that, 1 month's rent will be charged as cancellation fee. No refunds after check-in date.
                    </div>
                  </div>

                  <button className="btn-pay teal" onClick={handleConfirmBooking}>
                    Proceed to Payment →
                  </button>
                </div>

                {/* Order Summary */}
                <OrderSummary property={property} imgSrc={imgSrc} months={months} totalRent={totalRent} platformFee={platformFee} checkInDate={checkInDate} checkOutDate={checkOutDate} fmt={fmt} showFee={false} />
              </div>
            </>
          )}

          {/* ══ STEP 2: PAYMENT ══ */}
          {step === 2 && (
            <>
              <div className="checkout-title">Secure Payment</div>
              <div className="checkout-sub">Your payment details are encrypted and secure.</div>

              <div className="checkout-grid">
                <div>
                  {/* Payment method - card only */}
                  <div className="checkout-card">
                    <h3>Payment Method</h3>
                    <div className="pay-methods">
                      <div className="pay-method active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Credit / Debit Card
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Name on Card</label>
                      <input className="form-input" placeholder="Priya Sharma" value={cardName} onChange={e => setCardName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Card Number</label>
                      <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19} value={cardNumber} onChange={e => setCardNumber(fmtCard(e.target.value))} />
                    </div>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input className="form-input" placeholder="MM/YY" maxLength={5} value={cardExpiry} onChange={e => setCardExpiry(fmtExpiry(e.target.value))} />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input className="form-input" placeholder="•••" maxLength={4} type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} />
                      </div>
                    </div>
                  </div>

                  <button className="btn-pay" onClick={handlePayment} disabled={paying}>
                    {paying ? <><div className="spin" /> Processing…</> : `Pay ₹${totalRent.toLocaleString()} →`}
                  </button>
                  <div className="secure-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    256-bit SSL encryption · PCI DSS compliant · Your card data is never stored
                  </div>
                </div>

                <OrderSummary property={property} imgSrc={imgSrc} months={months} totalRent={totalRent} platformFee={platformFee} checkInDate={checkInDate} checkOutDate={checkOutDate} fmt={fmt} showFee={true} />
              </div>
            </>
          )}

          {/* ══ STEP 3: SUCCESS ══ */}
          {step === 3 && (
            <div className="success-screen">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </div>
              <h2>Booking Confirmed! 🎉</h2>
              <p>Your stay at <strong>{property.pgName}</strong> has been booked successfully. The landlord will contact you within 24 hours.</p>

              <div className="booking-ref">
                <span>Booking Reference</span>
                <strong>{refCode}</strong>
              </div>

              <div className="success-actions">
                <button className="btn-action navy" onClick={() => navigate("/user/bookings")}>View My Bookings</button>
                <button className="btn-action ghost" onClick={() => navigate("/user/browse")}>Browse More PGs</button>
              </div>

              <div className="next-steps">
                <h4>What happens next?</h4>
                <div className="next-step-item"><div className="step-num">1</div>Landlord contacts you within 24 hours to schedule a move-in visit.</div>
                <div className="next-step-item"><div className="step-num">2</div>Submit your ID verification documents via the portal.</div>
                <div className="next-step-item"><div className="step-num">3</div>Move in on your selected date. Welcome home!</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

const OrderSummary = ({ property, imgSrc, months, totalRent, platformFee, checkInDate, checkOutDate, fmt, showFee }) => (
  <div className="order-summary-card">
    <h3>Order Summary</h3>
    <img src={imgSrc} alt={property.pgName} className="order-prop-img" onError={e => { e.target.style.display = "none"; }} />
    <div className="order-prop-name">{property.pgName}</div>
    <div className="order-prop-loc">📍 {property.area ? `${property.area}, ` : ""}{property.city}</div>
    <div className="order-line"><span>📅 {fmt(checkInDate)} → {fmt(checkOutDate)}</span></div>
    <div className="order-line"><span>🛏 {months} month{months !== 1 ? "s" : ""} × ₹{property.rent?.toLocaleString()}</span><span>₹{totalRent.toLocaleString()}</span></div>
    {showFee && (
      <div className="order-line"><span>🏷 Booking fee</span><span style={{ color: "var(--teal)" }}>Free</span></div>
    )}
    <div className="order-line"><span><strong>Total Amount</strong></span><span><strong>₹{totalRent.toLocaleString()}</strong></span></div>
    {showFee && (
      <div style={{ marginTop: 12, padding: "10px 0", borderTop: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--muted)", fontFamily: "'Outfit',sans-serif", lineHeight: 1.6 }}>
        * A {5}% platform fee is deducted from landlord's payment. You pay the full rent amount.
      </div>
    )}
  </div>
);

export default CheckoutPage;