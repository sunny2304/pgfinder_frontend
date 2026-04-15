import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PG_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=70",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=70",
];

const PLATFORM_FEE_PCT = 5;

const labelCls = "block text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-1.5";

// Calculate months between two dates (minimum 1, partial months round up)
const calcMonths = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end - start;
  if (diffMs <= 0) return 1;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const exactMonths = diffDays / 30.44;
  return Math.max(1, Math.ceil(exactMonths));
};

// Load Razorpay script dynamically
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [step, setStep] = useState(1);
  const [paying, setPaying] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [refCode, setRefCode] = useState("");

  const userId = localStorage.getItem("userId");
  const { checkInDate, checkOutDate, roomType, property } = state || {};

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ fontFamily: "'Outfit',sans-serif" }}>
        <div className="text-center">
          <h3 className="text-[1.2rem] font-bold text-[#1a2744] mb-4" style={{ fontFamily: "'Fraunces',serif" }}>No booking data found</h3>
          <button onClick={() => navigate("/browse")} className="mt-4 py-2.5 px-6 bg-[#2a7c6f] text-white border-none rounded-[10px] cursor-pointer font-bold text-[0.9rem]" style={{ fontFamily: "'Outfit',sans-serif" }}>
            Browse PGs
          </button>
        </div>
      </div>
    );
  }

  const months = calcMonths(checkInDate, checkOutDate);
  const bookedCategory = property.roomCategories?.find((c) => c.type === roomType);
  const pricePerBed = bookedCategory?.pricePerBed || property.rent || 0;
  const totalRent = pricePerBed * months;
  const platformFee = Math.round(totalRent * PLATFORM_FEE_PCT / 100);
  const landlordAmount = totalRent - platformFee;
  const imgSrc = PG_IMAGES[property.pgName?.length % PG_IMAGES.length] || PG_IMAGES[0];

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  // ── STEP 1: Create booking in DB with "pending" status, then go to payment step
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

  // ── STEP 2: Open Razorpay popup
  const handleRazorpayPayment = async () => {
    setPaying(true);

    // 1. Load Razorpay SDK
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Razorpay failed to load. Check your internet connection.");
      setPaying(false);
      return;
    }

    try {
      // 2. Create order on backend
      const { data } = await axios.post("/payment/create-order", { amount: totalRent });

      if (!data.success || !data.order) {
        throw new Error("Failed to create payment order.");
      }

      const order = data.order;

      // 3. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "PG Finder",
        description: `Booking at ${property.pgName}`,
        image: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
        order_id: order.id,

        handler: async function (response) {
          // 4. Verify payment on backend → saves Payment record + confirms/cancels booking
          try {
            const verifyRes = await axios.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
              userId,
              amount: totalRent,
            });

            if (verifyRes.data.success) {
              // ✅ Payment success — booking confirmed by backend
              setRefCode(bookingId);
              setStep(3);
              toast.success("Payment successful! 🎉");
            } else {
              // ❌ Payment verification failed — cancel the booking
              await axios.patch(`/bookings/${bookingId}/status`, { status: "cancelled" });
              toast.error("Payment verification failed. Booking has been cancelled.");
            }
          } catch {
            // ❌ Error during verification — cancel the booking
            await axios.patch(`/bookings/${bookingId}/status`, { status: "cancelled" });
            toast.error("Payment failed. Your booking has been cancelled.");
          } finally {
            setPaying(false);
          }
        },

        prefill: {
          name: localStorage.getItem("userName") || "PG Finder User",
          email: localStorage.getItem("userEmail") || "",
          contact: localStorage.getItem("userPhone") || "",
        },

        theme: { color: "#2a7c6f" },

        modal: {
          ondismiss: async function () {
            setPaying(false);
            // ❌ User closed Razorpay without paying — cancel the booking
            if (bookingId) {
              await axios.patch(`/bookings/${bookingId}/status`, { status: "cancelled" });
            }
            toast.info("Payment cancelled. Booking has been cancelled.");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.response?.data?.message || err.message || "Something went wrong.");
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

          {/* ── STEP INDICATOR ── */}
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
                        { label: "Duration", val: `${months} month${months !== 1 ? "s" : ""}` },
                        { label: "Check-out", val: fmt(checkOutDate) },
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

                <OrderSummary
                  property={property} imgSrc={imgSrc} months={months}
                  pricePerBed={pricePerBed} roomType={roomType} totalRent={totalRent}
                  checkInDate={checkInDate} checkOutDate={checkOutDate} fmt={fmt} showFee={false}
                />
              </div>
            </>
          )}

          {/* ══ STEP 2: PAYMENT (Razorpay) ══ */}
          {step === 2 && (
            <>
              <h1 className="text-[2rem] font-black text-[#1a2744] mb-1.5" style={{ fontFamily: "'Fraunces',serif" }}>Secure Payment</h1>
              <p className="text-[#8a7f74] text-[0.92rem] mb-9">Complete your payment securely via Razorpay.</p>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_356px] gap-8 items-start">
                <div>
                  <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-7 shadow-[0_2px_16px_rgba(26,39,68,0.08)] mb-5">
                    <h3 className="text-[1.12rem] font-bold text-[#1a2744] mb-5 pb-3.5 border-b border-[#e2ddd6]" style={{ fontFamily: "'Fraunces',serif" }}>Payment Method</h3>

                    {/* Payment summary info */}
                    <div className="bg-[#f5f2ed] rounded-[12px] p-5 mb-6">
                      <div className="flex justify-between text-[0.9rem] mb-2">
                        <span className="text-[#8a7f74]">Property</span>
                        <span className="font-semibold text-[#1a2744]">{property.pgName}</span>
                      </div>
                      <div className="flex justify-between text-[0.9rem] mb-2">
                        <span className="text-[#8a7f74]">Duration</span>
                        <span className="font-semibold text-[#1a2744]">{months} month{months !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex justify-between text-[0.9rem] pt-3 border-t border-[#e2ddd6]">
                        <span className="font-bold text-[#1a2744]">Total Amount</span>
                        <span className="font-bold text-[#2a7c6f] text-[1.1rem]">₹{totalRent.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Pay button */}
                    <button
                      className="w-full py-[15px] rounded-[12px] bg-[#1a2744] text-white border-none text-[1rem] font-bold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[#243356] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                      onClick={handleRazorpayPayment}
                      disabled={paying}
                      style={{ fontFamily: "'Outfit',sans-serif" }}
                    >
                      {paying ? (
                        <><div className="checkout-spinner" /> Opening Razorpay…</>
                      ) : (
                        `Pay ₹${totalRent.toLocaleString()} via Razorpay →`
                      )}
                    </button>

                    <div className="flex items-center gap-1.5 text-[#8a7f74] text-[0.77rem] mt-3 py-2.5 px-3 bg-[#faf9f7] rounded-[8px]">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a7c6f" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      256-bit SSL encryption · Powered by Razorpay · Your data is safe
                    </div>
                  </div>
                </div>

                <OrderSummary
                  property={property} imgSrc={imgSrc} months={months}
                  pricePerBed={pricePerBed} roomType={roomType} totalRent={totalRent}
                  checkInDate={checkInDate} checkOutDate={checkOutDate} fmt={fmt} showFee={true}
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

              <div className="bg-[#e8f5f3] border-[1.5px] border-[rgba(42,124,111,0.3)] rounded-[14px] py-4 px-8 inline-block mb-9">
                <span className="text-[0.75rem] font-bold uppercase tracking-[1.5px] text-[#2a7c6f] block mb-1">Booking Reference</span>
                <strong className="text-[1.5rem] font-black text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>{refCode}</strong>
              </div>

              <div className="flex gap-3 justify-center flex-wrap mb-12">
                <button className="py-3 px-7 rounded-[11px] bg-[#1a2744] text-white border-none text-[0.93rem] font-bold cursor-pointer hover:-translate-y-px transition-all duration-300 hover:bg-[#243356]" onClick={() => navigate("/bookings")} style={{ fontFamily: "'Outfit',sans-serif" }}>View My Bookings</button>
                <button className="py-3 px-7 rounded-[11px] bg-[#f0ede8] text-[#3d3730] border-none text-[0.93rem] font-bold cursor-pointer hover:-translate-y-px transition-all duration-300 hover:bg-[#e2ddd6]" onClick={() => navigate("/browse")} style={{ fontFamily: "'Outfit',sans-serif" }}>Browse More PGs</button>
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

// ── Order Summary sidebar component (unchanged)
const OrderSummary = ({ property, imgSrc, months, pricePerBed, roomType, totalRent, checkInDate, checkOutDate, fmt, showFee }) => (
  <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 shadow-[0_2px_16px_rgba(26,39,68,0.08)] sticky top-[88px]" style={{ fontFamily: "'Outfit',sans-serif" }}>
    <h3 className="text-[1.05rem] font-bold text-[#1a2744] mb-4" style={{ fontFamily: "'Fraunces',serif" }}>Order Summary</h3>
    <img src={imgSrc} alt={property.pgName} className="w-full h-[136px] object-cover rounded-[10px] mb-3.5 bg-[#f0ede8]" onError={e => { e.target.style.display = "none"; }} />
    <div className="font-bold text-[#1a2744] text-[0.93rem] mb-1" style={{ fontFamily: "'Fraunces',serif" }}>{property.pgName}</div>
    <div className="text-[#8a7f74] text-[0.8rem] mb-4">📍 {property.area ? `${property.area}, ` : ""}{property.city}</div>

    <div className="flex justify-between text-[0.86rem] py-2 border-b border-[#e2ddd6] text-[#3d3730]">
      <span>📅 Check-in</span>
      <span className="font-semibold">{fmt(checkInDate)}</span>
    </div>
    <div className="flex justify-between text-[0.86rem] py-2 border-b border-[#e2ddd6] text-[#3d3730]">
      <span>⏱ Duration</span>
      <span className="font-semibold">{months} month{months !== 1 ? "s" : ""}</span>
    </div>
    <div className="flex justify-between text-[0.86rem] py-2 border-b border-[#e2ddd6] text-[#3d3730]">
      <span>📅 Check-out</span>
      <span className="font-semibold">{fmt(checkOutDate)}</span>
    </div>
    <div className="flex justify-between text-[0.86rem] py-2 border-b border-[#e2ddd6] text-[#3d3730]">
      <span>🛏 {months} month{months !== 1 ? "s" : ""} × ₹{pricePerBed?.toLocaleString()} ({roomType})</span>
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