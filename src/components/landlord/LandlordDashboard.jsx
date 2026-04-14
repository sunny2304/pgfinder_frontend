import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import EarningsTab from "./Landlordearningstab";

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const monthsDiff = (d1, d2) => {
  if (!d1 || !d2) return 0;
  const diff = (new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24 * 30);
  return Math.max(1, Math.round(diff));
};

const pillCls = (s) => {
  if (!s) return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]";
  const v = s.toLowerCase();
  if (v === "confirmed" || v === "active" || v === "available" || v === "open")
    return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[rgba(42,124,111,0.1)] text-[#2a7c6f]";
  if (v === "cancelled" || v === "paused" || v === "resolved")
    return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf0ec] text-[#e05a3a]";
  return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]";
};

const PillDot = ({ status }) => {
  const color = !status ? "#c8922a"
    : (status === "confirmed" || status === "active" || status === "open") ? "#2a7c6f"
    : (status === "cancelled" || status === "paused" || status === "resolved") ? "#e05a3a"
    : "#c8922a";
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />;
};

const inputCls = "bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] text-[#1a1a1a] text-[0.9rem] py-3 px-3.5 outline-none w-full transition-all duration-300 resize-none focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.1)] focus:bg-white";
const labelCls = "text-[0.7rem] font-bold uppercase tracking-[0.9px] text-[#8a7f74] block mb-1.5";

const BtnSm = ({ cls, onClick, children, type = "button", disabled }) => (
  <button
    type={type}
    disabled={disabled}
    className={`py-1.5 px-3.5 rounded-[8px] text-[0.78rem] font-semibold cursor-pointer border-none transition-all duration-300 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed ${cls}`}
    style={{ fontFamily: "'Outfit',sans-serif" }}
    onClick={onClick}
  >
    {children}
  </button>
);

// ── Get price per bed for a specific room type from a property ─────────────
const getPriceForRoomType = (property, roomType) => {
  if (property?.roomCategories?.length > 0 && roomType) {
    const cat = property.roomCategories.find(c => c.type === roomType);
    if (cat?.pricePerBed) return cat.pricePerBed;
  }
  return property?.rent || 0;
};

// ── Get total/available rooms from property ────────────────────────────────
const getRoomSummary = (property) => {
  if (property.roomCategories && property.roomCategories.length > 0) {
    const total = property.roomCategories.reduce((s, c) => s + (c.totalRooms || 0), 0);
    const available = property.roomCategories.reduce((s, c) => s + (c.availableRooms || 0), 0);
    return { total, available };
  }
  return { total: "—", available: "—" };
};

// ── Property View Modal ────────────────────────────────────────────────────
const PropViewModal = ({ property, onClose }) => {
  if (!property) return null;
  const { total, available } = getRoomSummary(property);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[520px] mx-4 p-8 max-h-[90vh] overflow-y-auto" style={{ animation: "fadeUp 0.3s ease both" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[1.1rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>{property.pgName}</h3>
          <button onClick={onClose} className="text-[#8a7f74] hover:text-[#1a2744] text-xl border-none bg-transparent cursor-pointer leading-none">×</button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            ["City", property.city || "—"],
            ["Area", property.area || "—"],
            ["Address", property.address || "—"],
            ["Gender", property.gender ? property.gender.charAt(0).toUpperCase() + property.gender.slice(1) : "—"],
            ["Status", property.available ? "Available" : "Paused"],
            ["Rent From", property.rent ? `₹${property.rent.toLocaleString()}` : "—"],
            ["Total Rooms", typeof total === "number" ? total : "—"],
            ["Available Rooms", typeof available === "number" ? available : "—"],
          ].map(([k, v]) => (
            <div key={k} className="bg-[#faf9f7] rounded-[10px] p-3.5">
              <div className="text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-1">{k}</div>
              <div className="text-[0.88rem] font-semibold text-[#1a2744]">{v}</div>
            </div>
          ))}
        </div>

        {property.roomCategories?.length > 0 && (
          <div className="mb-4">
            <div className="text-[0.78rem] font-bold text-[#8a7f74] uppercase tracking-[1px] mb-2">Room Types</div>
            <div className="flex flex-col gap-2">
              {property.roomCategories.map(cat => (
                <div key={cat.type} className="flex items-center justify-between bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] px-3.5 py-2.5">
                  <span className="text-[0.85rem] font-semibold text-[#1a2744] capitalize">{cat.type} Occupancy</span>
                  <div className="flex gap-3 text-[0.78rem] text-[#8a7f74]">
                    <span>{cat.availableRooms}/{cat.totalRooms} rooms</span>
                    <span className="font-semibold text-[#2a7c6f]">₹{cat.pricePerBed?.toLocaleString()}/bed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {property.amenities?.length > 0 && (
          <div className="mb-4">
            <div className="text-[0.78rem] font-bold text-[#8a7f74] uppercase tracking-[1px] mb-2">Amenities</div>
            <div className="flex flex-wrap gap-1.5">
              {property.amenities.map(a => (
                <span key={a} className="inline-flex items-center text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#e8f5f3] text-[#2a7c6f] capitalize">{a}</span>
              ))}
            </div>
          </div>
        )}

        {property.description && (
          <div className="bg-[#faf9f7] rounded-[10px] p-3.5 mb-4">
            <div className="text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-1">Description</div>
            <p className="text-[0.85rem] text-[#3d3730] leading-[1.6]">{property.description}</p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={onClose}>Close</BtnSm>
        </div>
      </div>
    </div>
  );
};

// ── Dispute Modal ──────────────────────────────────────────────────────────
const DisputeModal = ({ booking, onClose, onSubmit, submitting }) => {
  const [desc, setDesc] = useState("");
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[480px] mx-4 p-8" style={{ animation: "fadeUp 0.3s ease both" }} onClick={e => e.stopPropagation()}>
        <h3 className="text-[1.2rem] font-bold text-[#1a2744] mb-1.5" style={{ fontFamily: "'Fraunces',serif" }}>Raise a Dispute</h3>
        <p className="text-[#8a7f74] text-[0.85rem] mb-5">
          {booking?.pgId?.pgName || "Property"}{booking?.pgId?.city ? ` · ${booking.pgId.city}` : ""}
          {booking?.tenantId?.firstName ? ` — Tenant: ${booking.tenantId.firstName} ${booking.tenantId.lastName || ""}` : ""}
        </p>
        <div className="bg-[#fdf6e8] border border-[rgba(200,146,42,0.25)] rounded-[10px] p-3.5 mb-5 flex gap-2.5 items-start text-[0.83rem] text-[#c8922a]">
          <span className="text-[1rem] flex-shrink-0">⚠️</span>
          <span>Disputes are reviewed by our admin team within 2–3 business days. Only raise a dispute if you have a genuine issue with this tenancy.</span>
        </div>
        <label className="text-[0.78rem] font-bold text-[#3d3730] block mb-2" style={{ fontFamily: "'Outfit',sans-serif" }}>Describe your issue <span className="text-[#e05a3a]">*</span></label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Explain the issue clearly…" rows={5} className="w-full bg-[#faf9f7] border-[1.5px] border-[#e2ddd6] rounded-[10px] py-3 px-3.5 font-[inherit] text-[0.9rem] text-[#1a1a1a] outline-none resize-none transition-all duration-300 focus:border-[#c8922a]" style={{ fontFamily: "'Outfit',sans-serif" }} />
        <div className="text-right text-[0.75rem] mt-1 mb-5" style={{ color: desc.length < 20 ? "#e05a3a" : "#8a7f74", fontFamily: "'Outfit',sans-serif" }}>{desc.length} chars {desc.length < 20 ? "(min 20)" : "✓"}</div>
        <div className="flex gap-2.5">
          <button className="flex-1 py-3 rounded-[10px] bg-[#f0ede8] text-[#3d3730] border-none font-semibold text-[0.93rem] cursor-pointer transition-all duration-300 hover:bg-[#e2ddd6]" style={{ fontFamily: "'Outfit',sans-serif" }} onClick={onClose}>Cancel</button>
          <button className="flex-1 py-3 rounded-[10px] bg-[#c8922a] text-white border-none font-bold text-[0.93rem] cursor-pointer transition-all duration-300 hover:bg-[#b07d20] disabled:opacity-60 disabled:cursor-not-allowed" style={{ fontFamily: "'Outfit',sans-serif" }} disabled={submitting || desc.trim().length < 20} onClick={() => onSubmit(desc)}>{submitting ? "Submitting…" : "Submit Dispute"}</button>
        </div>
      </div>
    </div>
  );
};

// ── Edit Property Modal ────────────────────────────────────────────────────
const EditPropertyModal = ({ property, onClose, onSave }) => {
  const AMENITY_OPTIONS = ["wifi", "meals", "laundry", "ac", "gym", "parking", "security"];
  const [form, setForm] = useState({
    pgName: property.pgName || "",
    city: property.city || "",
    area: property.area || "",
    address: property.address || "",
    gender: property.gender || "male",
    description: property.description || "",
    available: property.available !== false,
  });
  const [selAmenities, setSelAmenities] = useState(property.amenities || []);
  const [roomCategories, setRoomCategories] = useState(
    property.roomCategories?.length > 0
      ? property.roomCategories
      : [{ type: property.roomType || "single", totalRooms: 1, availableRooms: 1, pricePerBed: property.rent || 0 }]
  );
  const [saving, setSaving] = useState(false);

  const toggleAmenity = a => setSelAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const ROOM_TYPES = ["single", "double", "triple"];
  const usedTypes = roomCategories.map(c => c.type);

  const addRoomCategory = (type) => {
    if (usedTypes.includes(type)) return;
    setRoomCategories(prev => [...prev, { type, totalRooms: 1, availableRooms: 1, pricePerBed: 0 }]);
  };

  const removeRoomCategory = (type) => {
    setRoomCategories(prev => prev.filter(c => c.type !== type));
  };

  const updateRoomCategory = (type, field, value) => {
    setRoomCategories(prev => prev.map(c => c.type === type ? { ...c, [field]: Number(value) } : c));
  };

  const handleSave = async () => {
    if (roomCategories.length === 0) { toast.error("Add at least one room type"); return; }
    setSaving(true);
    try {
      await onSave({ ...form, amenities: selAmenities, roomCategories });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8" onClick={onClose}>
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[620px] mx-4 p-8" style={{ animation: "fadeUp 0.3s ease both" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.2rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Edit Property</h3>
          <button onClick={onClose} className="text-[#8a7f74] hover:text-[#1a2744] text-xl border-none bg-transparent cursor-pointer leading-none">×</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Property Name</label>
            <input className={inputCls} value={form.pgName} onChange={e => setForm({ ...form, pgName: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }} />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input className={inputCls} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }} />
          </div>
          <div>
            <label className={labelCls}>Area</label>
            <input className={inputCls} value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Full Address</label>
            <input className={inputCls} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }} />
          </div>
          <div>
            <label className={labelCls}>Gender</label>
            <select className={inputCls} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }}>
              <option value="male">Boys Only</option>
              <option value="female">Girls Only</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Availability</label>
            <select className={inputCls} value={form.available} onChange={e => setForm({ ...form, available: e.target.value === "true" })} style={{ fontFamily: "'Outfit',sans-serif" }}>
              <option value="true">Available Now</option>
              <option value="false">Not Available</option>
            </select>
          </div>

          {/* ── Room Categories ── */}
          <div className="md:col-span-2">
            <label className={labelCls}>Room Types & Counts</label>
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {ROOM_TYPES.filter(t => !usedTypes.includes(t)).map(t => (
                <button key={t} type="button" onClick={() => addRoomCategory(t)}
                  className="py-[5px] px-3 rounded-[20px] text-[0.76rem] font-medium cursor-pointer transition-all duration-300 border bg-[#faf9f7] border-[#e2ddd6] text-[#3d3730] hover:border-[#2a7c6f] hover:text-[#2a7c6f]"
                  style={{ fontFamily: "'Outfit',sans-serif" }}>
                  + {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {roomCategories.map(cat => (
                <div key={cat.type} className="bg-[#faf9f7] border border-[#e2ddd6] rounded-[10px] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.82rem] font-bold text-[#1a2744] capitalize">{cat.type} Occupancy</span>
                    {roomCategories.length > 1 && (
                      <button type="button" onClick={() => removeRoomCategory(cat.type)} className="text-[#e05a3a] text-[0.75rem] font-semibold border-none bg-transparent cursor-pointer hover:underline">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[0.65rem] font-bold uppercase tracking-[0.8px] text-[#8a7f74] block mb-1">Total Rooms</label>
                      <input type="number" min="0" className={inputCls} value={cat.totalRooms} onChange={e => updateRoomCategory(cat.type, "totalRooms", e.target.value)} style={{ fontFamily: "'Outfit',sans-serif", padding: "8px 12px" }} />
                    </div>
                    <div>
                      <label className="text-[0.65rem] font-bold uppercase tracking-[0.8px] text-[#8a7f74] block mb-1">Available</label>
                      <input type="number" min="0" max={cat.totalRooms} className={inputCls} value={cat.availableRooms} onChange={e => updateRoomCategory(cat.type, "availableRooms", e.target.value)} style={{ fontFamily: "'Outfit',sans-serif", padding: "8px 12px" }} />
                    </div>
                    <div>
                      <label className="text-[0.65rem] font-bold uppercase tracking-[0.8px] text-[#8a7f74] block mb-1">Price/Bed (₹)</label>
                      <input type="number" min="0" className={inputCls} value={cat.pricePerBed} onChange={e => updateRoomCategory(cat.type, "pricePerBed", e.target.value)} style={{ fontFamily: "'Outfit',sans-serif", padding: "8px 12px" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="md:col-span-2">
            <label className={labelCls}>Amenities</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {AMENITY_OPTIONS.map(a => (
                <button type="button" key={a} onClick={() => toggleAmenity(a)}
                  className={`py-[5px] px-3 rounded-[20px] text-[0.76rem] font-medium cursor-pointer transition-all duration-300 border ${selAmenities.includes(a) ? "bg-[#e8f5f3] border-[#2a7c6f] text-[#2a7c6f] font-semibold" : "bg-[#faf9f7] border-[#e2ddd6] text-[#3d3730]"}`}
                  style={{ fontFamily: "'Outfit',sans-serif" }}>
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea className={inputCls} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-[10px] bg-[#f0ede8] text-[#3d3730] border-none font-semibold text-[0.93rem] cursor-pointer hover:bg-[#e2ddd6] transition-all" style={{ fontFamily: "'Outfit',sans-serif" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-[10px] bg-[#2a7c6f] text-white border-none font-bold text-[0.93rem] cursor-pointer hover:bg-[#3a9e8e] transition-all disabled:opacity-60" style={{ fontFamily: "'Outfit',sans-serif" }}>{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
};

// ── Booking Detail Modal ───────────────────────────────────────────────────
const BookingDetailModal = ({ booking, onClose }) => {
  if (!booking) return null;
  const months = monthsDiff(booking.checkInDate, booking.checkOutDate);
  const rent = getPriceForRoomType(booking.pgId, booking.roomType);
  const amount = rent * months;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[480px] mx-4 p-8" style={{ animation: "fadeUp 0.3s ease both" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[1.1rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Booking Details</h3>
          <button onClick={onClose} className="text-[#8a7f74] hover:text-[#1a2744] text-xl border-none bg-transparent cursor-pointer leading-none">×</button>
        </div>
        <div className="flex flex-col gap-3">
          {[
            ["Property", booking.pgId?.pgName || "—"],
            ["City", booking.pgId?.city || "—"],
            ["Tenant", `${booking.tenantId?.firstName || ""} ${booking.tenantId?.lastName || ""}`.trim() || "—"],
            ["Email", booking.tenantId?.email || "—"],
            ["Room Type", booking.roomType ? booking.roomType.charAt(0).toUpperCase() + booking.roomType.slice(1) : "—"],
            ["Check-In", fmt(booking.checkInDate)],
            ["Check-Out", fmt(booking.checkOutDate)],
            ["Duration", `${months} month${months !== 1 ? "s" : ""}`],
            ["Estimated Amount", `₹${amount.toLocaleString()}`],
            ["Status", booking.bookingStatus ? booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1) : "—"],
            ["Booked On", fmt(booking.createdAt)],
          ].map(([label, val]) => (
            <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-[#f0ede8] last:border-0">
              <span className="text-[0.78rem] font-bold uppercase tracking-[0.8px] text-[#8a7f74]">{label}</span>
              <span className="text-[0.87rem] font-semibold text-[#1a2744] text-right">{val}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-6 py-3 rounded-[10px] bg-[#1a2744] text-white border-none font-bold cursor-pointer hover:bg-[#243356] transition-all" style={{ fontFamily: "'Outfit',sans-serif" }}>Close</button>
      </div>
    </div>
  );
};

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [myDisputes, setMyDisputes] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [disputeModal, setDisputeModal] = useState(null);
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);
  const [editPropModal, setEditPropModal] = useState(null);
  const [detailBooking, setDetailBooking] = useState(null);
  const [propViewModal, setPropViewModal] = useState(null);

  const [disputeFilter, setDisputeFilter] = useState("all");

  // ── Add Property Form State ──────────────────────────────────────────────
  const AMENITY_OPTIONS = ["wifi", "meals", "laundry", "ac", "gym", "parking", "security"];
  const ROOM_TYPES = ["single", "double", "triple"];

  const defaultForm = { pgName: "", city: "", area: "", address: "", gender: "male", description: "", available: true };
  const [form, setForm] = useState(defaultForm);
  const [selAmenities, setSelAmenities] = useState([]);
  const [roomCategories, setRoomCategories] = useState([{ type: "single", totalRooms: "", pricePerBed: "" }]);

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const authH = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    axios.get("/profile", { headers: authH }).then(r => setUser(r.data.data)).catch(() => { toast.error("Session expired"); navigate("/"); });
  }, []);

  const loadProperties = () => axios.get("/properties").then(r => { const all = r.data.data || []; setProperties(all.filter(p => p.landlordId?._id === userId || p.landlordId === userId)); }).catch(() => {});
  const loadBookings = () => axios.get("/bookings").then(r => setBookings(r.data || [])).catch(() => {});
  const loadPayments = () => axios.get("/payments").then(r => setPayments(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  const loadDisputes = () => userId && axios.get(`/users/${userId}/disputes`).then(r => setMyDisputes(r.data || [])).catch(() => {});
  const loadReviews = () => userId && axios.get(`/landlord/${userId}/reviews`).then(r => setMyReviews(r.data || [])).catch(() => {});

  useEffect(() => { loadProperties(); loadBookings(); loadPayments(); loadDisputes(); loadReviews(); }, [userId]);

  const myPropIds = properties.map(p => p._id);
  const myBookings = [...bookings]
    .filter(b => myPropIds.includes(b.pgId?._id || b.pgId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pendingBookings = myBookings.filter(b => b.bookingStatus === "pending");
  const openDisputesCount = myDisputes.filter(d => d.status === "open").length;

  // ── Total Revenue: sum of all successful payments for this landlord's properties ──
  const myRevenue = payments
    .filter(p => {
      const pgId = p.bookingId?.pgId?._id || p.bookingId?.pgId;
      return myPropIds.includes(pgId) || myPropIds.includes(String(pgId));
    })
    .filter(p => p.paymentStatus === "success")
    .reduce((s, p) => s + (p.landlordAmount || p.amount || 0), 0);

  const updateStatus = async (bookingId, status) => {
    try { await axios.patch(`/bookings/${bookingId}/status`, { status }); toast.success(`Booking ${status}!`); loadBookings(); loadProperties(); } catch { toast.error("Action failed"); }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try { await axios.delete(`/properties/${id}`); toast.success("Property deleted"); loadProperties(); } catch { toast.error("Delete failed"); }
  };

  const toggleAvailable = async (prop) => {
    try { await axios.put(`/properties/${prop._id}`, { available: !prop.available }); toast.success(`Property ${!prop.available ? "activated" : "paused"}`); loadProperties(); } catch { toast.error("Update failed"); }
  };

  const handleEditSave = async (updateData) => {
    try {
      await axios.put(`/properties/${editPropModal._id}`, updateData);
      toast.success("Property updated!");
      loadProperties();
    } catch { toast.error("Update failed"); throw new Error("failed"); }
  };

  const toggleAmenity = a => setSelAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  // ── Room Category helpers ──────────────────────────────────────────────
  const usedRoomTypes = roomCategories.map(c => c.type);

  const addRoomCategory = (type) => {
    if (usedRoomTypes.includes(type)) return;
    setRoomCategories(prev => [...prev, { type, totalRooms: "", pricePerBed: "" }]);
  };

  const removeRoomCategory = (type) => {
    if (roomCategories.length <= 1) { toast.error("At least one room type required"); return; }
    setRoomCategories(prev => prev.filter(c => c.type !== type));
  };

  const updateRoomCat = (type, field, value) => {
    setRoomCategories(prev => prev.map(c => c.type === type ? { ...c, [field]: value } : c));
  };

  // ── Image upload ──────────────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    if (!files.length) return;
    setSelectedImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeImagePreview = (idx) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Submit property ───────────────────────────────────────────────────
  const submitProperty = async (e) => {
    e.preventDefault();
    if (!userId) { toast.error("Login required"); return; }
    const validCats = roomCategories.filter(c => c.totalRooms && c.pricePerBed);
    if (validCats.length === 0) { toast.error("Add at least one room type with total rooms and price"); return; }

    try {
      const payload = {
        ...form,
        amenities: selAmenities,
        roomCategories: validCats.map(c => ({
          type: c.type,
          totalRooms: Number(c.totalRooms),
          pricePerBed: Number(c.pricePerBed),
        })),
      };

      const res = await axios.post(`/users/${userId}/properties`, payload);
      const newPropertyId = res.data?.data?._id;

      if (newPropertyId && selectedImages.length > 0) {
        setUploadingImages(true);
        try {
          await Promise.all(selectedImages.map(file => {
            const fd = new FormData();
            fd.append("image", file);
            fd.append("pgId", newPropertyId);
            return axios.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
          }));
          toast.success(`Property listed with ${selectedImages.length} photo${selectedImages.length > 1 ? "s" : ""}! 🎉`);
        } catch {
          toast.success("Property listed! (Some images failed to upload)");
        } finally {
          setUploadingImages(false);
        }
      } else {
        toast.success("Property listed!");
      }

      setForm(defaultForm);
      setSelAmenities([]);
      setRoomCategories([{ type: "single", totalRooms: "", pricePerBed: "" }]);
      setSelectedImages([]);
      setImagePreviews([]);
      loadProperties();
      setTab("properties");
    } catch { toast.error("Failed to list property"); }
  };

  const handleLogout = () => { localStorage.clear(); toast.success("Logged out"); navigate("/"); };

  const openDisputeModal = (booking) => setDisputeModal(booking);
  const closeDisputeModal = () => setDisputeModal(null);

  const handleDisputeSubmit = async (description) => {
    if (!disputeModal) return;
    setDisputeSubmitting(true);
    try {
      await axios.post("/disputes", { bookingId: disputeModal._id, userId, description });
      toast.success("Dispute raised successfully! Admin will review within 2–3 days.");
      setDisputeModal(null);
      loadDisputes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to raise dispute");
    } finally {
      setDisputeSubmitting(false);
    }
  };

  const getDisputeForBooking = (bookingId) =>
    myDisputes.find(d => { const bid = d.bookingId?._id || d.bookingId; return bid === bookingId; });

  const filteredDisputes = disputeFilter === "all" ? myDisputes : myDisputes.filter(d => d.status === disputeFilter);

  const sidebarLinks = [
    { id: "overview", label: "Dashboard", section: "OVERVIEW", icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /> },
    { id: "properties", label: "My Properties", section: null, icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></> },
    { id: "bookings", label: "Bookings", section: null, badge: pendingBookings.length, icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
    { id: "add", label: "Add Property", section: "MANAGE", icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></> },
    { id: "disputes", label: "Disputes", section: null, badge: openDisputesCount, icon: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></> },
    { id: "reviews", label: "Reviews", section: null, badge: 0, icon: <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></> },
    { id: "earnings", label: "Earnings", section: "FINANCE", icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></> },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2ed] text-[#1a2744] text-[1rem]" style={{ fontFamily: "'Outfit',sans-serif" }}>Loading dashboard…</div>
  );

  const thCls = "text-left text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] py-[11px] px-[18px] bg-[#faf9f7]";
  const tdCls = "py-3.5 px-[18px] text-[0.875rem] text-[#3d3730] border-t border-[#e2ddd6]";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        .ld-sl-active::before { content:''; position:absolute; left:0; top:20%; bottom:20%; width:3px; background:#2a7c6f; border-radius:0 3px 3px 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @media(max-width:900px){
          .ld-sidebar-r { width:58px !important; padding:16px 8px !important; }
          .ld-sidebar-r .ld-sl-text, .ld-sidebar-r .ld-sl-section, .ld-sidebar-r .ld-sl-badge { display:none !important; }
          .ld-main-r { margin-left:58px !important; padding:24px 16px !important; }
        }
      `}</style>

      <div className="flex min-h-screen" style={{ fontFamily: "'Outfit',sans-serif" }}>

        {/* SIDEBAR */}
        <aside className="ld-sidebar-r w-64 flex-shrink-0 bg-white border-r border-[#e2ddd6] px-3.5 py-6 fixed top-0 left-0 h-screen overflow-y-auto flex flex-col gap-0.5 z-[100]">
          <div className="text-[1.45rem] font-black text-[#1a2744] tracking-tight px-3 pb-5" style={{ fontFamily: "'Fraunces',serif" }}>
            PG<em className="text-[#2a7c6f] not-italic">Finder</em>
          </div>
          {sidebarLinks.map((link) => (
            <div key={link.id}>
              {link.section && <div className="ld-sl-section text-[0.65rem] font-bold uppercase tracking-[2px] text-[#8a7f74] px-3 pt-4 pb-2">{link.section}</div>}
              <button
                className={`flex items-center gap-[11px] py-2.5 px-3.5 rounded-[10px] w-full text-left border-none cursor-pointer transition-all duration-300 relative text-[0.875rem] font-medium ${tab === link.id ? "ld-sl-active bg-[rgba(26,39,68,0.07)] text-[#1a2744] font-semibold" : "bg-transparent text-[#3d3730] hover:bg-[#f0ede8] hover:text-[#1a2744]"}`}
                style={{ fontFamily: "'Outfit',sans-serif" }}
                onClick={() => setTab(link.id)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-[18px] h-[18px] flex-shrink-0 ${tab === link.id ? "text-[#1a2744]" : "text-[#8a7f74]"}`}>{link.icon}</svg>
                <span className="ld-sl-text">{link.label}</span>
                {link.badge > 0 && <span className="ld-sl-badge ml-auto bg-[#e05a3a] text-white text-[0.65rem] font-bold py-[2px] px-2 rounded-[20px] leading-[1.6]">{link.badge}</span>}
              </button>
            </div>
          ))}
          <div className="ld-sl-section text-[0.65rem] font-bold uppercase tracking-[2px] text-[#8a7f74] px-3 pt-4 pb-2 mt-auto">ACCOUNT</div>
          <button className="flex items-center gap-[11px] py-2.5 px-3.5 rounded-[10px] w-full text-left border-none cursor-pointer bg-transparent text-[#3d3730] hover:bg-[#f0ede8] hover:text-[#1a2744] transition-all duration-300 text-[0.875rem] font-medium" style={{ fontFamily: "'Outfit',sans-serif" }} onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] flex-shrink-0 text-[#8a7f74]"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            <span className="ld-sl-text">Log Out</span>
          </button>
        </aside>

        {/* MAIN */}
        <main className="ld-main-r flex-1 ml-64 px-11 py-9 bg-[#f5f2ed] min-h-screen">

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Good morning, {user?.firstName || "Landlord"} 👋</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Here's what's happening with your properties today.</p>
                </div>
                <button className="bg-[#1a2744] text-white border-none py-2 px-4 rounded-[9px] text-[0.88rem] font-bold cursor-pointer hover:bg-[#243356] transition-all duration-300" onClick={() => setTab("add")} style={{ fontFamily: "'Outfit',sans-serif" }}>+ Add Property</button>
              </div>

              {/* ── Stat Cards ── */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-[18px] mb-7">
                {[
                  { label: "Total Properties", val: properties.length, sub: `${properties.filter(p => p.available).length} active · ${properties.filter(p => !p.available).length} paused`, iconCls: "bg-[#e8f5f3] text-[#2a7c6f]", icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
                  { label: "Active Tenants", val: myBookings.filter(b => b.bookingStatus === "confirmed").length, sub: "Confirmed bookings", subUp: true, iconCls: "bg-[rgba(26,39,68,0.07)] text-[#1a2744]", icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
                  { label: "Pending Requests", val: pendingBookings.length, sub: "Awaiting review", iconCls: "bg-[#eef2fb] text-[#3b6bcc]", icon: <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /> },
                  // ── "Monthly Revenue" renamed to "Total Revenue" and value is dynamic from real payments ──
                  { label: "Total Revenue", val: `₹${myRevenue.toLocaleString()}`, sub: "From all payments", subUp: true, iconCls: "bg-[#fdf6e8] text-[#c8922a]", icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>, numSm: true },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 transition-all duration-300 shadow-[0_2px_16px_rgba(26,39,68,0.08)] hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)] hover:-translate-y-0.5">
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center mb-3.5 ${s.iconCls}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">{s.icon}</svg>
                    </div>
                    <div className="text-[0.73rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-2">{s.label}</div>
                    <div className={`font-black text-[#1a2744] leading-none ${s.numSm ? "text-[1.55rem]" : "text-[2rem]"}`} style={{ fontFamily: "'Fraunces',serif" }}>{s.val}</div>
                    {s.sub && <div className={`text-[0.78rem] mt-1.5 ${s.subUp ? "text-[#2a7c6f]" : "text-[#8a7f74]"}`}>{s.sub}</div>}
                  </div>
                ))}
              </div>

              {/* ── Room Availability (full width — chart removed) ── */}
              <div className="mb-6">
                <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ddd6]">
                    <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Room Availability</h3>
                  </div>
                  <div className="p-6 flex flex-col gap-3.5">
                    {properties.length > 0 ? properties.slice(0, 4).map((p, i) => {
                      const colors = ["bg-[#1a2744]", "bg-[#2a7c6f]", "bg-[#3b6bcc]", "bg-[#e05a3a]"];
                      const { total, available } = getRoomSummary(p);
                      const pct = total > 0 ? Math.round((available / total) * 100) : (p.available ? 100 : 0);
                      return (
                        <div key={p._id} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[0.82rem]">
                            <span className="font-medium text-[#3d3730]">{p.pgName}</span>
                            <span className="text-[#8a7f74] font-semibold">{typeof total === "number" ? `${available}/${total} rooms` : (p.available ? "Active" : "Paused")}</span>
                          </div>
                          <div className="bg-[#f0ede8] rounded-[4px] h-2 overflow-hidden">
                            <div className={`h-full rounded-[4px] ${colors[i % 4]}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    }) : <div className="text-[#8a7f74] text-[0.85rem] text-center py-6">No properties yet.</div>}
                  </div>
                </div>
              </div>

              {/* ── Recent Booking Requests ── */}
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ddd6]">
                  <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Recent Booking Requests</h3>
                  <button className="text-[#2a7c6f] text-[0.82rem] font-semibold bg-transparent border-none cursor-pointer hover:underline" onClick={() => setTab("bookings")}>View all →</button>
                </div>
                <table className="w-full border-collapse">
                  <thead><tr>{["Tenant", "Property", "Room", "Check-In", "Status", "Action"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                  <tbody>
                    {myBookings.slice(0, 5).map(b => (
                      <tr key={b._id} className="hover:bg-[#faf9f7]">
                        <td className={tdCls}><strong>{b.tenantId?.firstName || "—"}</strong></td>
                        <td className={tdCls}>{b.pgId?.pgName || "—"}</td>
                        <td className={`${tdCls} capitalize`}>{b.roomType}</td>
                        <td className={tdCls}>{fmt(b.checkInDate)}</td>
                        <td className={tdCls}><span className={pillCls(b.bookingStatus)}><PillDot status={b.bookingStatus} />{b.bookingStatus}</span></td>
                        <td className={tdCls}>
                          <div className="flex gap-1.5">
                            {b.bookingStatus === "pending" && <>
                              <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => updateStatus(b._id, "confirmed")}>Accept</BtnSm>
                              <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => updateStatus(b._id, "cancelled")}>Decline</BtnSm>
                            </>}
                            {b.bookingStatus !== "pending" && <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => setDetailBooking(b)}>Details</BtnSm>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {myBookings.length === 0 && <tr><td colSpan={6} className="text-center text-[#8a7f74] py-6">No bookings yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ MY PROPERTIES ══ */}
          {tab === "properties" && (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>My Properties</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Manage your listed PG accommodations.</p>
                </div>
                <button className="bg-[#1a2744] text-white border-none py-2 px-4 rounded-[9px] text-[0.88rem] font-bold cursor-pointer hover:bg-[#243356] transition-all duration-300" onClick={() => setTab("add")} style={{ fontFamily: "'Outfit',sans-serif" }}>+ Add New Property</button>
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead><tr>{["Property Name", "Location", "Room Types", "Total Rooms", "Available", "Rent From", "Status", "Actions"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                  <tbody>
                    {properties.map((p) => {
                      const { total, available } = getRoomSummary(p);
                      const roomTypeList = p.roomCategories?.length > 0
                        ? p.roomCategories.map(c => c.type.charAt(0).toUpperCase() + c.type.slice(1)).join(", ")
                        : (p.roomType ? p.roomType.charAt(0).toUpperCase() + p.roomType.slice(1) : "—");
                      return (
                        <tr key={p._id} className="hover:bg-[#faf9f7]">
                          <td className={tdCls}><strong>{p.pgName}</strong></td>
                          <td className={tdCls}>{p.area}{p.area && p.city ? ", " : ""}{p.city}</td>
                          <td className={`${tdCls} capitalize`}>{roomTypeList}</td>
                          <td className={tdCls}>{typeof total === "number" ? total : "—"}</td>
                          <td className={tdCls}>
                            <span className={typeof available === "number" && available === 0 ? "text-[#e05a3a] font-bold" : "text-[#2a7c6f] font-bold"}>
                              {typeof available === "number" ? available : "—"}
                            </span>
                          </td>
                          <td className={tdCls}>₹{p.rent?.toLocaleString()}</td>
                          <td className={tdCls}><span className={p.available ? "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[rgba(42,124,111,0.1)] text-[#2a7c6f]" : "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf0ec] text-[#e05a3a]"}><span style={{ width: 6, height: 6, borderRadius: "50%", background: p.available ? "#2a7c6f" : "#e05a3a", display: "inline-block" }} />{p.available ? "Active" : "Paused"}</span></td>
                          <td className={tdCls}>
                            <div className="flex gap-1.5 flex-wrap">
                              {p.available
                                ? <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => toggleAvailable(p)}>Pause</BtnSm>
                                : <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => toggleAvailable(p)}>Activate</BtnSm>}
                              <BtnSm cls="bg-[#eef2fb] text-[#3b6bcc] hover:bg-blue-100" onClick={() => setPropViewModal(p)}>View</BtnSm>
                              <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => setEditPropModal(p)}>Edit</BtnSm>
                              <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => deleteProperty(p._id)}>Delete</BtnSm>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {properties.length === 0 && <tr><td colSpan={8} className="text-center text-[#8a7f74] py-6">No properties listed yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ BOOKINGS ══ */}
          {tab === "bookings" && (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Bookings</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Track all tenant booking requests and confirmed stays.</p>
                </div>
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead><tr>{["Tenant", "Property", "Room", "Check-In", "Duration", "Amount", "Status", "Action"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                  <tbody>
                    {myBookings.map(b => {
                      const months = monthsDiff(b.checkInDate, b.checkOutDate);
                      const amount = getPriceForRoomType(b.pgId, b.roomType) * months;
                      const existingDispute = getDisputeForBooking(b._id);
                      const isConfirmed = b.bookingStatus === "confirmed";
                      return (
                        <tr key={b._id} className="hover:bg-[#faf9f7]">
                          <td className={tdCls}>
                            <strong>{b.tenantId?.firstName || "—"} {b.tenantId?.lastName || ""}</strong>
                            <br /><span className="text-[#8a7f74] text-[0.75rem]">{b.tenantId?.email}</span>
                          </td>
                          <td className={tdCls}>{b.pgId?.pgName || "—"}</td>
                          <td className={`${tdCls} capitalize`}>{b.roomType}</td>
                          <td className={tdCls}>{fmt(b.checkInDate)}</td>
                          <td className={tdCls}>{months} mo</td>
                          <td className={tdCls}>₹{amount.toLocaleString()}</td>
                          <td className={tdCls}><span className={pillCls(b.bookingStatus)}><PillDot status={b.bookingStatus} />{b.bookingStatus}</span></td>
                          <td className={tdCls}>
                            <div className="flex gap-1.5 flex-wrap">
                              {b.bookingStatus === "pending" && <>
                                <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => updateStatus(b._id, "confirmed")}>Accept</BtnSm>
                                <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => updateStatus(b._id, "cancelled")}>Decline</BtnSm>
                              </>}
                              <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => setDetailBooking(b)}>Details</BtnSm>
                              {isConfirmed && !existingDispute && (
                                <BtnSm cls="bg-[#fdf6e8] text-[#c8922a] hover:bg-[rgba(200,146,42,0.18)]" onClick={() => openDisputeModal(b)}>Raise Dispute</BtnSm>
                              )}
                              {isConfirmed && existingDispute && existingDispute.status === "open" && (
                                <BtnSm cls="bg-[#f0ede8] text-[#8a7f74]" disabled>Dispute Raised</BtnSm>
                              )}
                              {isConfirmed && existingDispute && existingDispute.status === "resolved" && (
                                <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f]" disabled>Resolved</BtnSm>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {myBookings.length === 0 && <tr><td colSpan={8} className="text-center text-[#8a7f74] py-6">No bookings found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ ADD PROPERTY ══ */}
          {tab === "add" && (
            <div>
              <div className="mb-8">
                <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Add New Property</h1>
                <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Fill in the details to list your PG on the platform.</p>
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <div className="p-7">
                  <form onSubmit={submitProperty}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 flex flex-col mb-4">
                        <label className={labelCls}>Property Name</label>
                        <input className={inputCls} placeholder="e.g. Sunrise PG for Girls" value={form.pgName} onChange={e => setForm({ ...form, pgName: e.target.value })} required style={{ fontFamily: "'Outfit',sans-serif" }} />
                      </div>
                      <div className="flex flex-col mb-4">
                        <label className={labelCls}>City</label>
                        <input className={inputCls} placeholder="Bengaluru" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required style={{ fontFamily: "'Outfit',sans-serif" }} />
                      </div>
                      <div className="flex flex-col mb-4">
                        <label className={labelCls}>Area / Locality</label>
                        <input className={inputCls} placeholder="Koramangala 5th Block" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }} />
                      </div>
                      <div className="md:col-span-2 flex flex-col mb-4">
                        <label className={labelCls}>Full Address</label>
                        <textarea className={inputCls} rows={2} placeholder="Building no, street, landmark…" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }} />
                      </div>

                      {/* ── Room Types ── */}
                      <div className="md:col-span-2 flex flex-col mb-4">
                        <label className={labelCls}>Room Types & Availability <span className="text-[#e05a3a]">*</span></label>
                        <p className="text-[0.75rem] text-[#8a7f74] mb-3">Select all room types your PG offers. Set total rooms and price per bed for each.</p>
                        <div className="flex gap-1.5 mb-3 flex-wrap">
                          {ROOM_TYPES.filter(t => !usedRoomTypes.includes(t)).map(t => (
                            <button key={t} type="button" onClick={() => addRoomCategory(t)}
                              className="py-[5px] px-3 rounded-[20px] text-[0.76rem] font-semibold cursor-pointer transition-all duration-300 border bg-[#faf9f7] border-[#e2ddd6] text-[#3d3730] hover:border-[#2a7c6f] hover:text-[#2a7c6f]"
                              style={{ fontFamily: "'Outfit',sans-serif" }}>
                              + {t.charAt(0).toUpperCase() + t.slice(1)} Occupancy
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-col gap-3">
                          {roomCategories.map(cat => (
                            <div key={cat.type} className="bg-[#faf9f7] border border-[#e2ddd6] rounded-[12px] p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-[8px] bg-[rgba(42,124,111,0.12)] flex items-center justify-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a7c6f" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
                                  </div>
                                  <span className="text-[0.88rem] font-bold text-[#1a2744] capitalize">{cat.type} Occupancy</span>
                                  <span className="text-[0.7rem] text-[#8a7f74]">
                                    {cat.type === "single" ? "(1 person/room)" : cat.type === "double" ? "(2 persons/room)" : "(3 persons/room)"}
                                  </span>
                                </div>
                                {roomCategories.length > 1 && (
                                  <button type="button" onClick={() => removeRoomCategory(cat.type)} className="text-[#e05a3a] text-[0.75rem] font-semibold border-none bg-transparent cursor-pointer hover:underline">Remove</button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[0.65rem] font-bold uppercase tracking-[0.8px] text-[#8a7f74] block mb-1.5">Total Rooms <span className="text-[#e05a3a]">*</span></label>
                                  <input type="number" min="1" placeholder="e.g. 10" className={inputCls} value={cat.totalRooms} onChange={e => updateRoomCat(cat.type, "totalRooms", e.target.value)} required style={{ fontFamily: "'Outfit',sans-serif", padding: "10px 14px" }} />
                                </div>
                                <div>
                                  <label className="text-[0.65rem] font-bold uppercase tracking-[0.8px] text-[#8a7f74] block mb-1.5">Price per Bed / Month (₹) <span className="text-[#e05a3a]">*</span></label>
                                  <input type="number" min="0" placeholder="e.g. 7500" className={inputCls} value={cat.pricePerBed} onChange={e => updateRoomCat(cat.type, "pricePerBed", e.target.value)} required style={{ fontFamily: "'Outfit',sans-serif", padding: "10px 14px" }} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col mb-4">
                        <label className={labelCls}>Gender Preference</label>
                        <select className={inputCls} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }}>
                          <option value="male">Boys Only</option>
                          <option value="female">Girls Only</option>
                        </select>
                      </div>
                      <div className="flex flex-col mb-4">
                        <label className={labelCls}>Availability</label>
                        <select className={inputCls} value={form.available} onChange={e => setForm({ ...form, available: e.target.value === "true" })} style={{ fontFamily: "'Outfit',sans-serif" }}>
                          <option value="true">Available Now</option>
                          <option value="false">Not Available</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 flex flex-col mb-4">
                        <label className={labelCls}>Amenities</label>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {AMENITY_OPTIONS.map(a => (
                            <button type="button" key={a} onClick={() => toggleAmenity(a)}
                              className={`py-[5px] px-3 rounded-[20px] text-[0.76rem] font-medium cursor-pointer transition-all duration-300 border ${selAmenities.includes(a) ? "bg-[#e8f5f3] border-[#2a7c6f] text-[#2a7c6f] font-semibold" : "bg-[#faf9f7] border-[#e2ddd6] text-[#3d3730]"}`}
                              style={{ fontFamily: "'Outfit',sans-serif" }}>
                              {a.charAt(0).toUpperCase() + a.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2 flex flex-col mb-4">
                        <label className={labelCls}>Description</label>
                        <textarea className={inputCls} rows={4} placeholder="Tell tenants about your property, rules, nearby areas…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }} />
                      </div>

                      {/* Property Photos */}
                      <div className="md:col-span-2 flex flex-col mb-4">
                        <label className={labelCls}>Property Photos <span className="text-[#8a7f74] normal-case font-normal tracking-normal">(up to 6 images)</span></label>
                        <label htmlFor="pg-image-upload" className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#e2ddd6] rounded-[12px] py-8 px-4 cursor-pointer bg-[#faf9f7] hover:border-[#2a7c6f] hover:bg-[#f0faf9] transition-all duration-300" style={{ fontFamily: "'Outfit',sans-serif" }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8a7f74" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" /></svg>
                          <span className="text-[0.85rem] font-semibold text-[#3d3730]">Click to upload photos</span>
                          <span className="text-[0.75rem] text-[#8a7f74]">JPG, PNG, WEBP · Max 6 images</span>
                          <input id="pg-image-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                        </label>
                        {imagePreviews.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {imagePreviews.map((src, idx) => (
                              <div key={idx} className="relative rounded-[10px] overflow-hidden aspect-video bg-[#f0ede8] group">
                                <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImagePreview(idx)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#e05a3a] text-white border-none cursor-pointer flex items-center justify-center text-[0.75rem] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">×</button>
                                {idx === 0 && <span className="absolute bottom-1.5 left-1.5 text-[0.6rem] font-bold bg-[#1a2744] text-white py-[2px] px-1.5 rounded-[4px]">Cover</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button type="submit" disabled={uploadingImages} className="w-full py-3.5 rounded-[12px] bg-[#2a7c6f] text-white border-none text-[1rem] font-bold cursor-pointer mt-2 transition-all duration-300 hover:bg-[#3a9e8e] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed" style={{ fontFamily: "'Outfit',sans-serif" }}>
                      {uploadingImages ? "Uploading photos…" : "Publish Listing →"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ══ DISPUTES ══ */}
          {tab === "disputes" && (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Disputes</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Raise and track disputes against tenants for your properties.</p>
                </div>
              </div>
              <div className="bg-[#fdf6e8] border border-[rgba(200,146,42,0.25)] rounded-[12px] py-3 px-5 mb-6 flex items-center gap-2.5 text-[0.87rem] text-[#c8922a]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                You can raise a dispute against a tenant from the <strong className="mx-1">Bookings</strong> tab for any confirmed booking. Disputes are reviewed by admin within 2–3 business days.
              </div>
              <div className="flex gap-2 mb-6 flex-wrap">
                {[{ key: "all", label: `All (${myDisputes.length})` }, { key: "open", label: `Open (${myDisputes.filter(d => d.status === "open").length})` }, { key: "resolved", label: `Resolved (${myDisputes.filter(d => d.status === "resolved").length})` }].map(f => (
                  <button key={f.key} onClick={() => setDisputeFilter(f.key)} className={`py-[7px] px-[18px] rounded-[20px] border text-[0.83rem] font-semibold cursor-pointer transition-all duration-300 ${disputeFilter === f.key ? "bg-[#1a2744] text-white border-[#1a2744]" : "bg-white text-[#3d3730] border-[#e2ddd6] hover:border-[#1a2744] hover:text-[#1a2744]"}`} style={{ fontFamily: "'Outfit',sans-serif" }}>{f.label}</button>
                ))}
              </div>
              {filteredDisputes.length === 0 ? (
                <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] py-20 flex flex-col items-center justify-center text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 text-[#e2ddd6] mb-5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  <h3 className="text-[1.2rem] font-bold text-[#1a2744] mb-2" style={{ fontFamily: "'Fraunces',serif" }}>{disputeFilter === "all" ? "No disputes raised yet" : `No ${disputeFilter} disputes`}</h3>
                  <p className="text-[#8a7f74] text-[0.88rem] mb-6 max-w-[340px]">{disputeFilter === "all" ? "If you have a genuine issue with a tenant, go to Bookings and raise a dispute on a confirmed booking." : `You don't have any ${disputeFilter} disputes right now.`}</p>
                  {disputeFilter === "all" && <button className="py-3 px-6 rounded-[11px] bg-[#1a2744] text-white border-none text-[0.9rem] font-bold cursor-pointer transition-all duration-300 hover:bg-[#243356] hover:-translate-y-px" style={{ fontFamily: "'Outfit',sans-serif" }} onClick={() => setTab("bookings")}>Go to Bookings</button>}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredDisputes.map(d => {
                    const pgName = d.bookingId?.pgId?.pgName || "Property";
                    const city = d.bookingId?.pgId?.city || "";
                    const tenantName = d.bookingId?.tenantId ? `${d.bookingId.tenantId.firstName || ""} ${d.bookingId.tenantId.lastName || ""}`.trim() : "Tenant";
                    const tenantEmail = d.bookingId?.tenantId?.email || "";
                    const isOpen = d.status === "open";
                    return (
                      <div key={d._id} className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 shadow-[0_2px_16px_rgba(26,39,68,0.08)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)]">
                        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                          <div>
                            <h4 className="text-[1rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>{pgName}{city ? ` · ${city}` : ""}</h4>
                            <p className="text-[#8a7f74] text-[0.8rem] mt-0.5">Tenant: <span className="font-semibold text-[#3d3730]">{tenantName}</span>{tenantEmail && <span className="ml-1.5 text-[#8a7f74]">({tenantEmail})</span>}</p>
                          </div>
                          <span className={pillCls(d.status)}><PillDot status={d.status} />{d.status === "open" ? "Open" : "Resolved"}</span>
                        </div>
                        <p className="text-[0.88rem] text-[#3d3730] leading-[1.6] mb-4 bg-[#faf9f7] rounded-[9px] p-3.5 border border-[#e2ddd6]">{d.description}</p>
                        <div className="flex gap-4 flex-wrap text-[0.77rem] text-[#8a7f74]">
                          <span>Raised on <strong className="text-[#3d3730]">{fmt(d.createdAt)}</strong></span>
                          <span>Dispute ID <strong className="text-[#3d3730]">#{d._id?.slice(-8).toUpperCase()}</strong></span>
                          {!isOpen && d.updatedAt && <span>Resolved on <strong className="text-[#3d3730]">{fmt(d.updatedAt)}</strong></span>}
                        </div>
                        {isOpen && <div className="mt-3.5 bg-[#fdf6e8] border border-[rgba(200,146,42,0.2)] rounded-[9px] py-2.5 px-4 text-[0.8rem] text-[#c8922a] flex items-center gap-2"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>Under review by admin — expected resolution within 2–3 business days.</div>}
                        {!isOpen && <div className="mt-3.5 bg-[rgba(42,124,111,0.07)] border border-[rgba(42,124,111,0.2)] rounded-[9px] py-2.5 px-4 text-[0.8rem] text-[#2a7c6f] flex items-center gap-2"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12" /></svg>This dispute has been resolved by admin.</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ REVIEWS ══ */}
          {tab === "reviews" && (() => {
            const avgRating = myReviews.length ? (myReviews.reduce((s, r) => s + (r.rating || 0), 0) / myReviews.length).toFixed(1) : "—";
            const ratingCounts = [5, 4, 3, 2, 1].map(star => ({ star, count: myReviews.filter(r => r.rating === star).length }));
            return (
              <div>
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                  <div>
                    <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Reviews</h1>
                    <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Tenant reviews across all your properties.</p>
                  </div>
                </div>
                {myReviews.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
                    <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 shadow-[0_2px_16px_rgba(26,39,68,0.08)] flex items-center gap-6">
                      <div className="text-center flex-shrink-0">
                        <div className="text-[3.5rem] font-black text-[#1a2744] leading-none" style={{ fontFamily: "'Fraunces',serif" }}>{avgRating}</div>
                        <div className="text-[#c8922a] text-[1.1rem] mt-1">{"★".repeat(Math.round(Number(avgRating)))}{"☆".repeat(5 - Math.round(Number(avgRating)))}</div>
                        <div className="text-[#8a7f74] text-[0.75rem] mt-1">{myReviews.length} review{myReviews.length !== 1 ? "s" : ""}</div>
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        {ratingCounts.map(({ star, count }) => (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-[0.75rem] font-semibold text-[#8a7f74] w-3">{star}</span>
                            <span className="text-[#c8922a] text-[0.7rem]">★</span>
                            <div className="flex-1 bg-[#f0ede8] rounded-full h-2 overflow-hidden">
                              <div className="h-full rounded-full bg-[#c8922a] transition-all duration-500" style={{ width: myReviews.length ? `${(count / myReviews.length) * 100}%` : "0%" }} />
                            </div>
                            <span className="text-[0.75rem] text-[#8a7f74] w-4 text-right">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 shadow-[0_2px_16px_rgba(26,39,68,0.08)]">
                      <div className="text-[0.73rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-4">Reviews per Property</div>
                      <div className="flex flex-col gap-3">
                        {properties.map(p => {
                          const pReviews = myReviews.filter(r => { const rid = r.pgId?._id || r.pgId; return rid?.toString() === p._id?.toString(); });
                          const pAvg = pReviews.length ? (pReviews.reduce((s, r) => s + (r.rating || 0), 0) / pReviews.length).toFixed(1) : null;
                          return (
                            <div key={p._id} className="flex items-center justify-between">
                              <div><div className="text-[0.88rem] font-semibold text-[#1a2744]">{p.pgName}</div><div className="text-[0.75rem] text-[#8a7f74]">{p.city}</div></div>
                              <div className="text-right">{pAvg ? <div className="text-[0.85rem] font-bold text-[#c8922a]">★ {pAvg}</div> : <div className="text-[0.8rem] text-[#8a7f74]">No reviews</div>}<div className="text-[0.73rem] text-[#8a7f74]">{pReviews.length} review{pReviews.length !== 1 ? "s" : ""}</div></div>
                            </div>
                          );
                        })}
                        {properties.length === 0 && <div className="text-[#8a7f74] text-[0.85rem]">No properties yet.</div>}
                      </div>
                    </div>
                  </div>
                )}
                {myReviews.length === 0 ? (
                  <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] py-20 flex flex-col items-center justify-center text-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 text-[#e2ddd6] mb-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    <h3 className="text-[1.2rem] font-bold text-[#1a2744] mb-2" style={{ fontFamily: "'Fraunces',serif" }}>No reviews yet</h3>
                    <p className="text-[#8a7f74] text-[0.88rem] max-w-[340px]">Tenant reviews for your properties will appear here once bookings are confirmed and tenants leave feedback.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {myReviews.map((r, i) => {
                      const reviewer = r.userId || {};
                      const firstName = reviewer?.firstName || "Tenant";
                      const lastName = reviewer?.lastName || "";
                      const initial = firstName[0]?.toUpperCase() || "T";
                      const pgName = r.pgId?.pgName || "Property";
                      const pgCity = r.pgId?.city || "";
                      const avatarColors = ["#1a2744", "#2a7c6f", "#3b6bcc", "#c8922a", "#e05a3a"];
                      return (
                        <div key={r._id || i} className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 shadow-[0_2px_16px_rgba(26,39,68,0.08)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)]">
                          <div className="flex items-start gap-4 flex-wrap">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[0.95rem] flex-shrink-0" style={{ background: avatarColors[i % avatarColors.length] }}>{initial}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                                <div><div className="font-bold text-[0.95rem] text-[#1a2744]">{firstName} {lastName}</div>{reviewer?.email && <div className="text-[0.75rem] text-[#8a7f74]">{reviewer.email}</div>}</div>
                                <div className="text-right flex-shrink-0"><div className="text-[#c8922a] text-[0.9rem]">{"★".repeat(r.rating || 5)}<span className="text-[#e2ddd6]">{"★".repeat(5 - (r.rating || 5))}</span></div><div className="text-[0.73rem] text-[#8a7f74] mt-0.5">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div></div>
                              </div>
                              <div className="inline-flex items-center gap-1.5 bg-[#f0ede8] border border-[#e2ddd6] text-[#3d3730] text-[0.72rem] font-semibold py-[3px] px-2.5 rounded-full mb-3"><svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" /></svg>{pgName}{pgCity ? ` · ${pgCity}` : ""}</div>
                              {r.reviewText && <p className="text-[0.875rem] text-[#3d3730] leading-[1.65] bg-[#faf9f7] rounded-[9px] p-3.5 border border-[#e2ddd6]">"{r.reviewText}"</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ══ EARNINGS ══ */}
          {tab === "earnings" && <EarningsTab payments={payments} myBookings={myBookings} myPropIds={myPropIds} />}

        </main>
      </div>

      {/* ══ MODALS ══ */}
      {disputeModal && <DisputeModal booking={disputeModal} onClose={closeDisputeModal} onSubmit={handleDisputeSubmit} submitting={disputeSubmitting} />}
      {editPropModal && <EditPropertyModal property={editPropModal} onClose={() => setEditPropModal(null)} onSave={handleEditSave} />}
      {detailBooking && <BookingDetailModal booking={detailBooking} onClose={() => setDetailBooking(null)} />}
      {propViewModal && <PropViewModal property={propViewModal} onClose={() => setPropViewModal(null)} />}
    </>
  );
}