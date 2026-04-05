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

// ── Dispute Modal ──────────────────────────────────────────────────────────
const DisputeModal = ({ booking, onClose, onSubmit, submitting }) => {
  const [desc, setDesc] = useState("");

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] shadow-2xl w-full max-w-[480px] mx-4 p-8"
        style={{ animation: "fadeUp 0.3s ease both" }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-[1.2rem] font-bold text-[#1a2744] mb-1.5" style={{ fontFamily: "'Fraunces',serif" }}>
          Raise a Dispute
        </h3>
        <p className="text-[#8a7f74] text-[0.85rem] mb-5">
          {booking?.pgId?.pgName || "Property"}{booking?.pgId?.city ? ` · ${booking.pgId.city}` : ""}
          {booking?.tenantId?.firstName ? ` — Tenant: ${booking.tenantId.firstName} ${booking.tenantId.lastName || ""}` : ""}
        </p>

        {/* Warning banner */}
        <div className="bg-[#fdf6e8] border border-[rgba(200,146,42,0.25)] rounded-[10px] p-3.5 mb-5 flex gap-2.5 items-start text-[0.83rem] text-[#c8922a]">
          <span className="text-[1rem] flex-shrink-0">⚠️</span>
          <span>Disputes are reviewed by our admin team within 2–3 business days. Only raise a dispute if you have a genuine issue with this tenancy.</span>
        </div>

        <label className="text-[0.78rem] font-bold text-[#3d3730] block mb-2" style={{ fontFamily: "'Outfit',sans-serif" }}>
          Describe your issue <span className="text-[#e05a3a]">*</span>
        </label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Explain the issue clearly — e.g. 'Tenant has not paid rent for 2 months despite multiple reminders. Property damage reported during inspection...'"
          rows={5}
          className="w-full bg-[#faf9f7] border-[1.5px] border-[#e2ddd6] rounded-[10px] py-3 px-3.5 font-[inherit] text-[0.9rem] text-[#1a1a1a] outline-none resize-none transition-all duration-300 focus:border-[#c8922a]"
          style={{ fontFamily: "'Outfit',sans-serif" }}
        />
        <div className="text-right text-[0.75rem] mt-1 mb-5" style={{ color: desc.length < 20 ? "#e05a3a" : "#8a7f74", fontFamily: "'Outfit',sans-serif" }}>
          {desc.length} chars {desc.length < 20 ? "(min 20)" : "✓"}
        </div>

        <div className="flex gap-2.5">
          <button
            className="flex-1 py-3 rounded-[10px] bg-[#f0ede8] text-[#3d3730] border-none font-semibold text-[0.93rem] cursor-pointer transition-all duration-300 hover:bg-[#e2ddd6]"
            style={{ fontFamily: "'Outfit',sans-serif" }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 rounded-[10px] bg-[#c8922a] text-white border-none font-bold text-[0.93rem] cursor-pointer transition-all duration-300 hover:bg-[#b07d20] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Outfit',sans-serif" }}
            disabled={submitting || desc.trim().length < 20}
            onClick={() => onSubmit(desc)}
          >
            {submitting ? "Submitting…" : "Submit Dispute"}
          </button>
        </div>
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
  const [loading, setLoading] = useState(true);

  // Dispute modal state
  const [disputeModal, setDisputeModal] = useState(null); // booking object
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);
  // Dispute filter
  const [disputeFilter, setDisputeFilter] = useState("all");

  const [form, setForm] = useState({ pgName: "", city: "", area: "", address: "", rent: "", roomType: "single", gender: "unisex", description: "", available: true });
  const [selAmenities, setSelAmenities] = useState([]);
  // ── Image upload state ────────────────────────────────────────────────────
  const [selectedImages, setSelectedImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]);   // blob URLs for preview
  const [uploadingImages, setUploadingImages] = useState(false);
  const AMENITY_OPTIONS = ["wifi", "meals", "laundry", "ac", "gym", "parking", "security"];

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

  useEffect(() => { loadProperties(); loadBookings(); loadPayments(); loadDisputes(); }, [userId]);

  const myPropIds = properties.map(p => p._id);
  // LIFO: newest booking first — affects both overview table and full bookings tab
  const myBookings = [...bookings]
    .filter(b => myPropIds.includes(b.pgId?._id || b.pgId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pendingBookings = myBookings.filter(b => b.bookingStatus === "pending");
  const myRevenue = payments.filter(p => myPropIds.includes(p.bookingId?.pgId)).reduce((s, p) => s + (p.landlordAmount || p.amount || 0), 0);

  // Open disputes count for badge
  const openDisputesCount = myDisputes.filter(d => d.status === "open").length;

  const updateStatus = async (bookingId, status) => {
    try { await axios.patch(`/bookings/${bookingId}/status`, { status }); toast.success(`Booking ${status}!`); loadBookings(); } catch { toast.error("Action failed"); }
  };
  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try { await axios.delete(`/properties/${id}`); toast.success("Property deleted"); loadProperties(); } catch { toast.error("Delete failed"); }
  };
  const toggleAvailable = async (prop) => {
    try { await axios.put(`/properties/${prop._id}`, { available: !prop.available }); toast.success(`Property ${!prop.available ? "activated" : "paused"}`); loadProperties(); } catch { toast.error("Update failed"); }
  };
  const toggleAmenity = a => setSelAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  // Handle image file selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    // Max 6 images
    const allowed = files.slice(0, 6);
    setSelectedImages(allowed);
    setImagePreviews(allowed.map(f => URL.createObjectURL(f)));
  };

  const removeImagePreview = (idx) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const submitProperty = async (e) => {
    e.preventDefault();
    if (!userId) { toast.error("Login required"); return; }
    try {
      // Step 1: Create the property
      const res = await axios.post(`/users/${userId}/properties`, { ...form, amenities: selAmenities, rent: Number(form.rent) });
      const newPropertyId = res.data?.data?._id;

      // Step 2: Upload images if any were selected
      if (newPropertyId && selectedImages.length > 0) {
        setUploadingImages(true);
        try {
          await Promise.all(
            selectedImages.map(file => {
              const fd = new FormData();
              fd.append("image", file);
              fd.append("pgId", newPropertyId);
              return axios.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
            })
          );
          toast.success(`Property listed with ${selectedImages.length} photo${selectedImages.length > 1 ? "s" : ""}! 🎉`);
        } catch {
          toast.success("Property listed! (Some images failed to upload)");
        } finally {
          setUploadingImages(false);
        }
      } else {
        toast.success("Property listed!");
      }

      // Reset form
      setForm({ pgName: "", city: "", area: "", address: "", rent: "", roomType: "single", gender: "unisex", description: "", available: true });
      setSelAmenities([]);
      setSelectedImages([]);
      setImagePreviews([]);
      loadProperties();
      setTab("properties");
    } catch { toast.error("Failed to list property"); }
  };
  const handleLogout = () => { localStorage.clear(); toast.success("Logged out"); navigate("/"); };

  // ── Dispute handlers ──────────────────────────────────────────────────────
  const openDisputeModal = (booking) => setDisputeModal(booking);
  const closeDisputeModal = () => { setDisputeModal(null); };

  const handleDisputeSubmit = async (description) => {
    if (!disputeModal) return;
    setDisputeSubmitting(true);
    try {
      await axios.post("/disputes", {
        bookingId: disputeModal._id,
        userId,           // landlord's own userId — same field the backend uses
        description,
      });
      toast.success("Dispute raised successfully! Admin will review within 2–3 days.");
      setDisputeModal(null);
      loadDisputes();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to raise dispute";
      toast.error(msg);
    } finally {
      setDisputeSubmitting(false);
    }
  };

  // Check if landlord already has open dispute for a booking
  const getDisputeForBooking = (bookingId) =>
    myDisputes.find(d => {
      const bid = d.bookingId?._id || d.bookingId;
      return bid === bookingId;
    });

  // Filtered disputes for the disputes tab
  const filteredDisputes = disputeFilter === "all"
    ? myDisputes
    : myDisputes.filter(d => d.status === disputeFilter);

  // ─────────────────────────────────────────────────────────────────────────
  const sidebarLinks = [
    { id: "overview", label: "Dashboard", section: "OVERVIEW", icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /> },
    { id: "properties", label: "My Properties", section: null, icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></> },
    { id: "bookings", label: "Bookings", section: null, badge: pendingBookings.length, icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
    { id: "add", label: "Add Property", section: "MANAGE", icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></> },
    { id: "disputes", label: "Disputes", section: null, badge: openDisputesCount, icon: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></> },
    { id: "messages", label: "Messages", section: null, badge: 5, icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /> },
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
        .chart-bar { flex:1; background:rgba(42,124,111,0.18); border-radius:5px 5px 0 0; transition:all 0.25s ease; }
        .chart-bar:hover { background:rgba(42,124,111,0.45); }
        .chart-bar.highlight { background:rgba(26,39,68,0.5); }
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
              {link.section && (
                <div className="ld-sl-section text-[0.65rem] font-bold uppercase tracking-[2px] text-[#8a7f74] px-3 pt-4 pb-2">
                  {link.section}
                </div>
              )}
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

              {/* Stat cards */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-[18px] mb-7">
                {[
                  { label: "Total Properties", val: properties.length, sub: `${properties.filter(p => p.available).length} active · ${properties.filter(p => !p.available).length} pending`, iconCls: "bg-[#e8f5f3] text-[#2a7c6f]", icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
                  { label: "Active Tenants", val: myBookings.filter(b => b.bookingStatus === "confirmed").length, sub: "↑ 2 this month", subUp: true, iconCls: "bg-[rgba(26,39,68,0.07)] text-[#1a2744]", icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
                  { label: "Pending Requests", val: pendingBookings.length, sub: "Awaiting review", iconCls: "bg-[#eef2fb] text-[#3b6bcc]", icon: <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /> },
                  { label: "Monthly Revenue", val: `₹${myRevenue.toLocaleString()}`, sub: "↑ 12% vs last month", subUp: true, iconCls: "bg-[#fdf6e8] text-[#c8922a]", icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>, numSm: true },
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

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ddd6]">
                    <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Monthly Earnings</h3>
                    <span className="text-[#8a7f74] text-[0.8rem]">Last 8 months</span>
                  </div>
                  <div className="p-6">
                    <div className="bg-[#faf9f7] rounded-[10px] h-[190px] flex items-end gap-2 px-4 pt-4 overflow-hidden">
                      {[55, 70, 60, 80, 65, 90, 75, 100].map((h, i) => (
                        <div key={i} className={`chart-bar${i === 7 ? " highlight" : ""}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ddd6]">
                    <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Occupancy Rate</h3>
                  </div>
                  <div className="p-6 flex flex-col gap-3.5">
                    {properties.length > 0 ? properties.slice(0, 4).map((p, i) => {
                      const colors = ["bg-[#1a2744]", "bg-[#2a7c6f]", "bg-[#3b6bcc]", "bg-[#e05a3a]"];
                      const pct = p.available ? [92, 78, 60, 45][i % 4] : 20;
                      return (
                        <div key={p._id} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[0.82rem]">
                            <span className="font-medium text-[#3d3730]">{p.pgName}</span>
                            <span className="text-[#8a7f74] font-semibold">{pct}%</span>
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

              {/* Recent bookings quick table */}
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ddd6]">
                  <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Recent Booking Requests</h3>
                  <button className="text-[#2a7c6f] text-[0.82rem] font-semibold bg-transparent border-none cursor-pointer hover:underline" onClick={() => setTab("bookings")}>View all →</button>
                </div>
                <table className="w-full border-collapse">
                  <thead><tr>
                    {["Tenant", "Property", "Room", "Check-In", "Status", "Action"].map(h => <th key={h} className={thCls}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {myBookings.slice(0, 5).map(b => (
                      <tr key={b._id} className="hover:bg-[#faf9f7]">
                        <td className={tdCls}><strong>{b.tenantId?.firstName || "—"}</strong></td>
                        <td className={tdCls}>{b.pgId?.pgName || "—"}</td>
                        <td className={`${tdCls} capitalize`}>{b.roomType}</td>
                        <td className={tdCls}>{fmt(b.checkInDate)}</td>
                        <td className={tdCls}>
                          <span className={pillCls(b.bookingStatus)}><PillDot status={b.bookingStatus} />{b.bookingStatus}</span>
                        </td>
                        <td className={tdCls}>
                          <div className="flex gap-1.5">
                            {b.bookingStatus === "pending" && <>
                              <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => updateStatus(b._id, "confirmed")}>Accept</BtnSm>
                              <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => updateStatus(b._id, "cancelled")}>Decline</BtnSm>
                            </>}
                            {b.bookingStatus !== "pending" && <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]">Details</BtnSm>}
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
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <table className="w-full border-collapse">
                  <thead><tr>
                    {["Property Name", "Location", "Rooms", "Occupancy", "Rent", "Status", "Actions"].map(h => <th key={h} className={thCls}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {properties.map((p, i) => (
                      <tr key={p._id} className="hover:bg-[#faf9f7]">
                        <td className={tdCls}><strong>{p.pgName}</strong></td>
                        <td className={tdCls}>{p.area}{p.area && p.city ? ", " : ""}{p.city}</td>
                        <td className={tdCls}>{[12, 8, 6, 10][i % 4]}</td>
                        <td className={tdCls}>{[11, 5, 3, 4][i % 4]}/{[12, 8, 6, 10][i % 4]}</td>
                        <td className={tdCls}>₹{p.rent?.toLocaleString()}</td>
                        <td className={tdCls}><span className={p.available ? "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[rgba(42,124,111,0.1)] text-[#2a7c6f]" : "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf0ec] text-[#e05a3a]"}><span style={{ width: 6, height: 6, borderRadius: "50%", background: p.available ? "#2a7c6f" : "#e05a3a", display: "inline-block" }} />{p.available ? "Active" : "Paused"}</span></td>
                        <td className={tdCls}>
                          <div className="flex gap-1.5">
                            {p.available
                              ? <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => toggleAvailable(p)}>Pause</BtnSm>
                              : <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => toggleAvailable(p)}>Activate</BtnSm>
                            }
                            <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]">Edit</BtnSm>
                            <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => deleteProperty(p._id)}>Delete</BtnSm>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && <tr><td colSpan={7} className="text-center text-[#8a7f74] py-6">No properties listed yet.</td></tr>}
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
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <table className="w-full border-collapse">
                  <thead><tr>
                    {["Tenant", "Property", "Check-In", "Duration", "Amount", "Status", "Action"].map(h => <th key={h} className={thCls}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {myBookings.map(b => {
                      const months = monthsDiff(b.checkInDate, b.checkOutDate);
                      const amount = (b.pgId?.rent || 0) * months;
                      const existingDispute = getDisputeForBooking(b._id);
                      const isConfirmed = b.bookingStatus === "confirmed";
                      return (
                        <tr key={b._id} className="hover:bg-[#faf9f7]">
                          <td className={tdCls}>
                            <strong>{b.tenantId?.firstName || "—"} {b.tenantId?.lastName || ""}</strong>
                            <br /><span className="text-[#8a7f74] text-[0.75rem]">{b.tenantId?.email}</span>
                          </td>
                          <td className={tdCls}>{b.pgId?.pgName || "—"}</td>
                          <td className={tdCls}>{fmt(b.checkInDate)}</td>
                          <td className={tdCls}>{months} month{months !== 1 ? "s" : ""}</td>
                          <td className={tdCls}>₹{amount.toLocaleString()}</td>
                          <td className={tdCls}><span className={pillCls(b.bookingStatus)}><PillDot status={b.bookingStatus} />{b.bookingStatus}</span></td>
                          <td className={tdCls}>
                            <div className="flex gap-1.5 flex-wrap">
                              {b.bookingStatus === "pending" && <>
                                <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => updateStatus(b._id, "confirmed")}>Accept</BtnSm>
                                <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => updateStatus(b._id, "cancelled")}>Decline</BtnSm>
                              </>}
                              {b.bookingStatus !== "pending" && <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]">Details</BtnSm>}

                              {/* ── Raise Dispute — only for confirmed bookings ── */}
                              {isConfirmed && !existingDispute && (
                                <BtnSm
                                  cls="bg-[#fdf6e8] text-[#c8922a] hover:bg-[rgba(200,146,42,0.18)]"
                                  onClick={() => openDisputeModal(b)}
                                >
                                  Raise Dispute
                                </BtnSm>
                              )}
                              {isConfirmed && existingDispute && existingDispute.status === "open" && (
                                <BtnSm cls="bg-[#f0ede8] text-[#8a7f74]" disabled>
                                  Dispute Raised
                                </BtnSm>
                              )}
                              {isConfirmed && existingDispute && existingDispute.status === "resolved" && (
                                <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f]" disabled>
                                  Resolved
                                </BtnSm>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {myBookings.length === 0 && <tr><td colSpan={7} className="text-center text-[#8a7f74] py-6">No bookings found.</td></tr>}
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
                      <div className="flex flex-col mb-4">
                        <label className={labelCls}>Monthly Rent (₹)</label>
                        <input className={inputCls} type="number" placeholder="7500" value={form.rent} onChange={e => setForm({ ...form, rent: e.target.value })} required style={{ fontFamily: "'Outfit',sans-serif" }} />
                      </div>
                      <div className="flex flex-col mb-4">
                        <label className={labelCls}>Room Type</label>
                        <select className={inputCls} value={form.roomType} onChange={e => setForm({ ...form, roomType: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }}>
                          <option value="single">Single</option>
                          <option value="double">Double</option>
                          <option value="triple">Triple</option>
                        </select>
                      </div>
                      <div className="flex flex-col mb-4">
                        <label className={labelCls}>Gender Preference</label>
                        <select className={inputCls} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }}>
                          <option value="male">Boys Only</option>
                          <option value="female">Girls Only</option>
                          <option value="unisex">Co-ed / Unisex</option>
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
                              style={{ fontFamily: "'Outfit',sans-serif" }}
                            >
                              {a.charAt(0).toUpperCase() + a.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2 flex flex-col mb-4">
                        <label className={labelCls}>Description</label>
                        <textarea className={inputCls} rows={4} placeholder="Tell tenants about your property, rules, nearby areas…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ fontFamily: "'Outfit',sans-serif" }} />
                      </div>

                      {/* ── Property Photos Upload ── */}
                      <div className="md:col-span-2 flex flex-col mb-4">
                        <label className={labelCls}>Property Photos <span className="text-[#8a7f74] normal-case font-normal tracking-normal">(up to 6 images)</span></label>

                        {/* Drop zone */}
                        <label
                          htmlFor="pg-image-upload"
                          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#e2ddd6] rounded-[12px] py-8 px-4 cursor-pointer bg-[#faf9f7] hover:border-[#2a7c6f] hover:bg-[#f0faf9] transition-all duration-300"
                          style={{ fontFamily: "'Outfit',sans-serif" }}
                        >
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8a7f74" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21,15 16,10 5,21" />
                          </svg>
                          <span className="text-[0.85rem] font-semibold text-[#3d3730]">Click to upload photos</span>
                          <span className="text-[0.75rem] text-[#8a7f74]">JPG, PNG, WEBP · Max 6 images</span>
                          <input
                            id="pg-image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageSelect}
                          />
                        </label>

                        {/* Previews grid */}
                        {imagePreviews.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {imagePreviews.map((src, idx) => (
                              <div key={idx} className="relative rounded-[10px] overflow-hidden aspect-video bg-[#f0ede8] group">
                                <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeImagePreview(idx)}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#e05a3a] text-white border-none cursor-pointer flex items-center justify-center text-[0.75rem] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >×</button>
                                {idx === 0 && (
                                  <span className="absolute bottom-1.5 left-1.5 text-[0.6rem] font-bold bg-[#1a2744] text-white py-[2px] px-1.5 rounded-[4px]">Cover</span>
                                )}
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
              {/* Header */}
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Disputes</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Raise and track disputes against tenants for your properties.</p>
                </div>
              </div>

              {/* Info banner */}
              <div className="bg-[#fdf6e8] border border-[rgba(200,146,42,0.25)] rounded-[12px] py-3 px-5 mb-6 flex items-center gap-2.5 text-[0.87rem] text-[#c8922a]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                You can raise a dispute against a tenant from the <strong className="mx-1">Bookings</strong> tab for any confirmed booking. Disputes are reviewed by admin within 2–3 business days.
              </div>

              {/* Filter tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {[
                  { key: "all", label: `All (${myDisputes.length})` },
                  { key: "open", label: `Open (${myDisputes.filter(d => d.status === "open").length})` },
                  { key: "resolved", label: `Resolved (${myDisputes.filter(d => d.status === "resolved").length})` },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setDisputeFilter(f.key)}
                    className={`py-[7px] px-[18px] rounded-[20px] border text-[0.83rem] font-semibold cursor-pointer transition-all duration-300 ${disputeFilter === f.key ? "bg-[#1a2744] text-white border-[#1a2744]" : "bg-white text-[#3d3730] border-[#e2ddd6] hover:border-[#1a2744] hover:text-[#1a2744]"}`}
                    style={{ fontFamily: "'Outfit',sans-serif" }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Disputes list */}
              {filteredDisputes.length === 0 ? (
                <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] py-20 flex flex-col items-center justify-center text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 text-[#e2ddd6] mb-5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <h3 className="text-[1.2rem] font-bold text-[#1a2744] mb-2" style={{ fontFamily: "'Fraunces',serif" }}>
                    {disputeFilter === "all" ? "No disputes raised yet" : `No ${disputeFilter} disputes`}
                  </h3>
                  <p className="text-[#8a7f74] text-[0.88rem] mb-6 max-w-[340px]">
                    {disputeFilter === "all"
                      ? "If you have a genuine issue with a tenant, go to Bookings and raise a dispute on a confirmed booking."
                      : `You don't have any ${disputeFilter} disputes right now.`}
                  </p>
                  {disputeFilter === "all" && (
                    <button
                      className="py-3 px-6 rounded-[11px] bg-[#1a2744] text-white border-none text-[0.9rem] font-bold cursor-pointer transition-all duration-300 hover:bg-[#243356] hover:-translate-y-px"
                      style={{ fontFamily: "'Outfit',sans-serif" }}
                      onClick={() => setTab("bookings")}
                    >
                      Go to Bookings
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredDisputes.map(d => {
                    const pgName = d.bookingId?.pgId?.pgName || "Property";
                    const city = d.bookingId?.pgId?.city || "";
                    const tenantName = d.bookingId?.tenantId
                      ? `${d.bookingId.tenantId.firstName || ""} ${d.bookingId.tenantId.lastName || ""}`.trim()
                      : "Tenant";
                    const tenantEmail = d.bookingId?.tenantId?.email || "";
                    const isOpen = d.status === "open";

                    return (
                      <div
                        key={d._id}
                        className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 shadow-[0_2px_16px_rgba(26,39,68,0.08)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)]"
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                          <div>
                            <h4 className="text-[1rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>
                              {pgName}{city ? ` · ${city}` : ""}
                            </h4>
                            <p className="text-[#8a7f74] text-[0.8rem] mt-0.5">
                              Tenant: <span className="font-semibold text-[#3d3730]">{tenantName}</span>
                              {tenantEmail && <span className="ml-1.5 text-[#8a7f74]">({tenantEmail})</span>}
                            </p>
                          </div>
                          <span className={pillCls(d.status)}>
                            <PillDot status={d.status} />
                            {d.status === "open" ? "Open" : "Resolved"}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[0.88rem] text-[#3d3730] leading-[1.6] mb-4 bg-[#faf9f7] rounded-[9px] p-3.5 border border-[#e2ddd6]">
                          {d.description}
                        </p>

                        {/* Meta */}
                        <div className="flex gap-4 flex-wrap text-[0.77rem] text-[#8a7f74]">
                          <span>Raised on <strong className="text-[#3d3730]">{fmt(d.createdAt)}</strong></span>
                          <span>Dispute ID <strong className="text-[#3d3730]">#{d._id?.slice(-8).toUpperCase()}</strong></span>
                          {!isOpen && d.updatedAt && (
                            <span>Resolved on <strong className="text-[#3d3730]">{fmt(d.updatedAt)}</strong></span>
                          )}
                        </div>

                        {/* Status note */}
                        {isOpen && (
                          <div className="mt-3.5 bg-[#fdf6e8] border border-[rgba(200,146,42,0.2)] rounded-[9px] py-2.5 px-4 text-[0.8rem] text-[#c8922a] flex items-center gap-2">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                            Under review by admin — expected resolution within 2–3 business days.
                          </div>
                        )}
                        {!isOpen && (
                          <div className="mt-3.5 bg-[rgba(42,124,111,0.07)] border border-[rgba(42,124,111,0.2)] rounded-[9px] py-2.5 px-4 text-[0.8rem] text-[#2a7c6f] flex items-center gap-2">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12" /></svg>
                            This dispute has been resolved by admin.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ MESSAGES ══ */}
          {tab === "messages" && (
            <div>
              <div className="mb-8">
                <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Messages</h1>
                <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Communicate with your tenants.</p>
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden">
                <div className="px-6 py-14 text-center text-[#8a7f74]">Coming soon — messaging feature is under development.</div>
              </div>
            </div>
          )}

          {/* ══ EARNINGS ══ */}
          {tab === "earnings" && <EarningsTab payments={payments} myBookings={myBookings} myPropIds={myPropIds} />}

        </main>
      </div>

      {/* ══ DISPUTE MODAL ══ */}
      {disputeModal && (
        <DisputeModal
          booking={disputeModal}
          onClose={closeDisputeModal}
          onSubmit={handleDisputeSubmit}
          submitting={disputeSubmitting}
        />
      )}
    </>
  );
}