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
  if (v === "confirmed" || v === "active" || v === "available")
    return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[rgba(42,124,111,0.1)] text-[#2a7c6f]";
  if (v === "cancelled" || v === "paused")
    return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf0ec] text-[#e05a3a]";
  return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]";
};

const PillDot = ({ status }) => {
  const color = !status ? "#c8922a" : status === "confirmed" || status === "active" ? "#2a7c6f" : status === "cancelled" || status === "paused" ? "#e05a3a" : "#c8922a";
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />;
};

const inputCls = "bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] text-[#1a1a1a] text-[0.9rem] py-3 px-3.5 outline-none w-full transition-all duration-300 resize-none focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.1)] focus:bg-white";
const labelCls = "text-[0.7rem] font-bold uppercase tracking-[0.9px] text-[#8a7f74] block mb-1.5";

const BtnSm = ({ cls, onClick, children, type = "button" }) => (
  <button type={type} className={`py-1.5 px-3.5 rounded-[8px] text-[0.78rem] font-semibold cursor-pointer border-none transition-all duration-300 hover:-translate-y-px ${cls}`} style={{ fontFamily: "'Outfit',sans-serif" }} onClick={onClick}>{children}</button>
);

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ pgName: "", city: "", area: "", address: "", rent: "", roomType: "single", gender: "unisex", description: "", available: true });
  const [selAmenities, setSelAmenities] = useState([]);
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

  useEffect(() => { loadProperties(); loadBookings(); loadPayments(); }, [userId]);

  const myPropIds = properties.map(p => p._id);
  const myBookings = bookings.filter(b => myPropIds.includes(b.pgId?._id || b.pgId));
  const pendingBookings = myBookings.filter(b => b.bookingStatus === "pending");
  const myRevenue = payments.filter(p => myPropIds.includes(p.bookingId?.pgId)).reduce((s, p) => s + (p.landlordAmount || p.amount || 0), 0);

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
  const submitProperty = async (e) => {
    e.preventDefault();
    if (!userId) { toast.error("Login required"); return; }
    try {
      await axios.post(`/users/${userId}/properties`, { ...form, amenities: selAmenities, rent: Number(form.rent) });
      toast.success("Property listed!");
      setForm({ pgName: "", city: "", area: "", address: "", rent: "", roomType: "single", gender: "unisex", description: "", available: true });
      setSelAmenities([]); loadProperties(); setTab("properties");
    } catch { toast.error("Failed to list property"); }
  };
  const handleLogout = () => { localStorage.clear(); toast.success("Logged out"); navigate("/"); };

  const sidebarLinks = [
    { id: "overview", label: "Dashboard", section: "OVERVIEW", icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /> },
    { id: "properties", label: "My Properties", section: null, icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></> },
    { id: "bookings", label: "Bookings", section: null, badge: pendingBookings.length, icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
    { id: "add", label: "Add Property", section: "MANAGE", icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></> },
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
                          <div className="h-[7px] bg-[#f0ede8] rounded-[4px] overflow-hidden">
                            <div className={`h-full rounded-[4px] transition-all duration-700 ${colors[i % 4]}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    }) : <p className="text-[#8a7f74] text-[0.87rem]">No properties yet.</p>}
                  </div>
                </div>
              </div>

              {/* Recent bookings table */}
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ddd6]">
                  <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Recent Booking Requests</h3>
                  <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => setTab("bookings")}>View All</BtnSm>
                </div>
                <table className="w-full border-collapse">
                  <thead><tr>
                    {["Tenant", "Property", "Room", "Date", "Status", "Action"].map(h => <th key={h} className={thCls}>{h}</th>)}
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
                      return (
                        <tr key={b._id} className="hover:bg-[#faf9f7]">
                          <td className={tdCls}><strong>{b.tenantId?.firstName || "—"} {b.tenantId?.lastName || ""}</strong><br /><span className="text-[#8a7f74] text-[0.75rem]">{b.tenantId?.email}</span></td>
                          <td className={tdCls}>{b.pgId?.pgName || "—"}</td>
                          <td className={tdCls}>{fmt(b.checkInDate)}</td>
                          <td className={tdCls}>{months} month{months !== 1 ? "s" : ""}</td>
                          <td className={tdCls}>₹{amount.toLocaleString()}</td>
                          <td className={tdCls}><span className={pillCls(b.bookingStatus)}><PillDot status={b.bookingStatus} />{b.bookingStatus}</span></td>
                          <td className={tdCls}>
                            <div className="flex gap-1.5">
                              {b.bookingStatus === "pending" && <>
                                <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => updateStatus(b._id, "confirmed")}>Accept</BtnSm>
                                <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => updateStatus(b._id, "cancelled")}>Decline</BtnSm>
                              </>}
                              {b.bookingStatus === "confirmed" && <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]">Receipt</BtnSm>}
                              {b.bookingStatus === "cancelled" && <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]">View</BtnSm>}
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
                    </div>
                    <button type="submit" className="w-full py-3.5 rounded-[12px] bg-[#2a7c6f] text-white border-none text-[1rem] font-bold cursor-pointer mt-2 transition-all duration-300 hover:bg-[#3a9e8e] hover:-translate-y-px" style={{ fontFamily: "'Outfit',sans-serif" }}>
                      Publish Listing →
                    </button>
                  </form>
                </div>
              </div>
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
                {["Coming soon — messaging feature is under development."].map((msg, i) => (
                  <div key={i} className="px-6 py-14 text-center text-[#8a7f74]">{msg}</div>
                ))}
              </div>
            </div>
          )}

          {/* ══ EARNINGS ══ */}
          {tab === "earnings" && <EarningsTab payments={payments} myBookings={myBookings} />}

        </main>
      </div>
    </>
  );
}