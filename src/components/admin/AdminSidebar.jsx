import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PLATFORM_FEE_PCT = 5;

const CSS = `
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
.dash-layout{display:flex;min-height:100vh;}
.ld-sidebar{width:256px;flex-shrink:0;background:var(--white);border-right:1px solid var(--border);
  padding:24px 14px;position:fixed;top:0;left:0;height:100vh;overflow-y:auto;
  display:flex;flex-direction:column;gap:2px;z-index:100;}
.dash-main{flex:1;margin-left:256px;padding:36px 44px;background:var(--bg);min-height:100vh;}
.sl-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--muted);padding:16px 12px 8px;}
.sl{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:10px;color:var(--text2);
  font-size:.875rem;font-weight:500;cursor:pointer;border:none;background:none;width:100%;text-align:left;
  position:relative;transition:var(--tr);font-family:'Outfit',sans-serif;}
.sl:hover{background:var(--surface2);color:var(--navy);}
.sl.active{background:rgba(26,39,68,.07);color:var(--navy);font-weight:600;}
.sl.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:3px;background:var(--teal);border-radius:0 3px 3px 0;}
.sl svg{width:18px;height:18px;flex-shrink:0;color:var(--muted);}
.sl.active svg,.sl:hover svg{color:var(--navy);}
.sl-badge{margin-left:auto;background:var(--coral);color:#fff;font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:20px;line-height:1.6;}
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px;}
.topbar h1{font-family:'Fraunces',serif;font-size:1.8rem;font-weight:700;color:var(--navy);}
.topbar p{color:var(--muted);font-size:.9rem;margin-top:3px;}
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
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;margin-bottom:20px;}
.card-head{padding:20px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);}
.card-head h3{font-size:.95rem;font-weight:700;color:var(--navy);}
table{width:100%;border-collapse:collapse;}
th{background:var(--surface);text-align:left;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);padding:11px 18px;}
td{padding:14px 18px;border-top:1px solid var(--border);font-size:.875rem;color:var(--text2);}
tr:hover td{background:var(--surface);}
.pill{display:inline-flex;align-items:center;gap:5px;font-size:.72rem;font-weight:700;padding:4px 11px;border-radius:20px;}
.pill::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0;}
.pill-active{background:rgba(42,124,111,.1);color:var(--teal);}
.pill-active::before{background:var(--teal);}
.pill-pending{background:var(--gold-pale);color:var(--gold);}
.pill-pending::before{background:var(--gold);}
.pill-inactive{background:var(--coral-pale);color:var(--coral);}
.pill-inactive::before{background:var(--coral);}
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
.ld-logo{font-family:'Fraunces',serif;font-size:1.45rem;font-weight:900;color:var(--navy);letter-spacing:-.5px;padding:8px 12px 20px;}
.ld-logo em{color:var(--teal);font-style:normal;}
.search-input{background:var(--surface);border:1.5px solid var(--border);border-radius:9px;
  color:var(--text);font-family:'Outfit',sans-serif;padding:8px 14px;font-size:.85rem;
  outline:none;transition:var(--tr);}
.search-input:focus{border-color:var(--teal);}
.dash-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;}
.chart-area{background:var(--surface);border-radius:10px;height:190px;display:flex;align-items:flex-end;gap:8px;padding:16px 16px 0;overflow:hidden;}
.chart-bar{flex:1;background:rgba(42,124,111,.18);border-radius:5px 5px 0 0;transition:var(--tr);}
.chart-bar:hover{background:rgba(42,124,111,.45);}
.chart-bar.highlight{background:rgba(26,39,68,.5);}
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
@media(max-width:900px){
  .ld-sidebar{width:58px;padding:16px 8px;}
  .sl span:not(svg){display:none;}
  .sl-label,.sl-badge{display:none;}
  .dash-main{margin-left:58px;padding:24px 16px;}
  .dash-grid-2{grid-template-columns:1fr;}
}
`;

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const pillClass = (s) => {
  if (!s) return "pill pill-pending";
  const v = s.toLowerCase();
  if (v === "active" || v === "confirmed" || v === "success") return "pill pill-active";
  if (v === "inactive" || v === "blocked" || v === "cancelled" || v === "failed") return "pill pill-inactive";
  return "pill pill-pending";
};

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const results = await Promise.allSettled([
      axios.get("/properties"),
      axios.get("/bookings"),
      axios.get("/payments"),
      axios.get("/logs"),
    ]);

    if (results[0].status === "fulfilled") setProperties(results[0].value.data?.data || []);
    if (results[1].status === "fulfilled") setBookings(results[1].value.data || []);
    if (results[2].status === "fulfilled") setPayments(results[2].value.data || []);
    if (results[3].status === "fulfilled") setLogs(results[3].value.data || []);
    setLoading(false);

    // Load users separately (no dedicated admin route, use what's available)
    loadUsers();
  };

  const loadUsers = async () => {
    // We collect unique tenants from bookings
    try {
      const res = await axios.get("/bookings");
      const all = res.data || [];
      const seen = new Set();
      const us = [];
      all.forEach(b => {
        if (b.tenantId && !seen.has(b.tenantId._id)) {
          seen.add(b.tenantId._id);
          us.push({ ...b.tenantId, role: "user" });
        }
      });
      // Also get landlords from properties
      const pRes = await axios.get("/properties");
      (pRes.data?.data || []).forEach(p => {
        if (p.landlordId && !seen.has(p.landlordId._id)) {
          seen.add(p.landlordId._id);
          us.push({ ...p.landlordId, role: "landlord" });
        }
      });
      setUsers(us);
    } catch {}
  };

  // Admin: toggle booking status
  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status}`);
      const res = await axios.get("/bookings");
      setBookings(res.data || []);
    } catch { toast.error("Action failed"); }
  };

  // Admin: toggle property availability
  const toggleProperty = async (prop) => {
    try {
      await axios.put(`/properties/${prop._id}`, { available: !prop.available });
      toast.success("Property updated");
      const res = await axios.get("/properties");
      setProperties(res.data?.data || []);
    } catch { toast.error("Update failed"); }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await axios.delete(`/properties/${id}`);
      toast.success("Property deleted");
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch { toast.error("Delete failed"); }
  };

  const handleLogout = () => { localStorage.clear(); toast.success("Logged out"); navigate("/"); };

  // Derived stats
  const totalRevenue = payments.filter(p => p.paymentStatus === "success").reduce((s, p) => s + (p.amount || 0), 0);
  const platformFeeCollected = Math.round(totalRevenue * PLATFORM_FEE_PCT / 100);
  const confirmedBookings = bookings.filter(b => b.bookingStatus === "confirmed").length;
  const pendingBookings = bookings.filter(b => b.bookingStatus === "pending").length;
  const filteredUsers = users.filter(u => !userSearch || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase()));

  const sidebarLinks = [
    { id: "overview", label: "Dashboard", section: "Overview", icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/> },
    { id: "users", label: "Users", section: null, icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></> },
    { id: "properties", label: "Properties", section: null, icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></> },
    { id: "bookings", label: "Bookings", section: null, badge: pendingBookings, icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
    { id: "payments", label: "Payments", section: "Finance", icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></> },
    { id: "logs", label: "Activity Logs", section: null, icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></> },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", background: "#f5f2ed", color: "#1a2744", fontSize: "1rem" }}>
      Loading admin panel…
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="dash-layout">
        {/* SIDEBAR */}
        <aside className="ld-sidebar">
          <div className="ld-logo">PG<em>Finder</em></div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#e05a3a", padding: "0 12px 12px", fontFamily: "'Outfit',sans-serif" }}>ADMIN PANEL</div>

          {sidebarLinks.map((link) => (
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Log Out</span>
          </button>
        </aside>

        <main className="dash-main">

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <div>
              <div className="topbar">
                <div><h1>Admin Dashboard</h1><p>Full platform overview and controls.</p></div>
              </div>

              <div className="stat-cards">
                <div className="stat-card">
                  <div className="sc-icon sci-navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                  <div className="sc-label">Total Users</div>
                  <div className="sc-num">{users.filter(u => u.role === "user").length}</div>
                  <div className="sc-sub up">Registered tenants</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div>
                  <div className="sc-label">Total Properties</div>
                  <div className="sc-num">{properties.length}</div>
                  <div className="sc-sub">{properties.filter(p => p.available).length} available</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                  <div className="sc-label">Total Bookings</div>
                  <div className="sc-num">{bookings.length}</div>
                  <div className="sc-sub">{confirmedBookings} confirmed · {pendingBookings} pending</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-gold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
                  <div className="sc-label">Platform Revenue</div>
                  <div className="sc-num" style={{ fontSize: "1.5rem" }}>₹{platformFeeCollected.toLocaleString()}</div>
                  <div className="sc-sub up">{PLATFORM_FEE_PCT}% of ₹{totalRevenue.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-coral"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/></svg></div>
                  <div className="sc-label">Total GMV</div>
                  <div className="sc-num" style={{ fontSize: "1.5rem" }}>₹{totalRevenue.toLocaleString()}</div>
                  <div className="sc-sub">Gross transaction volume</div>
                </div>
              </div>

              {/* Charts */}
              <div className="dash-grid-2">
                <div className="card">
                  <div className="card-head"><h3>Monthly Transactions</h3></div>
                  <div style={{ padding: "22px 24px" }}>
                    <div className="chart-area">
                      {[30, 50, 45, 65, 80, 70, 92, 100].map((h, i) => (
                        <div key={i} className={`chart-bar${i === 7 ? " highlight" : ""}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-head"><h3>Revenue by Room Type</h3></div>
                  <div style={{ padding: "22px 24px" }}>
                    <div className="prog-row">
                      {[["Single Occupancy", 42, "pf-navy"], ["Double Occupancy", 35, "pf-teal"], ["Triple Occupancy", 15, "pf-blue"], ["Co-living", 8, "pf-coral"]].map(([label, pct, cls]) => (
                        <div key={label} className="prog-item">
                          <div className="prog-label"><span>{label}</span><span>{pct}%</span></div>
                          <div className="prog-bar"><div className={`prog-fill ${cls}`} style={{ width: `${pct}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent bookings */}
              <div className="card">
                <div className="card-head"><h3>Recent Bookings</h3><button className="btn btn-ghost btn-sm" onClick={() => setTab("bookings")}>View All</button></div>
                <table>
                  <thead><tr><th>Tenant</th><th>Property</th><th>Room</th><th>Check-In</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {bookings.slice(0, 6).map(b => (
                      <tr key={b._id}>
                        <td><strong>{b.tenantId?.firstName || "—"} {b.tenantId?.lastName || ""}</strong></td>
                        <td>{b.pgId?.pgName || "—"}</td>
                        <td style={{ textTransform: "capitalize" }}>{b.roomType}</td>
                        <td>{fmt(b.checkInDate)}</td>
                        <td><span className={pillClass(b.bookingStatus)}>{b.bookingStatus}</span></td>
                        <td>
                          <div className="btn-row">
                            {b.bookingStatus === "pending" && <>
                              <button className="btn btn-success btn-sm" onClick={() => updateBookingStatus(b._id, "confirmed")}>Confirm</button>
                              <button className="btn btn-danger btn-sm" onClick={() => updateBookingStatus(b._id, "cancelled")}>Cancel</button>
                            </>}
                            {b.bookingStatus !== "pending" && <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>—</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No bookings yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ USERS ══ */}
          {tab === "users" && (
            <div>
              <div className="topbar">
                <div><h1>User Management</h1><p>Manage all tenants and landlords on the platform.</p></div>
                <input className="search-input" placeholder="Search users…" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
              </div>
              <div className="card">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u._id}>
                        <td><strong>{u.firstName} {u.lastName}</strong></td>
                        <td style={{ color: "var(--muted)" }}>{u.email}</td>
                        <td><span className="pill" style={{ background: u.role === "landlord" ? "var(--gold-pale)" : "var(--blue-pale)", color: u.role === "landlord" ? "var(--gold)" : "var(--blue)" }}>{u.role}</span></td>
                        <td><span className={pillClass(u.status || "active")}>{u.status || "active"}</span></td>
                        <td style={{ color: "var(--muted)" }}>{fmt(u.createdAt)}</td>
                        <td>
                          <div className="btn-row">
                            {(u.status === "active" || !u.status) && (
                              <button className="btn btn-danger btn-sm" onClick={() => toast.info("User management requires admin API endpoint")}>Block</button>
                            )}
                            {u.status === "blocked" && (
                              <button className="btn btn-success btn-sm" onClick={() => toast.info("User management requires admin API endpoint")}>Unblock</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No users found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ PROPERTIES ══ */}
          {tab === "properties" && (
            <div>
              <div className="topbar"><div><h1>All Properties</h1><p>Manage all listed PG accommodations.</p></div></div>
              <div className="card">
                <table>
                  <thead><tr><th>Property Name</th><th>Landlord</th><th>Location</th><th>Rent</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {properties.map(p => (
                      <tr key={p._id}>
                        <td><strong>{p.pgName}</strong></td>
                        <td>{p.landlordId?.firstName || "—"} {p.landlordId?.lastName || ""}</td>
                        <td>{p.area ? `${p.area}, ` : ""}{p.city}</td>
                        <td>₹{p.rent?.toLocaleString()}</td>
                        <td><span className={p.available ? "pill pill-active" : "pill pill-inactive"}>{p.available ? "Available" : "Paused"}</span></td>
                        <td>
                          <div className="btn-row">
                            {p.available
                              ? <button className="btn btn-danger btn-sm" onClick={() => toggleProperty(p)}>Pause</button>
                              : <button className="btn btn-success btn-sm" onClick={() => toggleProperty(p)}>Activate</button>
                            }
                            <button className="btn btn-ghost btn-sm" onClick={() => deleteProperty(p._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No properties found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ BOOKINGS ══ */}
          {tab === "bookings" && (
            <div>
              <div className="topbar"><div><h1>All Bookings</h1><p>Complete booking history across the platform.</p></div></div>
              <div className="card">
                <table>
                  <thead><tr><th>Tenant</th><th>Property</th><th>Check-In</th><th>Check-Out</th><th>Room</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td><strong>{b.tenantId?.firstName || "—"} {b.tenantId?.lastName || ""}</strong><br /><span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{b.tenantId?.email}</span></td>
                        <td>{b.pgId?.pgName || "—"}</td>
                        <td>{fmt(b.checkInDate)}</td>
                        <td>{fmt(b.checkOutDate)}</td>
                        <td style={{ textTransform: "capitalize" }}>{b.roomType}</td>
                        <td><span className={pillClass(b.bookingStatus)}>{b.bookingStatus}</span></td>
                        <td>
                          <div className="btn-row">
                            {b.bookingStatus === "pending" && <>
                              <button className="btn btn-success btn-sm" onClick={() => updateBookingStatus(b._id, "confirmed")}>Confirm</button>
                              <button className="btn btn-danger btn-sm" onClick={() => updateBookingStatus(b._id, "cancelled")}>Cancel</button>
                            </>}
                            {b.bookingStatus !== "pending" && <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>No action</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No bookings found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ PAYMENTS ══ */}
          {tab === "payments" && (
            <div>
              <div className="topbar"><div><h1>Payments & Revenue</h1><p>Track all transactions and platform fee collection.</p></div></div>

              <div className="stat-cards">
                <div className="stat-card">
                  <div className="sc-icon sci-gold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
                  <div className="sc-label">Total Transaction Volume</div>
                  <div className="sc-num" style={{ fontSize: "1.5rem" }}>₹{totalRevenue.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/></svg></div>
                  <div className="sc-label">Platform Fee ({PLATFORM_FEE_PCT}%)</div>
                  <div className="sc-num" style={{ fontSize: "1.5rem" }}>₹{platformFeeCollected.toLocaleString()}</div>
                  <div className="sc-sub up">Admin earnings</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div>
                  <div className="sc-label">Landlord Payouts</div>
                  <div className="sc-num" style={{ fontSize: "1.5rem" }}>₹{(totalRevenue - platformFeeCollected).toLocaleString()}</div>
                  <div className="sc-sub">Net to landlords</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-coral"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
                  <div className="sc-label">Successful Payments</div>
                  <div className="sc-num">{payments.filter(p => p.paymentStatus === "success").length}</div>
                </div>
              </div>

              <div className="card">
                <div className="card-head"><h3>All Transactions</h3></div>
                <table>
                  <thead><tr><th>Date</th><th>Booking</th><th>Tenant</th><th>Property</th><th>Amount</th><th>Platform Fee</th><th>Landlord Gets</th><th>Method</th><th>Status</th></tr></thead>
                  <tbody>
                    {payments.map(p => {
                      const fee = Math.round((p.amount || 0) * PLATFORM_FEE_PCT / 100);
                      const landlordAmt = (p.amount || 0) - fee;
                      return (
                        <tr key={p._id}>
                          <td style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{fmt(p.createdAt)}</td>
                          <td><strong style={{ color: "var(--navy)", fontSize: "0.78rem" }}>#{p._id?.slice(-6).toUpperCase()}</strong></td>
                          <td>{p.userId?.firstName || "—"}</td>
                          <td>{p.bookingId?.pgId?.pgName || "—"}</td>
                          <td style={{ fontWeight: 600 }}>₹{p.amount?.toLocaleString()}</td>
                          <td style={{ color: "var(--teal)", fontWeight: 600 }}>₹{fee.toLocaleString()}</td>
                          <td>₹{landlordAmt.toLocaleString()}</td>
                          <td style={{ textTransform: "capitalize" }}>{p.paymentMethod}</td>
                          <td><span className={pillClass(p.paymentStatus)}>{p.paymentStatus}</span></td>
                        </tr>
                      );
                    })}
                    {payments.length === 0 && <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No payments yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ ACTIVITY LOGS ══ */}
          {tab === "logs" && (
            <div>
              <div className="topbar"><div><h1>Activity Logs</h1><p>System-wide audit trail of all actions.</p></div></div>
              <div className="card">
                <table>
                  <thead><tr><th>Date</th><th>User</th><th>Activity</th><th>Description</th></tr></thead>
                  <tbody>
                    {logs.map((l, i) => (
                      <tr key={l._id || i}>
                        <td style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{fmt(l.createdAt)}</td>
                        <td>{l.userId?.firstName || "System"}</td>
                        <td><span className="pill pill-info" style={{ background: "var(--blue-pale)", color: "var(--blue)" }}>{l.activity || "—"}</span></td>
                        <td style={{ color: "var(--text2)" }}>{l.description || "—"}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No activity logs found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
};

export default AdminSidebar;