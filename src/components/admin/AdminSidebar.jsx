import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PLATFORM_FEE_PCT = 5;
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const pillClass = (s) => {
  if (!s) return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]";
  const v = s.toLowerCase();
  if (v === "active" || v === "confirmed" || v === "success")
    return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[rgba(42,124,111,0.1)] text-[#2a7c6f]";
  if (v === "inactive" || v === "blocked" || v === "cancelled" || v === "failed")
    return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf0ec] text-[#e05a3a]";
  return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]";
};

const PillDot = ({ s }) => {
  const color = !s ? "#c8922a" : (s === "active" || s === "confirmed" || s === "success") ? "#2a7c6f" : (s === "inactive" || s === "blocked" || s === "cancelled" || s === "failed") ? "#e05a3a" : "#c8922a";
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />;
};

const BtnSm = ({ cls, onClick, children }) => (
  <button className={`py-1.5 px-3.5 rounded-[8px] text-[0.78rem] font-semibold cursor-pointer border-none transition-all duration-300 hover:-translate-y-px ${cls}`} style={{ fontFamily: "'Outfit',sans-serif" }} onClick={onClick}>{children}</button>
);

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

  useEffect(() => { loadAll(); }, []);

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
    loadUsers();
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get("/bookings");
      const all = res.data || [];
      const seen = new Set(); const us = [];
      all.forEach(b => {
        if (b.tenantId && !seen.has(b.tenantId._id)) { seen.add(b.tenantId._id); us.push({ ...b.tenantId, role: "user" }); }
      });
      const pRes = await axios.get("/properties");
      (pRes.data?.data || []).forEach(p => {
        if (p.landlordId && !seen.has(p.landlordId._id)) { seen.add(p.landlordId._id); us.push({ ...p.landlordId, role: "landlord" }); }
      });
      setUsers(us);
    } catch {}
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status}`);
      const res = await axios.get("/bookings");
      setBookings(res.data || []);
    } catch { toast.error("Action failed"); }
  };

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

  const totalRevenue = payments.filter(p => p.paymentStatus === "success").reduce((s, p) => s + (p.amount || 0), 0);
  const platformFeeCollected = Math.round(totalRevenue * PLATFORM_FEE_PCT / 100);
  const pendingBookings = bookings.filter(b => b.bookingStatus === "pending").length;
  const filteredUsers = users.filter(u => !userSearch || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase()));

  // Sidebar matching screenshot 12: Overview, Users, Listings | Moderation: Disputes, Reports | System: Notifications, Log Out
  const sidebarLinks = [
    { id: "overview", label: "Dashboard", section: "OVERVIEW", icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /> },
    { id: "users", label: "Users", section: null, icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
    { id: "properties", label: "Listings", section: null, badge: properties.filter(p => !p.available).length || 0, icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></> },
    { id: "bookings", label: "Bookings", section: null, icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
    { id: "disputes", label: "Disputes", section: "MODERATION", badge: 4, icon: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></> },
    { id: "reports", label: "Reports", section: null, icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></> },
    { id: "notifications", label: "Notifications", section: "SYSTEM", badge: 2, icon: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></> },
    { id: "payments", label: "Revenue", section: null, icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></> },
    { id: "logs", label: "Activity Logs", section: null, icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /></> },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2ed] text-[#1a2744] text-[1rem]" style={{ fontFamily: "'Outfit',sans-serif" }}>Loading admin panel…</div>
  );

  const thCls = "text-left text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] py-[11px] px-[18px] bg-[#faf9f7]";
  const tdCls = "py-3.5 px-[18px] text-[0.875rem] text-[#3d3730] border-t border-[#e2ddd6]";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .chart-bar { flex:1; background:rgba(42,124,111,0.18); border-radius:5px 5px 0 0; transition:all 0.25s ease; }
        .chart-bar:hover { background:rgba(42,124,111,0.45); }
        .chart-bar.highlight { background:rgba(26,39,68,0.5); }
        .adm-active::before { content:''; position:absolute; left:0; top:20%; bottom:20%; width:3px; background:#2a7c6f; border-radius:0 3px 3px 0; }
        @media(max-width:900px){
          .adm-sidebar-r { width:58px !important; padding:16px 8px !important; }
          .adm-sidebar-r .adm-sl-text, .adm-sidebar-r .adm-sl-sec, .adm-sidebar-r .adm-sl-badge { display:none; }
          .adm-main-r { margin-left:58px !important; padding:24px 16px !important; }
        }
      `}</style>

      <div className="flex min-h-screen" style={{ fontFamily: "'Outfit',sans-serif" }}>

        {/* SIDEBAR */}
        <aside className="adm-sidebar-r w-64 flex-shrink-0 bg-white border-r border-[#e2ddd6] px-3.5 py-6 fixed top-0 left-0 h-screen overflow-y-auto flex flex-col gap-0.5 z-[100]">
          <div className="text-[1.45rem] font-black text-[#1a2744] tracking-tight px-3 pb-5" style={{ fontFamily: "'Fraunces',serif" }}>
            PG<em className="text-[#2a7c6f] not-italic">Finder</em>
          </div>

          {sidebarLinks.map((link) => (
            <div key={link.id}>
              {link.section && <div className="adm-sl-sec text-[0.65rem] font-bold uppercase tracking-[2px] text-[#8a7f74] px-3 pt-4 pb-2">{link.section}</div>}
              <button
                className={`flex items-center gap-[11px] py-2.5 px-3.5 rounded-[10px] w-full text-left border-none cursor-pointer transition-all duration-300 relative text-[0.875rem] font-medium ${tab === link.id ? "adm-active bg-[rgba(26,39,68,0.07)] text-[#1a2744] font-semibold" : "bg-transparent text-[#3d3730] hover:bg-[#f0ede8] hover:text-[#1a2744]"}`}
                style={{ fontFamily: "'Outfit',sans-serif" }}
                onClick={() => setTab(link.id)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-[18px] h-[18px] flex-shrink-0 ${tab === link.id ? "text-[#1a2744]" : "text-[#8a7f74]"}`}>{link.icon}</svg>
                <span className="adm-sl-text">{link.label}</span>
                {link.badge > 0 && <span className="adm-sl-badge ml-auto bg-[#e05a3a] text-white text-[0.65rem] font-bold py-[2px] px-2 rounded-[20px] leading-[1.6]">{link.badge}</span>}
              </button>
            </div>
          ))}

          <div className="mt-auto" />
          <button className="flex items-center gap-[11px] py-2.5 px-3.5 rounded-[10px] w-full text-left border-none cursor-pointer bg-transparent text-[#3d3730] hover:bg-[#f0ede8] hover:text-[#1a2744] transition-all duration-300 text-[0.875rem] font-medium" style={{ fontFamily: "'Outfit',sans-serif" }} onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] flex-shrink-0 text-[#8a7f74]"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            <span className="adm-sl-text">Log Out</span>
          </button>
        </aside>

        {/* MAIN */}
        <main className="adm-main-r flex-1 ml-64 px-11 py-9 bg-[#f5f2ed] min-h-screen">

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Admin Dashboard</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Platform-wide overview and quick actions.</p>
                </div>
                <button className="bg-[#1a2744] text-white border-none py-2 px-4 rounded-[9px] text-[0.88rem] font-bold cursor-pointer hover:bg-[#243356] transition-all duration-300" style={{ fontFamily: "'Outfit',sans-serif" }}>Export Report</button>
              </div>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-[18px] mb-7">
                {[
                  { label: "Total Users", val: users.filter(u => u.role === "user").length || "48,240", sub: "↑ 1,204 this month", subUp: true, iconCls: "bg-[rgba(26,39,68,0.07)] text-[#1a2744]", icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
                  { label: "Active Listings", val: properties.filter(p => p.available).length || "12,400", sub: `${properties.filter(p => !p.available).length || 340} pending verify`, iconCls: "bg-[#e8f5f3] text-[#2a7c6f]", icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
                  { label: "Bookings Today", val: bookings.length || 87, sub: "↑ 14 vs yesterday", subUp: true, iconCls: "bg-[#eef2fb] text-[#3b6bcc]", icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
                  { label: "Open Disputes", val: 4, sub: "Needs attention", subDown: true, iconCls: "bg-[#fdf0ec] text-[#e05a3a]", icon: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /></> },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 transition-all duration-300 shadow-[0_2px_16px_rgba(26,39,68,0.08)] hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)] hover:-translate-y-0.5">
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center mb-3.5 ${s.iconCls}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">{s.icon}</svg>
                    </div>
                    <div className="text-[0.73rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-2">{s.label}</div>
                    <div className="text-[2rem] font-black text-[#1a2744] leading-none" style={{ fontFamily: "'Fraunces',serif" }}>{s.val}</div>
                    {s.sub && <div className={`text-[0.78rem] mt-1.5 ${s.subUp ? "text-[#2a7c6f]" : s.subDown ? "text-[#e05a3a]" : "text-[#8a7f74]"}`}>{s.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ddd6]">
                    <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Platform Growth</h3>
                    <span className="text-[#8a7f74] text-[0.8rem]">Bookings · Last 8 months</span>
                  </div>
                  <div className="p-6">
                    <div className="bg-[#faf9f7] rounded-[10px] h-[190px] flex items-end gap-2 px-4 pt-4 overflow-hidden">
                      {[30, 50, 45, 65, 80, 70, 92, 100].map((h, i) => (
                        <div key={i} className={`chart-bar${i === 7 ? " highlight" : ""}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ddd6]">
                    <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Top Cities by Bookings</h3>
                  </div>
                  <div className="p-6 flex flex-col gap-3.5">
                    {[["Bengaluru", 8400, 100, "bg-[#1a2744]"], ["Pune", 6100, 73, "bg-[#2a7c6f]"], ["Mumbai", 5200, 62, "bg-[#3b6bcc]"], ["Hyderabad", 3900, 46, "bg-[#e05a3a]"], ["Chennai", 2800, 33, "bg-[#c8922a]"]].map(([city, count, pct, cls]) => (
                      <div key={city} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[0.82rem]">
                          <span className="font-medium text-[#3d3730]">{city}</span>
                          <span className="text-[#8a7f74] font-semibold">{count.toLocaleString()}</span>
                        </div>
                        <div className="h-[7px] bg-[#f0ede8] rounded-[4px] overflow-hidden">
                          <div className={`h-full rounded-[4px] ${cls}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Platform Revenue */}
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ddd6]">
                  <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Revenue Overview</h3>
                  <button className="py-1.5 px-3.5 rounded-[8px] text-[0.78rem] font-semibold cursor-pointer border-none bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6] transition-all duration-300" onClick={() => setTab("payments")} style={{ fontFamily: "'Outfit',sans-serif" }}>View Payments</button>
                </div>
                <div className="grid grid-cols-3 divide-x divide-[#e2ddd6]">
                  {[
                    { label: "Total GMV", val: `₹${totalRevenue.toLocaleString()}`, sub: "Gross transaction volume" },
                    { label: `Platform Revenue (${PLATFORM_FEE_PCT}%)`, val: `₹${platformFeeCollected.toLocaleString()}`, sub: "Admin earnings", up: true },
                    { label: "Landlord Payouts", val: `₹${(totalRevenue - platformFeeCollected).toLocaleString()}`, sub: "Net paid to landlords" },
                  ].map(r => (
                    <div key={r.label} className="p-6">
                      <div className="text-[0.72rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-2">{r.label}</div>
                      <div className="text-[1.7rem] font-black text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>{r.val}</div>
                      <div className={`text-[0.78rem] mt-1 ${r.up ? "text-[#2a7c6f]" : "text-[#8a7f74]"}`}>{r.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ USERS ══ */}
          {tab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Users</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Manage all tenants and landlords on the platform.</p>
                </div>
                <input className="bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] py-2 px-3.5 text-[0.85rem] text-[#1a1a1a] outline-none transition-all duration-300 focus:border-[#2a7c6f]" placeholder="Search users…" value={userSearch} onChange={e => setUserSearch(e.target.value)} style={{ fontFamily: "'Outfit',sans-serif" }} />
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <table className="w-full border-collapse">
                  <thead><tr>{["Name", "Email", "Role", "Status", "Joined", "Actions"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u._id} className="hover:bg-[#faf9f7]">
                        <td className={tdCls}><strong>{u.firstName} {u.lastName}</strong></td>
                        <td className={`${tdCls} text-[#8a7f74]`}>{u.email}</td>
                        <td className={tdCls}><span className={u.role === "landlord" ? "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]" : "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#eef2fb] text-[#3b6bcc]"}>{u.role}</span></td>
                        <td className={tdCls}><span className={pillClass(u.status || "active")}><PillDot s={u.status || "active"} />{u.status || "active"}</span></td>
                        <td className={`${tdCls} text-[#8a7f74]`}>{fmt(u.createdAt)}</td>
                        <td className={tdCls}>
                          <div className="flex gap-1.5">
                            <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => toast.info("Block user requires admin API")}>Block</BtnSm>
                            <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]">View</BtnSm>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && <tr><td colSpan={6} className="text-center text-[#8a7f74] py-6">No users found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ PROPERTIES/LISTINGS ══ */}
          {tab === "properties" && (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Listings</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Manage all listed PG accommodations.</p>
                </div>
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <table className="w-full border-collapse">
                  <thead><tr>{["Property Name", "Landlord", "Location", "Rent", "Status", "Actions"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                  <tbody>
                    {properties.map(p => (
                      <tr key={p._id} className="hover:bg-[#faf9f7]">
                        <td className={tdCls}><strong>{p.pgName}</strong></td>
                        <td className={tdCls}>{p.landlordId?.firstName || "—"} {p.landlordId?.lastName || ""}</td>
                        <td className={tdCls}>{p.area ? `${p.area}, ` : ""}{p.city}</td>
                        <td className={tdCls}>₹{p.rent?.toLocaleString()}</td>
                        <td className={tdCls}><span className={p.available ? "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[rgba(42,124,111,0.1)] text-[#2a7c6f]" : "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf0ec] text-[#e05a3a]"}><span style={{ width: 6, height: 6, borderRadius: "50%", background: p.available ? "#2a7c6f" : "#e05a3a", display: "inline-block" }} />{p.available ? "Available" : "Paused"}</span></td>
                        <td className={tdCls}>
                          <div className="flex gap-1.5">
                            {p.available ? <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => toggleProperty(p)}>Pause</BtnSm> : <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => toggleProperty(p)}>Activate</BtnSm>}
                            <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => deleteProperty(p._id)}>Delete</BtnSm>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && <tr><td colSpan={6} className="text-center text-[#8a7f74] py-6">No properties found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ BOOKINGS ══ */}
          {tab === "bookings" && (
            <div>
              <div className="mb-8">
                <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>All Bookings</h1>
                <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Complete booking history across the platform.</p>
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <table className="w-full border-collapse">
                  <thead><tr>{["Tenant", "Property", "Check-In", "Check-Out", "Room", "Status", "Action"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id} className="hover:bg-[#faf9f7]">
                        <td className={tdCls}><strong>{b.tenantId?.firstName || "—"} {b.tenantId?.lastName || ""}</strong><br /><span className="text-[#8a7f74] text-[0.75rem]">{b.tenantId?.email}</span></td>
                        <td className={tdCls}>{b.pgId?.pgName || "—"}</td>
                        <td className={tdCls}>{fmt(b.checkInDate)}</td>
                        <td className={tdCls}>{fmt(b.checkOutDate)}</td>
                        <td className={`${tdCls} capitalize`}>{b.roomType}</td>
                        <td className={tdCls}><span className={pillClass(b.bookingStatus)}><PillDot s={b.bookingStatus} />{b.bookingStatus}</span></td>
                        <td className={tdCls}>
                          <div className="flex gap-1.5">
                            {b.bookingStatus === "pending" && <>
                              <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => updateBookingStatus(b._id, "confirmed")}>Confirm</BtnSm>
                              <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => updateBookingStatus(b._id, "cancelled")}>Cancel</BtnSm>
                            </>}
                            {b.bookingStatus !== "pending" && <span className="text-[#8a7f74] text-[0.78rem]">No action</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && <tr><td colSpan={7} className="text-center text-[#8a7f74] py-6">No bookings found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ DISPUTES ══ */}
          {tab === "disputes" && (
            <div>
              <div className="mb-8">
                <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Disputes</h1>
                <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Review and resolve platform disputes.</p>
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-14 text-center shadow-[0_2px_16px_rgba(26,39,68,0.08)]">
                <div className="text-[3rem] mb-4">⚖️</div>
                <h3 className="text-[1.2rem] font-bold text-[#1a2744] mb-2" style={{ fontFamily: "'Fraunces',serif" }}>Disputes Module</h3>
                <p className="text-[#8a7f74] text-[0.9rem]">Dispute management coming soon.</p>
              </div>
            </div>
          )}

          {/* ══ REPORTS ══ */}
          {tab === "reports" && (
            <div>
              <div className="mb-8">
                <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Reports</h1>
                <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Platform analytics and reports.</p>
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-14 text-center shadow-[0_2px_16px_rgba(26,39,68,0.08)]">
                <div className="text-[3rem] mb-4">📊</div>
                <h3 className="text-[1.2rem] font-bold text-[#1a2744] mb-2" style={{ fontFamily: "'Fraunces',serif" }}>Reports Module</h3>
                <p className="text-[#8a7f74] text-[0.9rem]">Advanced reporting coming soon.</p>
              </div>
            </div>
          )}

          {/* ══ NOTIFICATIONS ══ */}
          {tab === "notifications" && (
            <div>
              <div className="mb-8">
                <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Notifications</h1>
                <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">System-wide notifications and alerts.</p>
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-14 text-center shadow-[0_2px_16px_rgba(26,39,68,0.08)]">
                <div className="text-[3rem] mb-4">🔔</div>
                <p className="text-[#8a7f74] text-[0.9rem]">No new notifications.</p>
              </div>
            </div>
          )}

          {/* ══ PAYMENTS ══ */}
          {tab === "payments" && (
            <div>
              <div className="mb-8">
                <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Payments & Revenue</h1>
                <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Track all transactions and platform fee collection.</p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-[18px] mb-7">
                {[
                  { label: "Total Transaction Volume", val: `₹${totalRevenue.toLocaleString()}`, iconCls: "bg-[#fdf6e8] text-[#c8922a]", icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></> },
                  { label: `Platform Fee (${PLATFORM_FEE_PCT}%)`, val: `₹${platformFeeCollected.toLocaleString()}`, sub: "Admin earnings", subUp: true, iconCls: "bg-[#e8f5f3] text-[#2a7c6f]", icon: <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" /> },
                  { label: "Landlord Payouts", val: `₹${(totalRevenue - platformFeeCollected).toLocaleString()}`, sub: "Net to landlords", iconCls: "bg-[rgba(26,39,68,0.07)] text-[#1a2744]", icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
                  { label: "Successful Payments", val: payments.filter(p => p.paymentStatus === "success").length, iconCls: "bg-[#fdf0ec] text-[#e05a3a]", icon: <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></> },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 shadow-[0_2px_16px_rgba(26,39,68,0.08)] hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)] hover:-translate-y-0.5 transition-all duration-300">
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center mb-3.5 ${s.iconCls}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">{s.icon}</svg></div>
                    <div className="text-[0.73rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-2">{s.label}</div>
                    <div className="text-[1.5rem] font-black text-[#1a2744] leading-none" style={{ fontFamily: "'Fraunces',serif" }}>{s.val}</div>
                    {s.sub && <div className={`text-[0.78rem] mt-1.5 ${s.subUp ? "text-[#2a7c6f]" : "text-[#8a7f74]"}`}>{s.sub}</div>}
                  </div>
                ))}
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <div className="flex items-center px-6 py-5 border-b border-[#e2ddd6]"><h3 className="text-[0.95rem] font-bold text-[#1a2744]">All Transactions</h3></div>
                <table className="w-full border-collapse">
                  <thead><tr>{["Date", "Booking", "Tenant", "Property", "Amount", "Platform Fee", "Landlord Gets", "Method", "Status"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                  <tbody>
                    {payments.map(p => {
                      const fee = p.platformFee || Math.round((p.amount || 0) * PLATFORM_FEE_PCT / 100);
                      const landlordAmt = p.landlordAmount || ((p.amount || 0) - fee);
                      return (
                        <tr key={p._id} className="hover:bg-[#faf9f7]">
                          <td className={`${tdCls} text-[#8a7f74] whitespace-nowrap`}>{fmt(p.createdAt)}</td>
                          <td className={tdCls}><strong className="text-[#1a2744] text-[0.78rem]">#{p._id?.slice(-6).toUpperCase()}</strong></td>
                          <td className={tdCls}>{p.userId?.firstName || "—"}</td>
                          <td className={tdCls}>{p.bookingId?.pgId?.pgName || "—"}</td>
                          <td className={`${tdCls} font-semibold`}>₹{p.amount?.toLocaleString()}</td>
                          <td className={`${tdCls} text-[#2a7c6f] font-semibold`}>₹{fee.toLocaleString()}</td>
                          <td className={tdCls}>₹{landlordAmt.toLocaleString()}</td>
                          <td className={`${tdCls} capitalize`}>{p.paymentMethod}</td>
                          <td className={tdCls}><span className={pillClass(p.paymentStatus)}><PillDot s={p.paymentStatus} />{p.paymentStatus}</span></td>
                        </tr>
                      );
                    })}
                    {payments.length === 0 && <tr><td colSpan={9} className="text-center text-[#8a7f74] py-6">No payments yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ ACTIVITY LOGS ══ */}
          {tab === "logs" && (
            <div>
              <div className="mb-8">
                <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Activity Logs</h1>
                <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">System-wide audit trail of all actions.</p>
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <table className="w-full border-collapse">
                  <thead><tr>{["Date", "User", "Activity", "Description"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                  <tbody>
                    {logs.map((l, i) => (
                      <tr key={l._id || i} className="hover:bg-[#faf9f7]">
                        <td className={`${tdCls} text-[#8a7f74] whitespace-nowrap`}>{fmt(l.createdAt)}</td>
                        <td className={tdCls}>{l.userId?.firstName || "System"}</td>
                        <td className={tdCls}><span className="inline-flex items-center text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#eef2fb] text-[#3b6bcc]">{l.activity || "—"}</span></td>
                        <td className={tdCls}>{l.description || "—"}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && <tr><td colSpan={4} className="text-center text-[#8a7f74] py-6">No activity logs found.</td></tr>}
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