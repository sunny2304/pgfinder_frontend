import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import EarningsTab from "./Landlordearningstab";

// ─── shared design-token CSS ───────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Outfit',sans-serif;}
:root{
  --bg:#f5f2ed;--white:#fff;--surface:#faf9f7;--surface2:#f0ede8;--border:#e2ddd6;
  --navy:#1a2744;--navy2:#243356;--teal:#2a7c6f;--teal-light:#3a9e8e;--teal-pale:#e8f5f3;
  --coral:#e05a3a;--coral-pale:#fdf0ec;--gold:#c8922a;--gold-pale:#fdf6e8;
  --blue:#3b6bcc;--blue-pale:#eef2fb;--text:#1a1a1a;--text2:#3d3730;--muted:#8a7f74;
  --radius:14px;--shadow:0 2px 16px rgba(26,39,68,.08);--shadow-lg:0 8px 40px rgba(26,39,68,.13);
  --tr:0.25s cubic-bezier(.4,0,.2,1);
}
/* layout */
.dash-layout{display:flex;min-height:100vh;}
.ld-sidebar{width:256px;flex-shrink:0;background:var(--white);border-right:1px solid var(--border);padding:24px 14px;position:fixed;top:0;left:0;height:100vh;overflow-y:auto;display:flex;flex-direction:column;gap:2px;z-index:100;}
.dash-main{flex:1;margin-left:256px;padding:36px 44px;background:var(--bg);min-height:100vh;}
/* sidebar items */
.sl-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--muted);padding:16px 12px 8px;}
.sl-label:first-child{padding-top:4px;}
.sl{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:10px;color:var(--text2);font-size:.875rem;font-weight:500;cursor:pointer;border:none;background:none;width:100%;text-align:left;position:relative;transition:var(--tr);font-family:'Outfit',sans-serif;}
.sl:hover{background:var(--surface2);color:var(--navy);}
.sl.active{background:rgba(26,39,68,.07);color:var(--navy);font-weight:600;}
.sl.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:3px;background:var(--teal);border-radius:0 3px 3px 0;}
.sl svg{width:18px;height:18px;flex-shrink:0;color:var(--muted);}
.sl.active svg,.sl:hover svg{color:var(--navy);}
.sl-badge{margin-left:auto;background:var(--coral);color:#fff;font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:20px;line-height:1.6;}
/* topbar */
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px;}
.topbar h1{font-family:'Fraunces',serif;font-size:1.8rem;font-weight:700;color:var(--navy);}
.topbar p{color:var(--muted);font-size:.9rem;margin-top:3px;}
/* stat cards */
.stat-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:18px;margin-bottom:28px;}
.stat-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:24px;transition:var(--tr);box-shadow:var(--shadow);}
.stat-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-2px);}
.sc-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
.sc-icon svg{width:18px;height:18px;}
.sci-teal{background:var(--teal-pale);color:var(--teal);}
.sci-navy{background:rgba(26,39,68,.07);color:var(--navy);}
.sci-blue{background:var(--blue-pale);color:var(--blue);}
.sci-gold{background:var(--gold-pale);color:var(--gold);}
.sci-coral{background:var(--coral-pale);color:var(--coral);}
.sc-label{font-size:.73rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:8px;}
.sc-num{font-family:'Fraunces',serif;font-size:2rem;font-weight:900;color:var(--navy);line-height:1;}
.sc-sub{color:var(--muted);font-size:.78rem;margin-top:6px;}
.sc-sub.up{color:var(--teal);}
/* card */
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;margin-bottom:20px;}
.card-head{padding:20px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);}
.card-head h3{font-size:.95rem;font-weight:700;color:var(--navy);}
.card-head-sub{color:var(--muted);font-size:.8rem;}
.card-body{padding:22px 24px;}
/* table */
table{width:100%;border-collapse:collapse;}
th{background:var(--surface);text-align:left;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);padding:11px 18px;}
td{padding:14px 18px;border-top:1px solid var(--border);font-size:.875rem;color:var(--text2);}
tr:hover td{background:var(--surface);}
/* pills */
.pill{display:inline-flex;align-items:center;gap:5px;font-size:.72rem;font-weight:700;padding:4px 11px;border-radius:20px;}
.pill::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0;}
.pill-active{background:rgba(42,124,111,.1);color:var(--teal);}
.pill-active::before{background:var(--teal);}
.pill-pending{background:var(--gold-pale);color:var(--gold);}
.pill-pending::before{background:var(--gold);}
.pill-inactive{background:var(--coral-pale);color:var(--coral);}
.pill-inactive::before{background:var(--coral);}
/* buttons */
.btn{padding:10px 20px;border-radius:10px;font-size:.88rem;font-weight:600;cursor:pointer;border:none;font-family:'Outfit',sans-serif;transition:var(--tr);display:inline-flex;align-items:center;gap:7px;}
.btn:hover{transform:translateY(-1px);}
.btn-sm{padding:6px 14px;border-radius:8px;font-size:.78rem;}
.btn-navy{background:var(--navy);color:#fff;}
.btn-navy:hover{background:var(--navy2);}
.btn-ghost{background:var(--surface2);color:var(--text2);}
.btn-ghost:hover{background:var(--border);}
.btn-danger{background:var(--coral-pale);color:var(--coral);}
.btn-danger:hover{background:rgba(224,90,58,.15);}
.btn-success{background:var(--teal-pale);color:var(--teal);}
.btn-success:hover{background:rgba(42,124,111,.15);}
.btn-row{display:flex;gap:6px;flex-wrap:wrap;}
.btn-full{width:100%;padding:14px;border-radius:12px;background:var(--navy);color:#fff;border:none;font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;margin-top:8px;transition:var(--tr);}
.btn-full:hover{background:var(--navy2);transform:translateY(-1px);}
.btn-full.teal{background:var(--teal);}
.btn-full.teal:hover{background:var(--teal-light);}
/* form */
.form-group{display:flex;flex-direction:column;gap:7px;margin-bottom:18px;}
.form-group label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.9px;color:var(--muted);}
.form-input{background:var(--surface);border:1.5px solid var(--border);border-radius:10px;color:var(--text);font-family:'Outfit',sans-serif;font-size:.92rem;padding:12px 14px;outline:none;width:100%;transition:var(--tr);resize:none;}
.form-input:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(42,124,111,.1);background:var(--white);}
.form-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
/* amenity chips */
.amenity-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px;}
.amenity-chip{background:var(--surface);border:1.5px solid var(--border);color:var(--text2);padding:5px 12px;border-radius:20px;font-size:.76rem;font-weight:500;cursor:pointer;transition:var(--tr);font-family:'Outfit',sans-serif;}
.amenity-chip.sel{background:var(--teal-pale);border-color:var(--teal);color:var(--teal);font-weight:600;}
/* charts */
.chart-area{background:var(--surface);border-radius:10px;height:190px;display:flex;align-items:flex-end;gap:8px;padding:16px 16px 0;overflow:hidden;}
.chart-bar{flex:1;background:rgba(42,124,111,.18);border-radius:5px 5px 0 0;transition:var(--tr);}
.chart-bar:hover{background:rgba(42,124,111,.45);}
.chart-bar.highlight{background:rgba(26,39,68,.5);}
/* progress bars */
.prog-row{display:flex;flex-direction:column;gap:14px;}
.prog-item{display:flex;flex-direction:column;gap:6px;}
.prog-label{display:flex;justify-content:space-between;font-size:.82rem;}
.prog-label span:first-child{font-weight:500;color:var(--text2);}
.prog-label span:last-child{color:var(--muted);font-weight:600;}
.prog-bar{height:7px;background:var(--surface2);border-radius:4px;overflow:hidden;}
.prog-fill{height:100%;border-radius:4px;transition:width .8s ease;}
.pf-navy{background:var(--navy);}
.pf-teal{background:var(--teal);}
.pf-blue{background:var(--blue);}
.pf-coral{background:var(--coral);}
.dash-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;}
/* mini list */
.mini-list{display:flex;flex-direction:column;gap:10px;}
.mini-item{display:flex;align-items:center;gap:13px;padding:13px 14px;background:var(--surface);border-radius:11px;border:1px solid transparent;transition:var(--tr);}
.mini-item:hover{border-color:var(--border);background:var(--white);}
.mini-ava{width:38px;height:38px;border-radius:12px;background:var(--navy);display:flex;align-items:center;justify-content:center;font-size:.88rem;color:#fff;font-weight:700;flex-shrink:0;}
.mini-title{font-weight:600;color:var(--navy);margin-bottom:2px;font-size:.875rem;}
.mini-sub{color:var(--muted);font-size:.78rem;}
.ml-auto{margin-left:auto;}
/* logo */
.ld-logo{font-family:'Fraunces',serif;font-size:1.45rem;font-weight:900;color:var(--navy);letter-spacing:-.5px;padding:8px 12px 20px;}
.ld-logo em{color:var(--teal);font-style:normal;}
/* responsive */
@media(max-width:900px){
  .ld-sidebar{width:58px;padding:16px 8px;}
  .sl span:not(svg){display:none;}
  .sl-label,.sl-badge{display:none;}
  .dash-main{margin-left:58px;padding:24px 16px;}
  .form-grid-2{grid-template-columns:1fr;}
  .dash-grid-2{grid-template-columns:1fr;}
}
`;

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const pillClass = (s) => {
  if (!s) return "pill pill-pending";
  const v = s.toLowerCase();
  if (v === "confirmed" || v === "active" || v === "available") return "pill pill-active";
  if (v === "cancelled" || v === "paused") return "pill pill-inactive";
  return "pill pill-pending";
};

// ─── LANDLORD DASHBOARD ───────────────────────────────────────────────────────
export default function LandlordDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add-property form state
  const [form, setForm] = useState({
    pgName: "", city: "", area: "", address: "",
    rent: "", roomType: "single", gender: "unisex",
    description: "", available: true,
  });
  const [selAmenities, setSelAmenities] = useState([]);
  const AMENITY_OPTIONS = ["wifi", "meals", "laundry", "ac", "gym", "parking", "security"];

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const authH = { Authorization: `Bearer ${token}` };

  // ── load profile ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { navigate("/"); return; }
    axios.get("/profile", { headers: authH })
      .then(r => setUser(r.data.data))
      .catch(() => { toast.error("Session expired"); navigate("/"); });
  }, []);

  // ── load properties owned by this landlord ──────────────────────────────
  const loadProperties = () => {
    axios.get("/properties").then(r => {
      const all = r.data.data || [];
      const mine = all.filter(p => p.landlordId?._id === userId || p.landlordId === userId);
      setProperties(mine);
    }).catch(() => { });
  };

  // ── load all bookings then filter to this landlord's properties ─────────
  const loadBookings = () => {
    axios.get("/bookings").then(r => {
      const all = r.data || [];
      setBookings(all);
    }).catch(() => { });
  };

  // ── load payments ───────────────────────────────────────────────────────
  const loadPayments = () => {
    axios.get("/payments").then(r => {
      setPayments(r.data || []);
    }).catch(() => { }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProperties();
    loadBookings();
    loadPayments();
  }, [userId]);

  // ── derived stats ───────────────────────────────────────────────────────
  const myPropIds = properties.map(p => p._id);
  const myBookings = bookings.filter(b => myPropIds.includes(b.pgId?._id || b.pgId));
  const pendingBookings = myBookings.filter(b => b.bookingStatus === "pending");
  const myRevenue = payments
    .filter(p => myPropIds.includes(p.bookingId?.pgId))
    .reduce((s, p) => s + (p.amount || 0), 0);

  // ── update booking status ───────────────────────────────────────────────
  const updateStatus = async (bookingId, status) => {
    try {
      await axios.patch(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status}!`);
      loadBookings();
    } catch { toast.error("Action failed"); }
  };

  // ── delete property ─────────────────────────────────────────────────────
  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await axios.delete(`/properties/${id}`);
      toast.success("Property deleted");
      loadProperties();
    } catch { toast.error("Delete failed"); }
  };

  // ── toggle availability ─────────────────────────────────────────────────
  const toggleAvailable = async (prop) => {
    try {
      await axios.put(`/properties/${prop._id}`, { available: !prop.available });
      toast.success(`Property ${!prop.available ? "activated" : "paused"}`);
      loadProperties();
    } catch { toast.error("Update failed"); }
  };

  // ── add property form ───────────────────────────────────────────────────
  const toggleAmenity = (a) =>
    setSelAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const submitProperty = async (e) => {
    e.preventDefault();
    if (!userId) { toast.error("Login required"); return; }
    try {
      await axios.post(`/users/${userId}/properties`, { ...form, amenities: selAmenities, rent: Number(form.rent) });
      toast.success("Property listed! Under review.");
      setForm({ pgName: "", city: "", area: "", address: "", rent: "", roomType: "single", gender: "unisex", description: "", available: true });
      setSelAmenities([]);
      loadProperties();
      setTab("properties");
    } catch { toast.error("Failed to list property"); }
  };

  const handleLogout = () => { localStorage.clear(); toast.success("Logged out"); navigate("/"); };

  // ─── SIDEBAR ─────────────────────────────────────────────────────────────
  const sidebarLinks = [
    { id: "overview", label: "Dashboard", section: "Overview", icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /> },
    { id: "properties", label: "My Properties", section: null, icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></> },
    { id: "bookings", label: "Bookings", section: null, badge: pendingBookings.length, icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
    { id: "add", label: "Add Property", section: "Manage", icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></> },
    { id: "earnings", label: "Earnings", section: "Finance", icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></> },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", background: "#f5f2ed", color: "#1a2744", fontSize: "1rem" }}>
      Loading dashboard…
    </div>
  );

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="dash-layout">

        {/* ── SIDEBAR ── */}
        <aside className="ld-sidebar">
          <div className="ld-logo">PG<em>Finder</em></div>
          {sidebarLinks.map((link, i) => (
            <div key={link.id}>
              {link.section && <div className="sl-label">{link.section}</div>}
              <button className={`sl${tab === link.id ? " active" : ""}`} onClick={() => setTab(link.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{link.icon}</svg>
                <span>{link.label}</span>
                {link.badge > 0 && <span className="sl-badge">{link.badge}</span>}
              </button>
            </div>
          ))}
          <div className="sl-label" style={{ marginTop: "auto" }}>Account</div>
          <button className="sl" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            <span>Log Out</span>
          </button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="dash-main">

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <div>
              <div className="topbar">
                <div>
                  <h1>Good morning, {user?.firstName || "Landlord"} 👋</h1>
                  <p>Here's what's happening with your properties today.</p>
                </div>
                <button className="btn btn-navy btn-sm" onClick={() => setTab("add")}>+ Add Property</button>
              </div>

              {/* Stat cards */}
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="sc-icon sci-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg></div>
                  <div className="sc-label">Total Properties</div>
                  <div className="sc-num">{properties.length}</div>
                  <div className="sc-sub">{properties.filter(p => p.available).length} active · {properties.filter(p => !p.available).length} paused</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg></div>
                  <div className="sc-label">Active Tenants</div>
                  <div className="sc-num">{myBookings.filter(b => b.bookingStatus === "confirmed").length}</div>
                  <div className="sc-sub up">Confirmed stays</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /></svg></div>
                  <div className="sc-label">Pending Requests</div>
                  <div className="sc-num">{pendingBookings.length}</div>
                  <div className="sc-sub">Awaiting review</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-gold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg></div>
                  <div className="sc-label">Total Revenue</div>
                  <div className="sc-num" style={{ fontSize: "1.55rem" }}>₹{myRevenue.toLocaleString()}</div>
                  <div className="sc-sub up">All time</div>
                </div>
              </div>

              {/* Charts row */}
              <div className="dash-grid-2">
                {/* Bar chart placeholder */}
                <div className="card">
                  <div className="card-head"><h3>Monthly Bookings</h3><span className="card-head-sub">Last 8 months</span></div>
                  <div className="card-body">
                    <div className="chart-area">
                      {[55, 70, 60, 80, 65, 90, 75, 100].map((h, i) => (
                        <div key={i} className={`chart-bar${i === 7 ? " highlight" : ""}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Occupancy */}
                <div className="card">
                  <div className="card-head"><h3>Property Status</h3></div>
                  <div className="card-body">
                    <div className="prog-row">
                      {properties.slice(0, 4).map((p, i) => {
                        const colors = ["pf-navy", "pf-teal", "pf-blue", "pf-coral"];
                        const pct = p.available ? 80 : 40;
                        return (
                          <div key={p._id} className="prog-item">
                            <div className="prog-label"><span>{p.pgName}</span><span>{p.available ? "Active" : "Paused"}</span></div>
                            <div className="prog-bar"><div className={`prog-fill ${colors[i % 4]}`} style={{ width: `${pct}%` }} /></div>
                          </div>
                        );
                      })}
                      {properties.length === 0 && <p style={{ color: "var(--muted)", fontSize: ".87rem" }}>No properties yet.</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent booking requests */}
              <div className="card">
                <div className="card-head">
                  <h3>Recent Booking Requests</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setTab("bookings")}>View All</button>
                </div>
                <table>
                  <thead><tr><th>Tenant</th><th>Property</th><th>Room</th><th>Check-In</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {myBookings.slice(0, 5).map(b => (
                      <tr key={b._id}>
                        <td><strong>{b.tenantId?.firstName || "—"}</strong></td>
                        <td>{b.pgId?.pgName || "—"}</td>
                        <td style={{ textTransform: "capitalize" }}>{b.roomType}</td>
                        <td>{fmt(b.checkInDate)}</td>
                        <td><span className={pillClass(b.bookingStatus)}>{b.bookingStatus}</span></td>
                        <td>
                          <div className="btn-row">
                            {b.bookingStatus === "pending" && <>
                              <button className="btn btn-success btn-sm" onClick={() => updateStatus(b._id, "confirmed")}>Accept</button>
                              <button className="btn btn-danger btn-sm" onClick={() => updateStatus(b._id, "cancelled")}>Decline</button>
                            </>}
                            {b.bookingStatus !== "pending" && <button className="btn btn-ghost btn-sm">Details</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {myBookings.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No bookings yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ MY PROPERTIES ══ */}
          {tab === "properties" && (
            <div>
              <div className="topbar">
                <div><h1>My Properties</h1><p>Manage your listed PG accommodations.</p></div>
                <button className="btn btn-navy btn-sm" onClick={() => setTab("add")}>+ Add New Property</button>
              </div>
              <div className="card">
                <table>
                  <thead><tr><th>Property Name</th><th>Location</th><th>Room Type</th><th>Rent</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {properties.map(p => (
                      <tr key={p._id}>
                        <td><strong>{p.pgName}</strong></td>
                        <td>{p.area}{p.area && p.city ? ", " : ""}{p.city}</td>
                        <td style={{ textTransform: "capitalize" }}>{p.roomType}</td>
                        <td>₹{p.rent?.toLocaleString()}</td>
                        <td><span className={p.available ? "pill pill-active" : "pill pill-inactive"}>{p.available ? "Active" : "Paused"}</span></td>
                        <td>
                          <div className="btn-row">
                            {p.available
                              ? <button className="btn btn-danger btn-sm" onClick={() => toggleAvailable(p)}>Pause</button>
                              : <button className="btn btn-success btn-sm" onClick={() => toggleAvailable(p)}>Activate</button>
                            }
                            <button className="btn btn-ghost btn-sm" onClick={() => deleteProperty(p._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No properties listed yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ BOOKINGS ══ */}
          {tab === "bookings" && (
            <div>
              <div className="topbar"><div><h1>Bookings</h1><p>Track all tenant booking requests and confirmed stays.</p></div></div>
              <div className="card">
                <table>
                  <thead><tr><th>Tenant</th><th>Property</th><th>Check-In</th><th>Check-Out</th><th>Room</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {myBookings.map(b => (
                      <tr key={b._id}>
                        <td><strong>{b.tenantId?.firstName || "—"} {b.tenantId?.lastName || ""}</strong><br /><span style={{ color: "var(--muted)", fontSize: ".75rem" }}>{b.tenantId?.email}</span></td>
                        <td>{b.pgId?.pgName || "—"}</td>
                        <td>{fmt(b.checkInDate)}</td>
                        <td>{fmt(b.checkOutDate)}</td>
                        <td style={{ textTransform: "capitalize" }}>{b.roomType}</td>
                        <td><span className={pillClass(b.bookingStatus)}>{b.bookingStatus}</span></td>
                        <td>
                          <div className="btn-row">
                            {b.bookingStatus === "pending" && <>
                              <button className="btn btn-success btn-sm" onClick={() => updateStatus(b._id, "confirmed")}>Accept</button>
                              <button className="btn btn-danger btn-sm" onClick={() => updateStatus(b._id, "cancelled")}>Decline</button>
                            </>}
                            {b.bookingStatus !== "pending" && <button className="btn btn-ghost btn-sm">View</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {myBookings.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No bookings found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ ADD PROPERTY ══ */}
          {tab === "add" && (
            <div>
              <div className="topbar"><div><h1>Add New Property</h1><p>Fill in the details to list your PG on the platform.</p></div></div>
              <div className="card">
                <div className="card-body">
                  <form onSubmit={submitProperty}>
                    <div className="form-grid-2">
                      {/* Full-width: Property name */}
                      <div className="form-group" style={{ gridColumn: "1/-1" }}>
                        <label>Property Name</label>
                        <input className="form-input" placeholder="e.g. Sunrise PG for Girls" value={form.pgName} onChange={e => setForm({ ...form, pgName: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>City</label>
                        <input className="form-input" placeholder="Bengaluru" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Area / Locality</label>
                        <input className="form-input" placeholder="Koramangala 5th Block" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
                      </div>
                      <div className="form-group" style={{ gridColumn: "1/-1" }}>
                        <label>Full Address</label>
                        <textarea className="form-input" rows={2} placeholder="Building no, street, landmark…" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Monthly Rent (₹)</label>
                        <input className="form-input" type="number" placeholder="7500" value={form.rent} onChange={e => setForm({ ...form, rent: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Room Type</label>
                        <select className="form-input" value={form.roomType} onChange={e => setForm({ ...form, roomType: e.target.value })}>
                          <option value="single">Single</option>
                          <option value="double">Double</option>
                          <option value="triple">Triple</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Gender Preference</label>
                        <select className="form-input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                          <option value="male">Boys Only</option>
                          <option value="female">Girls Only</option>
                          <option value="unisex">Co-ed / Unisex</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Availability</label>
                        <select className="form-input" value={form.available} onChange={e => setForm({ ...form, available: e.target.value === "true" })}>
                          <option value="true">Available Now</option>
                          <option value="false">Not Available</option>
                        </select>
                      </div>
                      {/* Amenities */}
                      <div className="form-group" style={{ gridColumn: "1/-1" }}>
                        <label>Amenities</label>
                        <div className="amenity-chips">
                          {AMENITY_OPTIONS.map(a => (
                            <button type="button" key={a} className={`amenity-chip${selAmenities.includes(a) ? " sel" : ""}`} onClick={() => toggleAmenity(a)}>
                              {a.charAt(0).toUpperCase() + a.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="form-group" style={{ gridColumn: "1/-1" }}>
                        <label>Description</label>
                        <textarea className="form-input" rows={4} placeholder="Tell tenants about your property, rules, nearby areas…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                      </div>
                    </div>
                    <button type="submit" className="btn-full teal">Publish Listing →</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ══ EARNINGS ══ */}
          {tab === "earnings" && (
            <EarningsTab payments={payments} myBookings={myBookings} />
          )}

        </main>
      </div>
    </>
  );
}