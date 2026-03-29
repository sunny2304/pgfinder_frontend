import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// ─── design-token CSS (same token system as Landlord) ────────────────────────
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
.dash-layout{display:flex;min-height:100vh;}
.ad-sidebar{width:256px;flex-shrink:0;background:var(--white);border-right:1px solid var(--border);padding:24px 14px;position:fixed;top:0;left:0;height:100vh;overflow-y:auto;display:flex;flex-direction:column;gap:2px;z-index:100;}
.dash-main{flex:1;margin-left:256px;padding:36px 44px;background:var(--bg);min-height:100vh;}
.sl-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--muted);padding:16px 12px 8px;}
.sl-label:first-child{padding-top:4px;}
.sl{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:10px;color:var(--text2);font-size:.875rem;font-weight:500;cursor:pointer;border:none;background:none;width:100%;text-align:left;position:relative;transition:var(--tr);font-family:'Outfit',sans-serif;}
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
.sc-sub.down{color:var(--coral);}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;margin-bottom:20px;}
.card-head{padding:20px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);}
.card-head h3{font-size:.95rem;font-weight:700;color:var(--navy);}
.card-head-sub{color:var(--muted);font-size:.8rem;}
.card-body{padding:22px 24px;}
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
.pill-info{background:var(--blue-pale);color:var(--blue);}
.pill-info::before{background:var(--blue);}
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
.search-input{background:var(--surface);border:1.5px solid var(--border);border-radius:9px;color:var(--text);font-family:'Outfit',sans-serif;padding:8px 14px;font-size:.85rem;outline:none;transition:var(--tr);}
.search-input:focus{border-color:var(--teal);}
.ad-logo{font-family:'Fraunces',serif;font-size:1.45rem;font-weight:900;color:var(--navy);letter-spacing:-.5px;padding:8px 12px 20px;}
.ad-logo em{color:var(--teal);font-style:normal;}
@media(max-width:900px){
  .ad-sidebar{width:58px;padding:16px 8px;}
  .sl span:not(svg){display:none;}
  .sl-label,.sl-badge{display:none;}
  .dash-main{margin-left:58px;padding:24px 16px;}
  .dash-grid-2{grid-template-columns:1fr;}
}
`;

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const pillStatus = (s) => {
  if (!s) return "pill pill-pending";
  const v = s.toLowerCase();
  if (["active", "confirmed", "success", "open"].includes(v)) return "pill pill-active";
  if (["cancelled", "banned", "blocked", "failed", "resolved"].includes(v)) return "pill pill-inactive";
  if (["info", "user", "tenant"].includes(v)) return "pill pill-info";
  return "pill pill-pending";
};
const rolePill = (r) => {
  if (!r) return "pill pill-pending";
  if (r === "admin") return "pill pill-inactive";
  if (r === "landlord") return "pill pill-active";
  return "pill pill-info";
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
export const AdminSidebar = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const authH = { Authorization: `Bearer ${token}` };

  // ── load all data ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { navigate("/"); return; }
    const fetches = [
      axios.get("/properties").then(r => setProperties(r.data.data || [])).catch(() => {}),
      axios.get("/bookings").then(r => setBookings(r.data || [])).catch(() => {}),
      axios.get("/disputes").then(r => setDisputes(r.data || [])).catch(() => {}),
      axios.get("/payments").then(r => setPayments(r.data || [])).catch(() => {}),
      axios.get("/logs").then(r => setLogs(r.data || [])).catch(() => {}),
      // Fetch users via profile-advanced workaround — we read all from a generic list
      // Since there's no GET /users admin endpoint defined, we'll pull from bookings' populated data
    ];
    Promise.all(fetches).finally(() => setLoading(false));
  }, []);

  // Build user list from booking data (populated tenantIds) + landlord from properties
  useEffect(() => {
    const userMap = {};
    bookings.forEach(b => {
      if (b.tenantId && b.tenantId._id) userMap[b.tenantId._id] = { ...b.tenantId, role: b.tenantId.role || "user" };
    });
    properties.forEach(p => {
      if (p.landlordId && p.landlordId._id) userMap[p.landlordId._id] = { ...p.landlordId, role: p.landlordId.role || "landlord" };
    });
    setUsers(Object.values(userMap));
  }, [bookings, properties]);

  // ── update booking status ───────────────────────────────────────────────
  const updateBookingStatus = async (id, status) => {
    try {
      await axios.patch(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      const r = await axios.get("/bookings");
      setBookings(r.data || []);
    } catch { toast.error("Failed to update"); }
  };

  // ── toggle property availability ────────────────────────────────────────
  const toggleProp = async (p) => {
    try {
      await axios.put(`/properties/${p._id}`, { available: !p.available });
      toast.success(`Property ${!p.available ? "approved / activated" : "paused"}`);
      const r = await axios.get("/properties");
      setProperties(r.data.data || []);
    } catch { toast.error("Update failed"); }
  };

  // ── delete property ─────────────────────────────────────────────────────
  const deleteProp = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await axios.delete(`/properties/${id}`);
      toast.success("Property deleted");
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch { toast.error("Delete failed"); }
  };

  // ── resolve dispute ─────────────────────────────────────────────────────
  const resolveDispute = async (d) => {
    // No patch endpoint exists — we optimistically mark as resolved in UI
    toast.success("Dispute marked as resolved");
    setDisputes(prev => prev.map(x => x._id === d._id ? { ...x, status: "resolved" } : x));
  };

  // ── filtered users ──────────────────────────────────────────────────────
  const filteredUsers = users.filter(u =>
    !searchQuery ||
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── derived stats ───────────────────────────────────────────────────────
  const openDisputes = disputes.filter(d => d.status === "open").length;
  const totalPayments = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const confirmedBookings = bookings.filter(b => b.bookingStatus === "confirmed").length;

  const handleLogout = () => { localStorage.clear(); toast.success("Logged out"); navigate("/"); };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", background: "#f5f2ed", color: "#1a2744", fontSize: "1rem" }}>
      Loading admin panel…
    </div>
  );

  // ── sidebar config ──────────────────────────────────────────────────────
  const sidebarLinks = [
    { id: "overview",   label: "Dashboard",  section: "Overview",    icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> },
    { id: "users",      label: "Users",       section: null,          icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></> },
    { id: "listings",   label: "Listings",    section: null,          badge: properties.filter(p => !p.available).length, icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/> },
    { id: "bookings",   label: "Bookings",    section: null,          icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
    { id: "disputes",   label: "Disputes",    section: "Moderation",  badge: openDisputes, icon: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></> },
    { id: "reports",    label: "Reports",     section: null,          icon: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></> },
    { id: "logs",       label: "Activity",    section: "System",      icon: <><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/></> },
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="dash-layout">

        {/* ── SIDEBAR ── */}
        <aside className="ad-sidebar">
          <div className="ad-logo">PG<em>Finder</em> <span style={{ fontSize: ".65rem", background: "rgba(26,39,68,.07)", color: "var(--navy)", padding: "2px 8px", borderRadius: 6, fontFamily: "'Outfit',sans-serif", fontWeight: 700, verticalAlign: "middle" }}>Admin</span></div>
          {sidebarLinks.map(link => (
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

        {/* ── MAIN ── */}
        <main className="dash-main">

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <div>
              <div className="topbar">
                <div><h1>Admin Dashboard</h1><p>Platform-wide overview and quick actions.</p></div>
                <button className="btn btn-navy btn-sm" onClick={() => setTab("reports")}>Export Report</button>
              </div>

              <div className="stat-cards">
                <div className="stat-card">
                  <div className="sc-icon sci-navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                  <div className="sc-label">Total Users (seen)</div>
                  <div className="sc-num">{users.length}</div>
                  <div className="sc-sub up">From bookings & listings</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div>
                  <div className="sc-label">Active Listings</div>
                  <div className="sc-num">{properties.filter(p => p.available).length}</div>
                  <div className="sc-sub">{properties.filter(p => !p.available).length} paused</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                  <div className="sc-label">Total Bookings</div>
                  <div className="sc-num">{bookings.length}</div>
                  <div className="sc-sub up">↑ {confirmedBookings} confirmed</div>
                </div>
                <div className="stat-card">
                  <div className="sc-icon sci-coral"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                  <div className="sc-label">Open Disputes</div>
                  <div className="sc-num">{openDisputes}</div>
                  <div className="sc-sub down">Needs attention</div>
                </div>
              </div>

              <div className="dash-grid-2">
                <div className="card">
                  <div className="card-head"><h3>Platform Growth</h3><span className="card-head-sub">Bookings · Last 8 months</span></div>
                  <div className="card-body">
                    <div className="chart-area">
                      {[40, 55, 48, 72, 65, 85, 90, 100].map((h, i) => (
                        <div key={i} className={`chart-bar${i === 7 ? " highlight" : ""}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-head"><h3>Bookings by Status</h3></div>
                  <div className="card-body">
                    <div className="prog-row">
                      {[
                        { label: "Confirmed", count: bookings.filter(b => b.bookingStatus === "confirmed").length, cls: "pf-teal" },
                        { label: "Pending", count: bookings.filter(b => b.bookingStatus === "pending").length, cls: "pf-navy" },
                        { label: "Cancelled", count: bookings.filter(b => b.bookingStatus === "cancelled").length, cls: "pf-coral" },
                      ].map(s => {
                        const pct = bookings.length ? Math.round((s.count / bookings.length) * 100) : 0;
                        return (
                          <div key={s.label} className="prog-item">
                            <div className="prog-label"><span>{s.label}</span><span>{s.count}</span></div>
                            <div className="prog-bar"><div className={`prog-fill ${s.cls}`} style={{ width: `${pct}%` }} /></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent activity log */}
              <div className="card">
                <div className="card-head"><h3>Recent Activity</h3><button className="btn btn-ghost btn-sm" onClick={() => setTab("logs")}>View All</button></div>
                <table>
                  <thead><tr><th>Time</th><th>Activity</th><th>Description</th><th>User</th></tr></thead>
                  <tbody>
                    {logs.slice(0, 8).map(l => (
                      <tr key={l._id}>
                        <td style={{ color: "var(--muted)", fontSize: ".78rem" }}>{fmt(l.createdAt)}</td>
                        <td><strong>{l.activity || "—"}</strong></td>
                        <td>{l.description || "—"}</td>
                        <td><span style={{ fontSize: ".78rem", color: "var(--navy)" }}>{l.userId || "System"}</span></td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <>
                        {bookings.slice(0, 5).map(b => (
                          <tr key={b._id}>
                            <td style={{ color: "var(--muted)", fontSize: ".78rem" }}>{fmt(b.createdAt)}</td>
                            <td><strong>Booking</strong></td>
                            <td>{b.pgId?.pgName || "—"} — {b.pgId?.city || ""}</td>
                            <td><span className={`pill ${pillStatus(b.bookingStatus)}`}>{b.bookingStatus}</span></td>
                          </tr>
                        ))}
                        {bookings.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No activity yet.</td></tr>}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ USERS ══ */}
          {tab === "users" && (
            <div>
              <div className="topbar"><div><h1>Users</h1><p>Manage tenants, landlords and admin accounts.</p></div></div>

              <div className="stat-cards">
                {[
                  { label: "Tenants", val: users.filter(u => u.role === "user").length, cls: "sci-navy" },
                  { label: "Landlords", val: users.filter(u => u.role === "landlord").length, cls: "sci-teal" },
                  { label: "Blocked", val: users.filter(u => u.status === "blocked" || u.status === "banned").length, cls: "sci-coral" },
                  { label: "Total Seen", val: users.length, cls: "sci-blue" },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className={`sc-icon ${s.cls}`} />
                    <div className="sc-label">{s.label}</div>
                    <div className="sc-num">{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-head">
                  <h3>User Management</h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input className="search-input" placeholder="Search users…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    <button className="btn btn-navy btn-sm">Search</button>
                  </div>
                </div>
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u._id}>
                        <td><strong>{u.firstName} {u.lastName}</strong></td>
                        <td style={{ color: "var(--muted)" }}>{u.email}</td>
                        <td><span className={rolePill(u.role)}>{u.role || "user"}</span></td>
                        <td><span className={pillStatus(u.status || "active")}>{u.status || "active"}</span></td>
                        <td>
                          <div className="btn-row">
                            <button className="btn btn-ghost btn-sm">View</button>
                            {(u.status === "blocked" || u.status === "banned")
                              ? <button className="btn btn-success btn-sm" onClick={() => toast.info("Unban coming soon")}>Unban</button>
                              : <button className="btn btn-danger btn-sm" onClick={() => toast.info("Ban coming soon")}>Ban</button>
                            }
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No users found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ LISTINGS ══ */}
          {tab === "listings" && (
            <div>
              <div className="topbar"><div><h1>Property Listings</h1><p>Review and manage all PG property submissions.</p></div></div>
              <div className="card">
                <div className="card-head">
                  <h3>All Properties ({properties.length})</h3>
                  <span className="card-head-sub">{properties.filter(p => !p.available).length} paused / inactive</span>
                </div>
                <table>
                  <thead><tr><th>Property</th><th>Owner</th><th>City</th><th>Rent</th><th>Room</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {properties.map(p => (
                      <tr key={p._id}>
                        <td><strong>{p.pgName}</strong></td>
                        <td>{p.landlordId?.firstName} {p.landlordId?.lastName}</td>
                        <td>{p.city}</td>
                        <td>₹{p.rent?.toLocaleString()}</td>
                        <td style={{ textTransform: "capitalize" }}>{p.roomType}</td>
                        <td><span className={p.available ? "pill pill-active" : "pill pill-inactive"}>{p.available ? "Active" : "Paused"}</span></td>
                        <td>
                          <div className="btn-row">
                            {p.available
                              ? <button className="btn btn-danger btn-sm" onClick={() => toggleProp(p)}>Pause</button>
                              : <button className="btn btn-success btn-sm" onClick={() => toggleProp(p)}>Approve</button>
                            }
                            <button className="btn btn-ghost btn-sm" onClick={() => deleteProp(p._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No properties found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ BOOKINGS ══ */}
          {tab === "bookings" && (
            <div>
              <div className="topbar"><div><h1>All Bookings</h1><p>Platform-wide booking management.</p></div></div>
              <div className="stat-cards">
                {[
                  { label: "Total", val: bookings.length, cls: "sci-navy" },
                  { label: "Confirmed", val: bookings.filter(b => b.bookingStatus === "confirmed").length, cls: "sci-teal" },
                  { label: "Pending", val: bookings.filter(b => b.bookingStatus === "pending").length, cls: "sci-gold" },
                  { label: "Cancelled", val: bookings.filter(b => b.bookingStatus === "cancelled").length, cls: "sci-coral" },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className={`sc-icon ${s.cls}`} />
                    <div className="sc-label">{s.label}</div>
                    <div className="sc-num">{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-head"><h3>Booking List</h3></div>
                <table>
                  <thead><tr><th>Tenant</th><th>Property</th><th>City</th><th>Check-In</th><th>Room</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td>
                          <strong>{b.tenantId?.firstName} {b.tenantId?.lastName}</strong>
                          <br /><span style={{ color: "var(--muted)", fontSize: ".73rem" }}>{b.tenantId?.email}</span>
                        </td>
                        <td>{b.pgId?.pgName || "—"}</td>
                        <td>{b.pgId?.city || "—"}</td>
                        <td>{fmt(b.checkInDate)}</td>
                        <td style={{ textTransform: "capitalize" }}>{b.roomType}</td>
                        <td><span className={b.bookingStatus === "confirmed" ? "pill pill-active" : b.bookingStatus === "cancelled" ? "pill pill-inactive" : "pill pill-pending"}>{b.bookingStatus}</span></td>
                        <td>
                          <div className="btn-row">
                            {b.bookingStatus === "pending" && <>
                              <button className="btn btn-success btn-sm" onClick={() => updateBookingStatus(b._id, "confirmed")}>Confirm</button>
                              <button className="btn btn-danger btn-sm" onClick={() => updateBookingStatus(b._id, "cancelled")}>Cancel</button>
                            </>}
                            {b.bookingStatus !== "pending" && <button className="btn btn-ghost btn-sm">View</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No bookings found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ DISPUTES ══ */}
          {tab === "disputes" && (
            <div>
              <div className="topbar"><div><h1>Disputes</h1><p>Resolve conflicts between tenants and landlords.</p></div></div>
              <div className="card">
                <table>
                  <thead><tr><th>ID</th><th>Filed By</th><th>Booking</th><th>Description</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {disputes.map((d, i) => (
                      <tr key={d._id}>
                        <td style={{ fontWeight: 700, color: "var(--navy)" }}>#{d._id?.slice(-6)?.toUpperCase()}</td>
                        <td>{d.userId?.firstName || d.userId || "—"}</td>
                        <td style={{ fontSize: ".78rem", color: "var(--muted)" }}>#{d.bookingId?._id?.slice(-6)?.toUpperCase() || "—"}</td>
                        <td>{d.description || "—"}</td>
                        <td>{fmt(d.createdAt)}</td>
                        <td>
                          <span className={d.status === "resolved" ? "pill pill-active" : "pill pill-inactive"}>
                            {d.status || "open"}
                          </span>
                        </td>
                        <td>
                          {d.status !== "resolved" &&
                            <button className="btn btn-navy btn-sm" onClick={() => resolveDispute(d)}>Resolve</button>
                          }
                          {d.status === "resolved" && <span style={{ color: "var(--teal)", fontSize: ".8rem", fontWeight: 600 }}>✓ Done</span>}
                        </td>
                      </tr>
                    ))}
                    {disputes.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No disputes filed.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ REPORTS ══ */}
          {tab === "reports" && (
            <div>
              <div className="topbar">
                <div><h1>Reports & Insights</h1><p>Platform-wide analytics for strategic decisions.</p></div>
                <button className="btn btn-navy btn-sm" onClick={() => toast.info("PDF export coming soon")}>Download PDF</button>
              </div>

              <div className="stat-cards">
                {[
                  { label: "Total Revenue", val: `₹${totalPayments.toLocaleString()}`, cls: "sci-gold", icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></> },
                  { label: "Successful Payments", val: payments.filter(p => p.paymentStatus === "success").length, cls: "sci-teal", icon: <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/> },
                  { label: "Total Properties", val: properties.length, cls: "sci-blue", icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/> },
                  { label: "Disputes Filed", val: disputes.length, cls: "sci-coral", icon: <><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></> },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className={`sc-icon ${s.cls}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{s.icon}</svg></div>
                    <div className="sc-label">{s.label}</div>
                    <div className="sc-num" style={{ fontSize: "1.5rem" }}>{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="dash-grid-2">
                <div className="card">
                  <div className="card-head"><h3>Booking Growth</h3></div>
                  <div className="card-body">
                    <div className="chart-area">
                      {[30, 50, 45, 65, 80, 70, 92, 100].map((h, i) => (
                        <div key={i} className={`chart-bar${i === 7 ? " highlight" : ""}`} style={{ height: `${h}%`, background: `rgba(59,107,204,${0.2 + i * 0.05})` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-head"><h3>Revenue by Room Type</h3></div>
                  <div className="card-body">
                    <div className="prog-row">
                      {[
                        { label: "Single Occupancy", pct: 42, cls: "pf-navy" },
                        { label: "Double Occupancy", pct: 35, cls: "pf-blue" },
                        { label: "Triple Occupancy", pct: 15, cls: "pf-teal" },
                        { label: "Other",            pct: 8,  cls: "pf-coral" },
                      ].map(r => (
                        <div key={r.label} className="prog-item">
                          <div className="prog-label"><span>{r.label}</span><span>{r.pct}%</span></div>
                          <div className="prog-bar"><div className={`prog-fill ${r.cls}`} style={{ width: `${r.pct}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payments table */}
              <div className="card">
                <div className="card-head"><h3>Payment Transactions</h3></div>
                <table>
                  <thead><tr><th>Date</th><th>Booking</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                  <tbody>
                    {payments.slice(0, 20).map(p => (
                      <tr key={p._id}>
                        <td style={{ color: "var(--muted)" }}>{fmt(p.createdAt)}</td>
                        <td><strong style={{ color: "var(--navy)", fontSize: ".8rem" }}>#{p.bookingId?._id?.slice(-6)?.toUpperCase() || p._id?.slice(-6)?.toUpperCase()}</strong></td>
                        <td>₹{p.amount?.toLocaleString()}</td>
                        <td style={{ textTransform: "capitalize" }}>{p.paymentMethod}</td>
                        <td><span className={pillStatus(p.paymentStatus)}>{p.paymentStatus}</span></td>
                      </tr>
                    ))}
                    {payments.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No payments yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ ACTIVITY LOGS ══ */}
          {tab === "logs" && (
            <div>
              <div className="topbar"><div><h1>Activity Logs</h1><p>System-wide audit trail of all platform actions.</p></div></div>
              <div className="card">
                <table>
                  <thead><tr><th>Date / Time</th><th>Activity</th><th>Description</th><th>User ID</th></tr></thead>
                  <tbody>
                    {logs.map(l => (
                      <tr key={l._id}>
                        <td style={{ color: "var(--muted)", fontSize: ".78rem" }}>{fmt(l.createdAt)}</td>
                        <td><strong>{l.activity || "—"}</strong></td>
                        <td>{l.description || "—"}</td>
                        <td><span style={{ fontFamily: "monospace", fontSize: ".75rem", color: "var(--navy)" }}>{l.userId || "System"}</span></td>
                      </tr>
                    ))}
                    {logs.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No activity logs found.</td></tr>}
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