import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PG_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=70",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=70",
];

const PLATFORM_FEE_PCT = 5;

const inputCls = "w-full bg-[#faf9f7] border-[1.5px] border-[#e2ddd6] rounded-[10px] text-[#1a1a1a] text-[0.92rem] py-3 px-3.5 outline-none transition-all duration-300 focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.1)] focus:bg-white";
const labelCls = "block text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-1.5";

// ✅ Calculate months between two dates
// Minimum = 1 month, partial months round UP (e.g. 1.2 months → 2 months)
const calcMonths = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end - start;
  if (diffMs <= 0) return 1;

  // Exact months as a decimal
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const exactMonths = diffDays / 30.44; // average days per month

  // Minimum 1 month; anything above 1 month rounds UP
  const rounded = Math.ceil(exactMonths);
  return Math.max(1, rounded);
};

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [step, setStep] = useState(1);
  const [paying, setPaying] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [refCode, setRefCode] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const userId = localStorage.getItem("userId");
  const { checkInDate, checkOutDate, roomType, property } = state || {};

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ fontFamily: "'Outfit',sans-serif" }}>
        <div className="text-center">
          <h3 className="text-[1.2rem] font-bold text-[#1a2744] mb-4" style={{ fontFamily: "'Fraunces',serif" }}>No booking data found</h3>
          <button onClick={() => navigate("/user/browse")} className="mt-4 py-2.5 px-6 bg-[#2a7c6f] text-white border-none rounded-[10px] cursor-pointer font-bold text-[0.9rem]" style={{ fontFamily: "'Outfit',sans-serif" }}>
            Browse PGs
          </button>
        </div>
      </div>
    );
  }

  // ✅ Always recalculate months from dates (ignore any months passed in state)
  const months = calcMonths(checkInDate, checkOutDate);

  const totalRent = property.rent * months;
  const platformFee = Math.round(totalRent * PLATFORM_FEE_PCT / 100);
  const landlordAmount = totalRent - platformFee;
  const imgSrc = PG_IMAGES[property.pgName?.length % PG_IMAGES.length] || PG_IMAGES[0];

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
  const fmtCard = (val) => val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const fmtExpiry = (val) => val.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);

  const handleConfirmBooking = async () => {
    try {
      const res = await axios.post(`/users/${userId}/properties/${id}/bookings`, {
        checkInDate, checkOutDate, roomType, gender: property.gender,
      });
      setBookingId(res.data.data._id);
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
      await new Promise(r => setTimeout(r, 1800));
      await axios.post(`/bookings/${bookingId}/payments`, {
        userId, amount: totalRent, paymentMethod: "card",
        paymentStatus: "success", landlordAmount, platformFee,
      });
      await axios.patch(`/bookings/${bookingId}/status`, { status: "confirmed" });
      const code = "PGF-" + Date.now().toString().slice(-8).toUpperCase();
      setRefCode(code);
      setStep(3);
      toast.success("Payment successful! 🎉");
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const steps = ["Booking Details", "Payment", "Confirmation"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .checkout-spinner { width:20px; height:20px; border:3px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
        .checkout-animate { animation: fadeUp 0.5s ease both; }
      `}</style>

      <div className="min-h-[calc(100vh-68px)] bg-[#f5f2ed] pb-20" style={{ fontFamily: "'Outfit',sans-serif" }}>
        <div className="max-w-[1020px] mx-auto px-6 pt-11">

          {/* ── STEPS ── */}
          <div className="flex items-center mb-10">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center" style={{ flex: i < steps.length - 1 ? 1 : "none" }}>
                <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center font-bold text-[0.83rem] flex-shrink-0 transition-all duration-300 ${step > i + 1 ? "bg-[#2a7c6f] text-white" : step === i + 1 ? "bg-[#1a2744] text-white" : "bg-[#e2ddd6] text-[#8a7f74]"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`ml-2.5 text-[0.8rem] font-semibold ${step === i + 1 ? "text-[#1a2744]" : "text-[#8a7f74]"}`}>{s}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-[2px] mx-2.5 ${step > i + 1 ? "bg-[#2a7c6f]" : "bg-[#e2ddd6]"}`} />}
              </div>
            ))}
          </div>

          {/* ══ STEP 1: BOOKING DETAILS ══ */}
          {step === 1 && (
            <>
              <h1 className="text-[2rem] font-black text-[#1a2744] mb-1.5" style={{ fontFamily: "'Fraunces',serif" }}>Review Your Booking</h1>
              <p className="text-[#8a7f74] text-[0.92rem] mb-9">Double-check your dates and details before proceeding.</p>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_356px] gap-8 items-start">
                <div>
                  {/* Booking details card */}
                  <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-7 shadow-[0_2px_16px_rgba(26,39,68,0.08)] mb-5">
                    <h3 className="text-[1.12rem] font-bold text-[#1a2744] mb-5 pb-3.5 border-b border-[#e2ddd6]" style={{ fontFamily: "'Fraunces',serif" }}>Booking Details</h3>
                    <div className="flex flex-col gap-3.5">
                      {[
                        { label: "Property", val: property.pgName },
                        { label: "Location", val: `${property.area ? property.area + ", " : ""}${property.city}` },
                        { label: "Room Type", val: roomType, capitalize: true },
                        { label: "Check-in", val: fmt(checkInDate) },
                        { label: "Check-out", val: fmt(checkOutDate) },
                        { label: "Duration", val: `${months} month${months !== 1 ? "s" : ""}` },
                      ].map(({ label, val, capitalize }) => (
                        <div key={label} className="flex justify-between text-[0.9rem]">
                          <span className="font-semibold text-[#3d3730]">{label}</span>
                          <span className={`text-[#3d3730] ${capitalize ? "capitalize" : ""}`}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cancellation policy */}
                  <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-7 shadow-[0_2px_16px_rgba(26,39,68,0.08)] mb-5">
                    <h3 className="text-[1.12rem] font-bold text-[#1a2744] mb-5 pb-3.5 border-b border-[#e2ddd6]" style={{ fontFamily: "'Fraunces',serif" }}>Cancellation Policy</h3>
                    <p className="text-[0.87rem] text-[#3d3730] leading-[1.75]">
                      Free cancellation within 48 hours of booking. After that, 1 month's rent will be charged as cancellation fee. No refunds after check-in date.
                    </p>
                  </div>

                  <button
                    className="w-full py-[15px] rounded-[12px] bg-[#2a7c6f] text-white border-none text-[1rem] font-bold cursor-pointer transition-all duration-300 hover:bg-[#3a9e8e] hover:-translate-y-px"
                    onClick={handleConfirmBooking}
                    style={{ fontFamily: "'Outfit',sans-serif" }}
                  >
                    Proceed to Payment →
                  </button>
                </div>

                {/* ✅ Pass checkInDate & checkOutDate directly */}
                <OrderSummary
                  property={property}
                  imgSrc={imgSrc}
                  months={months}
                  totalRent={totalRent}
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  fmt={fmt}
                  showFee={false}
                />
              </div>
            </>
          )}

          {/* ══ STEP 2: PAYMENT ══ */}
          {step === 2 && (
            <>
              <h1 className="text-[2rem] font-black text-[#1a2744] mb-1.5" style={{ fontFamily: "'Fraunces',serif" }}>Secure Payment</h1>
              <p className="text-[#8a7f74] text-[0.92rem] mb-9">Your payment details are encrypted and secure.</p>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_356px] gap-8 items-start">
                <div>
                  <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-7 shadow-[0_2px_16px_rgba(26,39,68,0.08)] mb-5">
                    <h3 className="text-[1.12rem] font-bold text-[#1a2744] mb-5 pb-3.5 border-b border-[#e2ddd6]" style={{ fontFamily: "'Fraunces',serif" }}>Payment Method</h3>

                    <div className="flex gap-2.5 mb-5">
                      <div className="border-[1.5px] border-[#2a7c6f] bg-[#e8f5f3] text-[#2a7c6f] rounded-[10px] py-3 px-4.5 flex items-center gap-2 text-[0.84rem] font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Credit / Debit Card
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 mb-4">
                      <label className={labelCls}>Name on Card</label>
                      <input className={inputCls} placeholder="Priya Sharma" value={cardName} onChange={e => setCardName(e.target.value)} style={{ fontFamily: "'Outfit',sans-serif" }} />
                    </div>
                    <div className="flex flex-col gap-1.5 mb-4">
                      <label className={labelCls}>Card Number</label>
                      <input className={inputCls} placeholder="1234 5678 9012 3456" maxLength={19} value={cardNumber} onChange={e => setCardNumber(fmtCard(e.target.value))} style={{ fontFamily: "'Outfit',sans-serif" }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Expiry Date</label>
                        <input className={inputCls} placeholder="MM/YY" maxLength={5} value={cardExpiry} onChange={e => setCardExpiry(fmtExpiry(e.target.value))} style={{ fontFamily: "'Outfit',sans-serif" }} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>CVV</label>
                        <input className={inputCls} placeholder="•••" maxLength={4} type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} style={{ fontFamily: "'Outfit',sans-serif" }} />
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full py-[15px] rounded-[12px] bg-[#1a2744] text-white border-none text-[1rem] font-bold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[#243356] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handlePayment}
                    disabled={paying}
                    style={{ fontFamily: "'Outfit',sans-serif" }}
                  >
                    {paying ? (
                      <><div className="checkout-spinner" /> Processing…</>
                    ) : (
                      `Pay ₹${totalRent.toLocaleString()} →`
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 text-[#8a7f74] text-[0.77rem] mt-3 py-2.5 px-3 bg-[#faf9f7] rounded-[8px]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a7c6f" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    256-bit SSL encryption · PCI DSS compliant · Your card data is never stored
                  </div>
                </div>

                <OrderSummary
                  property={property}
                  imgSrc={imgSrc}
                  months={months}
                  totalRent={totalRent}
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  fmt={fmt}
                  showFee={true}
                />
              </div>
            </>
          )}

          {/* ══ STEP 3: SUCCESS ══ */}
          {step === 3 && (
            <div className="text-center py-16 px-6 checkout-animate">
              <div className="w-[84px] h-[84px] rounded-full bg-[#e8f5f3] border-[3px] border-[#2a7c6f] flex items-center justify-center mx-auto mb-7">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#2a7c6f" strokeWidth="2.5">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </div>

              <h2 className="text-[2.2rem] font-black text-[#1a2744] mb-2.5" style={{ fontFamily: "'Fraunces',serif" }}>Booking Confirmed! 🎉</h2>
              <p className="text-[#8a7f74] text-[0.97rem] max-w-[480px] mx-auto mb-8 leading-[1.75]">
                Your stay at <strong className="text-[#1a2744]">{property.pgName}</strong> has been booked successfully. The landlord will contact you within 24 hours.
              </p>

              <div className="bg-[#e8f5f3] border-[1.5px] border-[rgba(42,124,111,0.3)] rounded-[14px] py-4.5 px-8 inline-block mb-9">
                <span className="text-[0.75rem] font-bold uppercase tracking-[1.5px] text-[#2a7c6f] block mb-1">Booking Reference</span>
                <strong className="text-[1.5rem] font-black text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>{refCode}</strong>
              </div>

              <div className="flex gap-3 justify-center flex-wrap mb-12">
                <button className="py-3 px-7 rounded-[11px] bg-[#1a2744] text-white border-none text-[0.93rem] font-bold cursor-pointer hover:-translate-y-px transition-all duration-300 hover:bg-[#243356]" onClick={() => navigate("/user/bookings")} style={{ fontFamily: "'Outfit',sans-serif" }}>View My Bookings</button>
                <button className="py-3 px-7 rounded-[11px] bg-[#f0ede8] text-[#3d3730] border-none text-[0.93rem] font-bold cursor-pointer hover:-translate-y-px transition-all duration-300 hover:bg-[#e2ddd6]" onClick={() => navigate("/user/browse")} style={{ fontFamily: "'Outfit',sans-serif" }}>Browse More PGs</button>
              </div>

              <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 max-w-[500px] mx-auto text-left">
                <h4 className="font-bold text-[1rem] text-[#1a2744] mb-4" style={{ fontFamily: "'Fraunces',serif" }}>What happens next?</h4>
                {[
                  "Landlord contacts you within 24 hours to schedule a move-in visit.",
                  "Submit your ID verification documents via the portal.",
                  "Move in on your selected date. Welcome home!",
                ].map((s, i) => (
                  <div key={i} className="flex gap-3 text-[0.87rem] text-[#3d3730] mb-3 leading-[1.6]">
                    <div className="w-[26px] h-[26px] rounded-full bg-[#2a7c6f] text-white flex items-center justify-center font-bold text-[0.75rem] flex-shrink-0">{i + 1}</div>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

// ✅ OrderSummary now receives checkInDate & checkOutDate as props and displays them
const OrderSummary = ({ property, imgSrc, months, totalRent, checkInDate, checkOutDate, fmt, showFee }) => (
  <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 shadow-[0_2px_16px_rgba(26,39,68,0.08)] sticky top-[88px]" style={{ fontFamily: "'Outfit',sans-serif" }}>
    <h3 className="text-[1.05rem] font-bold text-[#1a2744] mb-4" style={{ fontFamily: "'Fraunces',serif" }}>Order Summary</h3>
    <img src={imgSrc} alt={property.pgName} className="w-full h-[136px] object-cover rounded-[10px] mb-3.5 bg-[#f0ede8]" onError={e => { e.target.style.display = "none"; }} />
    <div className="font-bold text-[#1a2744] text-[0.93rem] mb-1" style={{ fontFamily: "'Fraunces',serif" }}>{property.pgName}</div>
    <div className="text-[#8a7f74] text-[0.8rem] mb-4">📍 {property.area ? `${property.area}, ` : ""}{property.city}</div>

    {/* ✅ Check-in / Check-out dates from state */}
    <div className="flex justify-between text-[0.86rem] py-2 border-b border-[#e2ddd6] text-[#3d3730]">
      <span>📅 Check-in</span>
      <span className="font-semibold">{fmt(checkInDate)}</span>
    </div>
    <div className="flex justify-between text-[0.86rem] py-2 border-b border-[#e2ddd6] text-[#3d3730]">
      <span>📅 Check-out</span>
      <span className="font-semibold">{fmt(checkOutDate)}</span>
    </div>

    {/* ✅ Duration & price breakdown */}
    <div className="flex justify-between text-[0.86rem] py-2 border-b border-[#e2ddd6] text-[#3d3730]">
      <span>🛏 {months} month{months !== 1 ? "s" : ""} × ₹{property.rent?.toLocaleString()}</span>
      <span>₹{totalRent.toLocaleString()}</span>
    </div>

    {showFee && (
      <div className="flex justify-between text-[0.86rem] py-2 border-b border-[#e2ddd6] text-[#3d3730]">
        <span>🏷 Booking fee</span>
        <span className="text-[#2a7c6f] font-semibold">Free</span>
      </div>
    )}

    <div className="flex justify-between text-[0.96rem] font-bold text-[#1a2744] pt-3">
      <span>Total Amount</span>
      <span>₹{totalRent.toLocaleString()}</span>
    </div>

    {showFee && (
      <p className="mt-3 pt-2.5 border-t border-[#e2ddd6] text-[0.75rem] text-[#8a7f74] leading-[1.6]">
        * A 5% platform fee is deducted from landlord's payment. You pay the full rent amount.
      </p>
    )}
  </div>
);

export default CheckoutPage;