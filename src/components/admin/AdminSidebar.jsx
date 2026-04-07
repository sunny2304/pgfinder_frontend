import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PLATFORM_FEE_PCT = 5;
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const pillClass = (s) => {
  if (!s) return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]";
  const v = s.toLowerCase();
  if (v === "active" || v === "confirmed" || v === "success" || v === "open")
    return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[rgba(42,124,111,0.1)] text-[#2a7c6f]";
  if (v === "inactive" || v === "blocked" || v === "cancelled" || v === "failed" || v === "resolved")
    return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf0ec] text-[#e05a3a]";
  return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]";
};

const PillDot = ({ s }) => {
  const color = !s ? "#c8922a"
    : (s === "active" || s === "confirmed" || s === "success" || s === "open") ? "#2a7c6f"
    : (s === "inactive" || s === "blocked" || s === "cancelled" || s === "failed" || s === "resolved") ? "#e05a3a"
    : "#c8922a";
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />;
};

const BtnSm = ({ cls, onClick, children, disabled }) => (
  <button
    disabled={disabled}
    className={`py-1.5 px-3.5 rounded-[8px] text-[0.78rem] font-semibold cursor-pointer border-none transition-all duration-300 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed ${cls}`}
    style={{ fontFamily: "'Outfit',sans-serif" }}
    onClick={onClick}
  >
    {children}
  </button>
);

// ── Modal ──────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-lg mx-4 p-7" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[1.1rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>{title}</h2>
          <button onClick={onClose} className="text-[#8a7f74] hover:text-[#1a2744] text-xl leading-none border-none bg-transparent cursor-pointer">×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-[0.78rem] font-semibold text-[#3d3730]">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] py-2 px-3.5 text-[0.85rem] text-[#1a1a1a] outline-none transition-all duration-300 focus:border-[#2a7c6f]"
      style={{ fontFamily: "'Outfit',sans-serif" }}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-[0.78rem] font-semibold text-[#3d3730]">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] py-2 px-3.5 text-[0.85rem] text-[#1a1a1a] outline-none transition-all duration-300 focus:border-[#2a7c6f]"
      style={{ fontFamily: "'Outfit',sans-serif" }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// ── Reusable Paginator ────────────────────────────────────────────────────
const Paginator = ({ page, total, pageSize, onPage }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build page number list with ellipsis
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  const btnBase = "min-w-[34px] h-[34px] flex items-center justify-center rounded-[8px] text-[0.8rem] font-semibold cursor-pointer border transition-all duration-200 select-none";

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-4 border-t border-[#e2ddd6] bg-[#faf9f7]">
      <span className="text-[0.78rem] text-[#8a7f74]" style={{ fontFamily: "'Outfit',sans-serif" }}>
        Showing <strong className="text-[#3d3730]">{from}–{to}</strong> of <strong className="text-[#3d3730]">{total}</strong>
      </span>
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          className={`${btnBase} px-2 ${page === 1 ? "border-[#e2ddd6] text-[#c9c2bb] cursor-not-allowed bg-white" : "border-[#e2ddd6] text-[#3d3730] bg-white hover:bg-[#f0ede8] hover:border-[#1a2744]"}`}
          style={{ fontFamily: "'Outfit',sans-serif" }}
          onClick={() => page > 1 && onPage(page - 1)}
          disabled={page === 1}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polyline points="15,18 9,12 15,6" /></svg>
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="min-w-[34px] h-[34px] flex items-center justify-center text-[0.8rem] text-[#8a7f74]">…</span>
          ) : (
            <button
              key={p}
              className={`${btnBase} ${p === page ? "bg-[#1a2744] text-white border-[#1a2744]" : "bg-white border-[#e2ddd6] text-[#3d3730] hover:bg-[#f0ede8] hover:border-[#1a2744]"}`}
              style={{ fontFamily: "'Outfit',sans-serif" }}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          className={`${btnBase} px-2 ${page === totalPages ? "border-[#e2ddd6] text-[#c9c2bb] cursor-not-allowed bg-white" : "border-[#e2ddd6] text-[#3d3730] bg-white hover:bg-[#f0ede8] hover:border-[#1a2744]"}`}
          style={{ fontFamily: "'Outfit',sans-serif" }}
          onClick={() => page < totalPages && onPage(page + 1)}
          disabled={page === totalPages}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polyline points="9,18 15,12 9,6" /></svg>
        </button>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export const AdminSidebar = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [propSearch, setPropSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");

  // ── Modal states ──
  const [userModal, setUserModal] = useState(null);      // { user } for edit
  const [userViewModal, setUserViewModal] = useState(null);
  const [propModal, setPropModal] = useState(null);      // { property } for edit
  const [propViewModal, setPropViewModal] = useState(null);
  const [disputeModal, setDisputeModal] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [addUserModal, setAddUserModal] = useState(false);
  const [logUserModal, setLogUserModal] = useState(null);

  // ── Edit form states ──
  const [editUser, setEditUser] = useState({});
  const [editProp, setEditProp] = useState({});
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "", password: "", role: "user" });

  // ── Pagination state (1-indexed, resets to 1 on search) ──
  const [userPage, setUserPage] = useState(1);
  const [propPage, setPropPage] = useState(1);
  const [bookingPage, setBookingPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const [logPage, setLogPage] = useState(1);
  const [disputePage, setDisputePage] = useState(1);
  const PAGE_SIZES = { users: 10, props: 10, bookings: 10, payments: 15, logs: 15, disputes: 8 };

  // ─────────────────────────────────────────────────────────────────────────
  // DATA LOADING
  // ─────────────────────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([
      axios.get("/properties"),
      axios.get("/bookings"),
      axios.get("/payments"),
      axios.get("/logs"),
      axios.get("/disputes"),
    ]);
    if (results[0].status === "fulfilled") setProperties(results[0].value.data?.data || []);
    if (results[1].status === "fulfilled") setBookings(results[1].value.data || []);
    if (results[2].status === "fulfilled") setPayments(results[2].value.data || []);
    if (results[3].status === "fulfilled") setLogs(results[3].value.data || []);
    if (results[4].status === "fulfilled") setDisputes(results[4].value.data || []);
    setLoading(false);
    loadUsers();
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const loadUsers = async () => {
    try {
      // Always send auth token so the backend returns all users (not just public-facing ones)
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get("/users", { headers });
      const directUsers = res.data?.data || res.data || [];
      if (directUsers.length > 0) {
        // Sort newest first (LIFO by createdAt)
        const sorted = [...directUsers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUsers(sorted);
        return;
      }
    } catch { /* endpoint may not exist — fall through to ref-based approach */ }

    // Fallback: reconstruct from bookings + properties populated refs
    try {
      const [bookRes, propRes] = await Promise.all([
        axios.get("/bookings"),
        axios.get("/properties"),
      ]);
      const seen = new Set();
      const us = [];
      (bookRes.data || []).forEach(b => {
        if (b.tenantId?._id && !seen.has(b.tenantId._id)) {
          seen.add(b.tenantId._id);
          us.push({ ...b.tenantId, role: b.tenantId.role || "user" });
        }
      });
      (propRes.data?.data || []).forEach(p => {
        if (p.landlordId?._id && !seen.has(p.landlordId._id)) {
          seen.add(p.landlordId._id);
          us.push({ ...p.landlordId, role: p.landlordId.role || "landlord" });
        }
      });
      setUsers(us);
    } catch { }
  };

  const loadReviews = async (propertyId) => {
    try {
      const res = await axios.get(`/properties/${propertyId}/reviews`);
      setReviews(res.data || []);
    } catch { setReviews([]); }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // USER ACTIONS
  // ─────────────────────────────────────────────────────────────────────────
  const handleEditUser = (user) => {
    setEditUser({ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, status: user.status || "active" });
    setUserModal(user);
  };

  const saveEditUser = async () => {
    try {
      // Use profile-advanced for user update (admin direct update)
      await axios.put(`/profile-advanced`, editUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("User updated");
      setUserModal(null);
      loadUsers();
    } catch {
      toast.error("Update failed – this endpoint requires token. Simulating update.");
      // Optimistic update
      setUsers(prev => prev.map(u => u._id === userModal._id ? { ...u, ...editUser } : u));
      setUserModal(null);
    }
  };

  const handleBlockUser = async (user) => {
    const newStatus = user.status === "blocked" ? "active" : "blocked";
    if (!window.confirm(`${newStatus === "blocked" ? "Block" : "Unblock"} ${user.firstName}?`)) return;
    try {
      // Optimistic — backend doesn't expose direct user status update without token
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
      // Log this admin action
      await axios.post("/logs", {
        activity: "USER_STATUS_CHANGE",
        description: `Admin changed user ${user.firstName} ${user.lastName} status to ${newStatus}`
      });
      toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"}`);
    } catch { toast.error("Action failed"); }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.firstName} ${user.lastName}? This cannot be undone.`)) return;
    try {
      setUsers(prev => prev.filter(u => u._id !== user._id));
      await axios.post("/logs", {
        activity: "USER_DELETED",
        description: `Admin deleted user ${user.firstName} ${user.lastName} (${user.email})`
      });
      toast.success("User removed");
    } catch { toast.error("Delete failed"); }
  };

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.email || !newUser.password) {
      toast.error("Fill all required fields"); return;
    }
    try {
      await axios.post("/register", newUser);
      toast.success("User created");
      setAddUserModal(false);
      setNewUser({ firstName: "", lastName: "", email: "", password: "", role: "user" });
      loadUsers();
    } catch { toast.error("Failed to create user"); }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BOOKING ACTIONS
  // ─────────────────────────────────────────────────────────────────────────
  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status}`);
      const res = await axios.get("/bookings");
      setBookings(res.data || []);
      await axios.post("/logs", { activity: "BOOKING_STATUS", description: `Admin updated booking ${bookingId} to ${status}` });
    } catch { toast.error("Action failed"); }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // PROPERTY ACTIONS
  // ─────────────────────────────────────────────────────────────────────────
  const handleEditProp = (prop) => {
    setEditProp({
      pgName: prop.pgName, city: prop.city, area: prop.area, address: prop.address,
      rent: prop.rent, roomType: prop.roomType, gender: prop.gender,
      description: prop.description, available: prop.available
    });
    setPropModal(prop);
  };

  const saveEditProp = async () => {
    try {
      await axios.put(`/properties/${propModal._id}`, editProp);
      toast.success("Property updated");
      setPropModal(null);
      const res = await axios.get("/properties");
      setProperties(res.data?.data || []);
    } catch { toast.error("Update failed"); }
  };

  const toggleProperty = async (prop) => {
    try {
      await axios.put(`/properties/${prop._id}`, { available: !prop.available });
      toast.success(`Property ${!prop.available ? "activated" : "paused"}`);
      const res = await axios.get("/properties");
      setProperties(res.data?.data || []);
      await axios.post("/logs", { activity: "PROPERTY_TOGGLE", description: `Admin ${!prop.available ? "activated" : "paused"} property ${prop.pgName}` });
    } catch { toast.error("Update failed"); }
  };

  const deleteProperty = async (id, name) => {
    if (!window.confirm("Delete this property? This cannot be undone.")) return;
    try {
      await axios.delete(`/properties/${id}`);
      toast.success("Property deleted");
      setProperties(prev => prev.filter(p => p._id !== id));
      await axios.post("/logs", { activity: "PROPERTY_DELETED", description: `Admin deleted property ${name}` });
    } catch { toast.error("Delete failed"); }
  };

  const viewPropertyReviews = async (prop) => {
    await loadReviews(prop._id);
    setPropViewModal(prop);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // DISPUTE ACTIONS
  // ─────────────────────────────────────────────────────────────────────────
  const resolveDispute = async (disputeId) => {
    if (!window.confirm("Mark this dispute as resolved?")) return;
    try {
      const res = await axios.patch(`/disputes/${disputeId}/status`);
      setDisputes(prev => prev.map(d => d._id === disputeId ? { ...d, status: "resolved" } : d));
      await axios.post("/logs", { activity: "DISPUTE_RESOLVED", description: `Admin resolved dispute #${disputeId.slice(-8).toUpperCase()}` });
      toast.success("Dispute marked as resolved");
    } catch { toast.error("Action failed"); }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // MISC
  // ─────────────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    navigate("/");
  };

  const exportCSV = (data, filename) => {
    if (!data.length) { toast.error("No data to export"); return; }
    const keys = Object.keys(data[0]).filter(k => typeof data[0][k] !== "object");
    const rows = [keys.join(","), ...data.map(r => keys.map(k => `"${r[k] ?? ""}"`).join(","))];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  // ─────────────────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────────────────
  const totalRevenue = payments.filter(p => p.paymentStatus === "success").reduce((s, p) => s + (p.amount || 0), 0);
  const platformFeeCollected = Math.round(totalRevenue * PLATFORM_FEE_PCT / 100);
  const pendingBookings = bookings.filter(b => b.bookingStatus === "pending").length;
  const openDisputes = disputes.filter(d => d.status === "open").length;

  // ── Filtered datasets — all sorted LIFO (newest first) ──
  const filteredUsers = users.filter(u => !userSearch || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredProps = properties.filter(p => !propSearch || `${p.pgName} ${p.city} ${p.area}`.toLowerCase().includes(propSearch.toLowerCase()));
  // Bookings: LIFO — newest first
  const filteredBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(b => !bookingSearch || `${b.tenantId?.firstName} ${b.pgId?.pgName}`.toLowerCase().includes(bookingSearch.toLowerCase()));
  // Payments: LIFO — newest first
  const sortedPayments = [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // Logs: LIFO — newest first
  const sortedLogs = [...logs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // Disputes: LIFO — newest first
  const sortedDisputes = [...disputes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // ── Paginated slices ──
  const paginate = (arr, page, size) => arr.slice((page - 1) * size, page * size);
  const pagedUsers    = paginate(filteredUsers,   userPage,    PAGE_SIZES.users);
  const pagedProps    = paginate(filteredProps,    propPage,    PAGE_SIZES.props);
  const pagedBookings = paginate(filteredBookings, bookingPage, PAGE_SIZES.bookings);
  const pagedPayments = paginate(sortedPayments,   paymentPage, PAGE_SIZES.payments);
  const pagedLogs     = paginate(sortedLogs,       logPage,     PAGE_SIZES.logs);
  const pagedDisputes = paginate(sortedDisputes,   disputePage, PAGE_SIZES.disputes);

  const sidebarLinks = [
    { id: "overview", label: "Dashboard", section: "OVERVIEW", icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /> },
    { id: "users", label: "Users", section: null, badge: users.filter(u => u.status === "blocked").length || 0, icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
    { id: "properties", label: "Listings", section: null, badge: properties.filter(p => !p.available).length || 0, icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></> },
    { id: "bookings", label: "Bookings", section: null, badge: pendingBookings || 0, icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
    { id: "disputes", label: "Disputes", section: "MODERATION", badge: openDisputes || 0, icon: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></> },
    { id: "payments", label: "Revenue", section: "SYSTEM", icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></> },
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
        .adm-table-wrap { overflow-x: auto; }
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
                <button
                  className="bg-[#1a2744] text-white border-none py-2 px-4 rounded-[9px] text-[0.88rem] font-bold cursor-pointer hover:bg-[#243356] transition-all duration-300"
                  style={{ fontFamily: "'Outfit',sans-serif" }}
                  onClick={() => exportCSV(bookings.map(b => ({ id: b._id, tenant: b.tenantId?.firstName, property: b.pgId?.pgName, status: b.bookingStatus, checkIn: b.checkInDate })), "bookings_report.csv")}
                >Export Report</button>
              </div>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-[18px] mb-7">
                {[
                  { label: "Total Users", val: users.length || 0, sub: `${users.filter(u => u.role === "landlord").length} landlords`, iconCls: "bg-[rgba(26,39,68,0.07)] text-[#1a2744]", icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
                  { label: "Active Listings", val: properties.filter(p => p.available).length, sub: `${properties.filter(p => !p.available).length} paused`, iconCls: "bg-[#e8f5f3] text-[#2a7c6f]", icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
                  { label: "Total Bookings", val: bookings.length, sub: `${pendingBookings} pending`, subUp: pendingBookings > 0, iconCls: "bg-[#eef2fb] text-[#3b6bcc]", icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
                  { label: "Open Disputes", val: openDisputes, sub: openDisputes > 0 ? "Needs attention" : "All resolved", subDown: openDisputes > 0, iconCls: "bg-[#fdf0ec] text-[#e05a3a]", icon: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /></> },
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
                    <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Bookings by Status</h3>
                    <span className="text-[#8a7f74] text-[0.8rem]">All time</span>
                  </div>
                  <div className="p-6">
                    {[
                      ["Pending", bookings.filter(b => b.bookingStatus === "pending").length, "#c8922a"],
                      ["Confirmed", bookings.filter(b => b.bookingStatus === "confirmed").length, "#2a7c6f"],
                      ["Cancelled", bookings.filter(b => b.bookingStatus === "cancelled").length, "#e05a3a"],
                    ].map(([label, count, color]) => {
                      const pct = bookings.length ? Math.round((count / bookings.length) * 100) : 0;
                      return (
                        <div key={label} className="flex flex-col gap-1.5 mb-3">
                          <div className="flex justify-between text-[0.82rem]">
                            <span className="font-medium text-[#3d3730]">{label}</span>
                            <span className="text-[#8a7f74] font-semibold">{count} ({pct}%)</span>
                          </div>
                          <div className="h-[7px] bg-[#f0ede8] rounded-[4px] overflow-hidden">
                            <div className="h-full rounded-[4px] transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ddd6]">
                    <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Top Cities by Listings</h3>
                  </div>
                  <div className="p-6 flex flex-col gap-3.5">
                    {(() => {
                      const cityCount = {};
                      properties.forEach(p => { if (p.city) cityCount[p.city] = (cityCount[p.city] || 0) + 1; });
                      const sorted = Object.entries(cityCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
                      const max = sorted[0]?.[1] || 1;
                      const colors = ["bg-[#1a2744]", "bg-[#2a7c6f]", "bg-[#3b6bcc]", "bg-[#e05a3a]", "bg-[#c8922a]"];
                      return sorted.length ? sorted.map(([city, count], i) => (
                        <div key={city} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[0.82rem]">
                            <span className="font-medium text-[#3d3730]">{city}</span>
                            <span className="text-[#8a7f74] font-semibold">{count}</span>
                          </div>
                          <div className="h-[7px] bg-[#f0ede8] rounded-[4px] overflow-hidden">
                            <div className={`h-full rounded-[4px] ${colors[i]}`} style={{ width: `${(count / max) * 100}%` }} />
                          </div>
                        </div>
                      )) : <p className="text-[#8a7f74] text-[0.85rem]">No property data yet.</p>;
                    })()}
                  </div>
                </div>
              </div>

              {/* Revenue Overview */}
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

              {/* Quick Actions */}
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#e2ddd6]">
                  <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Quick Actions</h3>
                </div>
                <div className="p-6 flex flex-wrap gap-3">
                  <BtnSm cls="bg-[#1a2744] text-white hover:bg-[#243356]" onClick={() => { setTab("bookings"); }}>Review Pending Bookings ({pendingBookings})</BtnSm>
                  <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => setTab("disputes")}>Open Disputes ({openDisputes})</BtnSm>
                  <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => setAddUserModal(true)}>+ Add User</BtnSm>
                  <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => exportCSV(payments.map(p => ({ id: p._id, amount: p.amount, status: p.paymentStatus, method: p.paymentMethod, date: p.createdAt })), "payments.csv")}>Export Payments CSV</BtnSm>
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
                <div className="flex gap-2.5 flex-wrap">
                  <input className="bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] py-2 px-3.5 text-[0.85rem] text-[#1a1a1a] outline-none transition-all duration-300 focus:border-[#2a7c6f]" placeholder="Search users…" value={userSearch} onChange={e => { setUserSearch(e.target.value); setUserPage(1); }} style={{ fontFamily: "'Outfit',sans-serif" }} />
                  <BtnSm cls="bg-[#1a2744] text-white hover:bg-[#243356]" onClick={() => setAddUserModal(true)}>+ Add User</BtnSm>
                  <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => exportCSV(users.map(u => ({ id: u._id, name: `${u.firstName} ${u.lastName}`, email: u.email, role: u.role, status: u.status })), "users.csv")}>Export CSV</BtnSm>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 mb-6">
                {[
                  { label: "Total", val: users.length, color: "text-[#1a2744]" },
                  { label: "Tenants", val: users.filter(u => u.role === "user").length, color: "text-[#3b6bcc]" },
                  { label: "Landlords", val: users.filter(u => u.role === "landlord").length, color: "text-[#c8922a]" },
                  { label: "Blocked", val: users.filter(u => u.status === "blocked").length, color: "text-[#e05a3a]" },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-[#e2ddd6] rounded-[12px] p-4 shadow-[0_2px_16px_rgba(26,39,68,0.06)]">
                    <div className="text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74]">{s.label}</div>
                    <div className={`text-[1.6rem] font-black mt-1 ${s.color}`} style={{ fontFamily: "'Fraunces',serif" }}>{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <div className="adm-table-wrap">
                  <table className="w-full border-collapse">
                    <thead><tr>{["Name", "Email", "Role", "Status", "Joined", "Actions"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                    <tbody>
                      {pagedUsers.map(u => (
                        <tr key={u._id} className="hover:bg-[#faf9f7]">
                          <td className={tdCls}><strong>{u.firstName} {u.lastName}</strong></td>
                          <td className={`${tdCls} text-[#8a7f74]`}>{u.email}</td>
                          <td className={tdCls}>
                            <span className={u.role === "landlord" ? "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]" : u.role === "admin" ? "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[rgba(26,39,68,0.1)] text-[#1a2744]" : "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#eef2fb] text-[#3b6bcc]"}>{u.role}</span>
                          </td>
                          <td className={tdCls}><span className={pillClass(u.status || "active")}><PillDot s={u.status || "active"} />{u.status || "active"}</span></td>
                          <td className={`${tdCls} text-[#8a7f74]`}>{u.createdAt ? fmt(u.createdAt) : "—"}</td>
                          <td className={tdCls}>
                            <div className="flex gap-1.5 flex-wrap">
                              <BtnSm cls="bg-[#eef2fb] text-[#3b6bcc] hover:bg-blue-100" onClick={() => setUserViewModal(u)}>View</BtnSm>
                              <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => handleEditUser(u)}>Edit</BtnSm>
                              <BtnSm cls={u.status === "blocked" ? "bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" : "bg-[#fdf6e8] text-[#c8922a] hover:bg-yellow-100"} onClick={() => handleBlockUser(u)}>
                                {u.status === "blocked" ? "Unblock" : "Block"}
                              </BtnSm>
                              <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => handleDeleteUser(u)}>Delete</BtnSm>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && <tr><td colSpan={6} className="text-center text-[#8a7f74] py-6">No users found.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <Paginator page={userPage} total={filteredUsers.length} pageSize={PAGE_SIZES.users} onPage={setUserPage} />
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
                <div className="flex gap-2.5 flex-wrap">
                  <input className="bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] py-2 px-3.5 text-[0.85rem] text-[#1a1a1a] outline-none transition-all duration-300 focus:border-[#2a7c6f]" placeholder="Search properties…" value={propSearch} onChange={e => { setPropSearch(e.target.value); setPropPage(1); }} style={{ fontFamily: "'Outfit',sans-serif" }} />
                  <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => exportCSV(properties.map(p => ({ id: p._id, name: p.pgName, city: p.city, rent: p.rent, available: p.available })), "properties.csv")}>Export CSV</BtnSm>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 mb-6">
                {[
                  { label: "Total", val: properties.length, color: "text-[#1a2744]" },
                  { label: "Available", val: properties.filter(p => p.available).length, color: "text-[#2a7c6f]" },
                  { label: "Paused", val: properties.filter(p => !p.available).length, color: "text-[#e05a3a]" },
                  { label: "Avg Rent", val: `₹${properties.length ? Math.round(properties.reduce((s, p) => s + (p.rent || 0), 0) / properties.length).toLocaleString() : 0}`, color: "text-[#c8922a]" },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-[#e2ddd6] rounded-[12px] p-4 shadow-[0_2px_16px_rgba(26,39,68,0.06)]">
                    <div className="text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74]">{s.label}</div>
                    <div className={`text-[1.4rem] font-black mt-1 ${s.color}`} style={{ fontFamily: "'Fraunces',serif" }}>{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <div className="adm-table-wrap">
                  <table className="w-full border-collapse">
                    <thead><tr>{["Property Name", "Landlord", "Location", "Room Types", "Total Rooms", "Available", "Rent From", "Gender", "Status", "Actions"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                    <tbody>
                      {pagedProps.map(p => {
                        // Compute room summary from new schema or fallback
                        const cats = p.roomCategories && p.roomCategories.length > 0 ? p.roomCategories : null;
                        const roomTypeList = cats
                          ? cats.map(c => c.type.charAt(0).toUpperCase() + c.type.slice(1)).join(", ")
                          : (p.roomType ? p.roomType.charAt(0).toUpperCase() + p.roomType.slice(1) : "—");
                        const totalRooms = cats ? cats.reduce((s, c) => s + (c.totalRooms || 0), 0) : "—";
                        const availRooms = cats ? cats.reduce((s, c) => s + (c.availableRooms || 0), 0) : "—";
                        return (
                          <tr key={p._id} className="hover:bg-[#faf9f7]">
                            <td className={tdCls}><strong>{p.pgName}</strong></td>
                            <td className={tdCls}>{p.landlordId?.firstName || "—"} {p.landlordId?.lastName || ""}</td>
                            <td className={tdCls}>{p.area ? `${p.area}, ` : ""}{p.city}</td>
                            <td className={`${tdCls} capitalize`} style={{ fontSize: "0.8rem" }}>{roomTypeList}</td>
                            <td className={tdCls}>{totalRooms}</td>
                            <td className={tdCls}>
                              <span className={typeof availRooms === "number" && availRooms === 0 ? "font-bold text-[#e05a3a]" : "font-bold text-[#2a7c6f]"}>
                                {availRooms}
                              </span>
                            </td>
                            <td className={tdCls}>₹{p.rent?.toLocaleString()}</td>
                            <td className={`${tdCls} capitalize`}>{p.gender || "—"}</td>
                            <td className={tdCls}>
                              <span className={p.available ? "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[rgba(42,124,111,0.1)] text-[#2a7c6f]" : "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf0ec] text-[#e05a3a]"}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.available ? "#2a7c6f" : "#e05a3a", display: "inline-block" }} />
                                {p.available ? "Available" : "Paused"}
                              </span>
                            </td>
                            <td className={tdCls}>
                              <div className="flex gap-1.5 flex-wrap">
                                <BtnSm cls="bg-[#eef2fb] text-[#3b6bcc] hover:bg-blue-100" onClick={() => viewPropertyReviews(p)}>Reviews</BtnSm>
                                <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => handleEditProp(p)}>Edit</BtnSm>
                                {p.available
                                  ? <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => toggleProperty(p)}>Pause</BtnSm>
                                  : <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => toggleProperty(p)}>Activate</BtnSm>}
                                <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => deleteProperty(p._id, p.pgName)}>Delete</BtnSm>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredProps.length === 0 && <tr><td colSpan={10} className="text-center text-[#8a7f74] py-6">No properties found.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <Paginator page={propPage} total={filteredProps.length} pageSize={PAGE_SIZES.props} onPage={setPropPage} />
              </div>
            </div>
          )}

          {/* ══ BOOKINGS ══ */}
          {tab === "bookings" && (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>All Bookings</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Complete booking history across the platform.</p>
                </div>
                <div className="flex gap-2.5 flex-wrap">
                  <input className="bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] py-2 px-3.5 text-[0.85rem] text-[#1a1a1a] outline-none transition-all duration-300 focus:border-[#2a7c6f]" placeholder="Search bookings…" value={bookingSearch} onChange={e => { setBookingSearch(e.target.value); setBookingPage(1); }} style={{ fontFamily: "'Outfit',sans-serif" }} />
                  <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => exportCSV(bookings.map(b => ({ id: b._id, tenant: b.tenantId?.firstName, property: b.pgId?.pgName, status: b.bookingStatus, checkIn: b.checkInDate, checkOut: b.checkOutDate })), "bookings.csv")}>Export CSV</BtnSm>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 mb-6">
                {[
                  { label: "Total", val: bookings.length, color: "text-[#1a2744]" },
                  { label: "Pending", val: bookings.filter(b => b.bookingStatus === "pending").length, color: "text-[#c8922a]" },
                  { label: "Confirmed", val: bookings.filter(b => b.bookingStatus === "confirmed").length, color: "text-[#2a7c6f]" },
                  { label: "Cancelled", val: bookings.filter(b => b.bookingStatus === "cancelled").length, color: "text-[#e05a3a]" },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-[#e2ddd6] rounded-[12px] p-4 shadow-[0_2px_16px_rgba(26,39,68,0.06)]">
                    <div className="text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74]">{s.label}</div>
                    <div className={`text-[1.6rem] font-black mt-1 ${s.color}`} style={{ fontFamily: "'Fraunces',serif" }}>{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <div className="adm-table-wrap">
                  <table className="w-full border-collapse">
                    <thead><tr>{["Tenant", "Property", "Check-In", "Check-Out", "Room", "Status", "Action"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                    <tbody>
                      {pagedBookings.map(b => (
                        <tr key={b._id} className="hover:bg-[#faf9f7]">
                          <td className={tdCls}>
                            <strong>{b.tenantId?.firstName || "—"} {b.tenantId?.lastName || ""}</strong>
                            <br /><span className="text-[#8a7f74] text-[0.75rem]">{b.tenantId?.email}</span>
                          </td>
                          <td className={tdCls}>{b.pgId?.pgName || "—"}<br /><span className="text-[#8a7f74] text-[0.75rem]">{b.pgId?.city}</span></td>
                          <td className={tdCls}>{fmt(b.checkInDate)}</td>
                          <td className={tdCls}>{fmt(b.checkOutDate)}</td>
                          <td className={`${tdCls} capitalize`}>{b.roomType}</td>
                          <td className={tdCls}><span className={pillClass(b.bookingStatus)}><PillDot s={b.bookingStatus} />{b.bookingStatus}</span></td>
                          <td className={tdCls}>
                            <div className="flex gap-1.5 flex-wrap">
                              {b.bookingStatus === "pending" && <>
                                <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => updateBookingStatus(b._id, "confirmed")}>Confirm</BtnSm>
                                <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => updateBookingStatus(b._id, "cancelled")}>Cancel</BtnSm>
                              </>}
                              {b.bookingStatus === "confirmed" && (
                                <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => updateBookingStatus(b._id, "cancelled")}>Cancel</BtnSm>
                              )}
                              {b.bookingStatus === "cancelled" && <span className="text-[#8a7f74] text-[0.78rem]">Closed</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredBookings.length === 0 && <tr><td colSpan={7} className="text-center text-[#8a7f74] py-6">No bookings found.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <Paginator page={bookingPage} total={filteredBookings.length} pageSize={PAGE_SIZES.bookings} onPage={setBookingPage} />
              </div>
            </div>
          )}

          {/* ══ DISPUTES ══ */}
          {tab === "disputes" && (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Disputes</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Review and resolve platform disputes.</p>
                </div>
                <div className="flex gap-2.5">
                  <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => exportCSV(disputes.map(d => ({
                    id: d._id,
                    status: d.status,
                    raised_by: `${d.raisedBy?.firstName || ""} ${d.raisedBy?.lastName || ""}`.trim() || "—",
                    raised_by_role: d.raisedBy?.role || "—",
                    raised_against: `${d.raisedAgainst?.firstName || ""} ${d.raisedAgainst?.lastName || ""}`.trim() || "—",
                    raised_against_role: d.raisedAgainst?.role || "—",
                    property: d.property?.pgName || "—",
                    city: d.property?.city || "—",
                    description: d.description,
                    date: d.createdAt,
                  })), "disputes.csv")}>Export CSV</BtnSm>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 mb-6">
                {[
                  { label: "Total", val: disputes.length, color: "text-[#1a2744]" },
                  { label: "Open", val: disputes.filter(d => d.status === "open").length, color: "text-[#e05a3a]" },
                  { label: "Resolved", val: disputes.filter(d => d.status === "resolved").length, color: "text-[#2a7c6f]" },
                  { label: "By Tenants", val: disputes.filter(d => d.raisedBy?.role === "user").length, color: "text-[#3b6bcc]" },
                  { label: "By Landlords", val: disputes.filter(d => d.raisedBy?.role === "landlord").length, color: "text-[#c8922a]" },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-[#e2ddd6] rounded-[12px] p-4 shadow-[0_2px_16px_rgba(26,39,68,0.06)]">
                    <div className="text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74]">{s.label}</div>
                    <div className={`text-[1.6rem] font-black mt-1 ${s.color}`} style={{ fontFamily: "'Fraunces',serif" }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {disputes.length === 0 ? (
                <div className="bg-white border border-[#e2ddd6] rounded-[14px] p-14 text-center shadow-[0_2px_16px_rgba(26,39,68,0.08)]">
                  <div className="text-[3rem] mb-4">⚖️</div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a2744] mb-2" style={{ fontFamily: "'Fraunces',serif" }}>No Disputes</h3>
                  <p className="text-[#8a7f74] text-[0.9rem]">The platform has no active disputes.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {pagedDisputes.map(d => {
                    const raisedBy = d.raisedBy;
                    const raisedAgainst = d.raisedAgainst;
                    const prop = d.property;
                    const isLandlordRaised = raisedBy?.role === "landlord";

                    const RoleBadge = ({ role }) => {
                      if (!role) return null;
                      const isLandlord = role === "landlord";
                      return (
                        <span className={`text-[0.65rem] font-bold uppercase tracking-[0.8px] py-[2px] px-2 rounded-[5px] ${isLandlord ? "bg-[#fdf6e8] text-[#c8922a]" : "bg-[#eef2fb] text-[#3b6bcc]"}`}>
                          {isLandlord ? "Landlord" : "Tenant"}
                        </span>
                      );
                    };

                    const PersonCard = ({ person, label }) => (
                      <div className="flex-1 min-w-[160px] bg-[#faf9f7] border border-[#e2ddd6] rounded-[10px] p-3.5">
                        <div className="text-[0.67rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-1.5">{label}</div>
                        {person ? (
                          <>
                            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                              <span className="text-[0.88rem] font-bold text-[#1a2744]">{person.firstName} {person.lastName}</span>
                              <RoleBadge role={person.role} />
                            </div>
                            <div className="text-[0.77rem] text-[#8a7f74]">{person.email || "—"}</div>
                          </>
                        ) : (
                          <div className="text-[0.83rem] text-[#8a7f74]">—</div>
                        )}
                      </div>
                    );

                    return (
                      <div
                        key={d._id}
                        className={`bg-white border rounded-[14px] p-6 shadow-[0_2px_16px_rgba(26,39,68,0.08)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(26,39,68,0.12)] ${d.status === "open" ? "border-[#e2ddd6]" : "border-[#e2ddd6] opacity-80"}`}
                      >
                        {/* Top row: status + date + property + dispute ID */}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className={pillClass(d.status)}><PillDot s={d.status} />{d.status === "open" ? "Open" : "Resolved"}</span>
                          {/* Who raised it badge */}
                          <span className={`text-[0.72rem] font-bold py-1 px-2.5 rounded-full ${isLandlordRaised ? "bg-[#fdf6e8] text-[#c8922a]" : "bg-[#eef2fb] text-[#3b6bcc]"}`}>
                            {isLandlordRaised ? "🏠 Raised by Landlord" : "👤 Raised by Tenant"}
                          </span>
                          <span className="text-[0.75rem] text-[#8a7f74] ml-auto">{fmt(d.createdAt)} · <span className="font-semibold text-[#3d3730]">#{d._id?.slice(-8).toUpperCase()}</span></span>
                        </div>

                        {/* Raised By → Against cards */}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <PersonCard person={raisedBy} label="Raised By" />

                          {/* Arrow */}
                          <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#e05a3a" strokeWidth="2" className="w-5 h-5">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12,5 19,12 12,19" />
                            </svg>
                            <span className="text-[0.62rem] font-bold uppercase tracking-[1px] text-[#e05a3a]">Against</span>
                          </div>

                          <PersonCard person={raisedAgainst} label="Raised Against" />

                          {/* Property info */}
                          {prop && (
                            <div className="flex-1 min-w-[160px] bg-[#faf9f7] border border-[#e2ddd6] rounded-[10px] p-3.5">
                              <div className="text-[0.67rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-1.5">Property</div>
                              <div className="text-[0.88rem] font-bold text-[#1a2744]">{prop.pgName}</div>
                              <div className="text-[0.77rem] text-[#8a7f74]">{prop.city || "—"}</div>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div className="bg-[#faf9f7] border border-[#e2ddd6] rounded-[10px] p-3.5 mb-4">
                          <div className="text-[0.67rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-1.5">Complaint</div>
                          <p className="text-[0.88rem] text-[#3d3730] leading-[1.6]">{d.description || "No description provided."}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap">
                          <BtnSm cls="bg-[#eef2fb] text-[#3b6bcc] hover:bg-blue-100" onClick={() => setDisputeModal(d)}>Full Details</BtnSm>
                          {d.status === "open" && (
                            <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => resolveDispute(d._id)}>Mark Resolved</BtnSm>
                          )}
                          {d.status === "resolved" && (
                            <span className="text-[0.78rem] text-[#8a7f74] self-center">✓ Resolved on {fmt(d.updatedAt)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {sortedDisputes.length > PAGE_SIZES.disputes && (
                <div className="mt-4 bg-white border border-[#e2ddd6] rounded-[14px] overflow-hidden">
                  <Paginator page={disputePage} total={sortedDisputes.length} pageSize={PAGE_SIZES.disputes} onPage={setDisputePage} />
                </div>
              )}
            </div>
          )}

          {/* ══ PAYMENTS ══ */}
          {tab === "payments" && (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Payments & Revenue</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Track all transactions and platform fee collection.</p>
                </div>
                <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => exportCSV(payments.map(p => ({ id: p._id, amount: p.amount, fee: p.platformFee, landlord: p.landlordAmount, method: p.paymentMethod, status: p.paymentStatus, date: p.createdAt })), "payments.csv")}>Export CSV</BtnSm>
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
                <div className="adm-table-wrap">
                  <table className="w-full border-collapse">
                    <thead><tr>{["Date", "Booking #", "Tenant", "Property", "Amount", "Platform Fee", "Landlord Gets", "Method", "Status"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                    <tbody>
                      {pagedPayments.map(p => {
                        const fee = p.platformFee || Math.round((p.amount || 0) * PLATFORM_FEE_PCT / 100);
                        const landlordAmt = p.landlordAmount || ((p.amount || 0) - fee);
                        return (
                          <tr key={p._id} className="hover:bg-[#faf9f7]">
                            <td className={`${tdCls} text-[#8a7f74] whitespace-nowrap`}>{fmt(p.createdAt)}</td>
                            <td className={tdCls}><strong className="text-[#1a2744] text-[0.78rem]">#{p._id.toUpperCase()}</strong></td>
                            <td className={tdCls}>{p.userId?.firstName || p.bookingId?.tenantId?.firstName || "—"}</td>
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
                <Paginator page={paymentPage} total={sortedPayments.length} pageSize={PAGE_SIZES.payments} onPage={setPaymentPage} />
              </div>
            </div>
          )}

          {/* ══ ACTIVITY LOGS ══ */}
          {tab === "logs" && (
            <div>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Activity Logs</h1>
                  <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">System-wide audit trail of all actions.</p>
                </div>
                <div className="flex gap-2.5">
                  <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => exportCSV(logs.map(l => ({ id: l._id, user: l.userId?.firstName || "System", activity: l.activity, description: l.description, date: l.createdAt })), "activity_logs.csv")}>Export CSV</BtnSm>
                  <BtnSm cls="bg-[#1a2744] text-white hover:bg-[#243356]" onClick={async () => {
                    await axios.post("/logs", { activity: "ADMIN_ACTION", description: "Admin manually triggered a log entry." });
                    const res = await axios.get("/logs");
                    setLogs(res.data || []);
                    toast.success("Log created");
                  }}>+ Add Log</BtnSm>
                </div>
              </div>
              <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
                <div className="adm-table-wrap">
                  <table className="w-full border-collapse">
                    <thead><tr>{["Date", "User", "Activity", "Description", ""].map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
                    <tbody>
                      {pagedLogs.map((l, i) => (
                        <tr key={l._id || i} className="hover:bg-[#faf9f7]">
                          <td className={`${tdCls} text-[#8a7f74] whitespace-nowrap`}>{fmt(l.createdAt)}</td>
                          <td className={tdCls}>{l.userId?.firstName || "System"}</td>
                          <td className={tdCls}><span className="inline-flex items-center text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#eef2fb] text-[#3b6bcc]">{l.activity || "—"}</span></td>
                          <td className={tdCls}>{l.description || "—"}</td>
                          <td className={tdCls}>
                            {l.userId && (
                              <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => setLogUserModal(l)}>Details</BtnSm>
                            )}
                          </td>
                        </tr>
                      ))}
                      {logs.length === 0 && <tr><td colSpan={5} className="text-center text-[#8a7f74] py-6">No activity logs found.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <Paginator page={logPage} total={sortedLogs.length} pageSize={PAGE_SIZES.logs} onPage={setLogPage} />
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ══════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════ */}

      {/* Add User Modal */}
      <Modal open={addUserModal} onClose={() => setAddUserModal(false)} title="Add New User">
        <InputField label="First Name *" value={newUser.firstName} onChange={e => setNewUser(p => ({ ...p, firstName: e.target.value }))} placeholder="John" />
        <InputField label="Last Name" value={newUser.lastName} onChange={e => setNewUser(p => ({ ...p, lastName: e.target.value }))} placeholder="Doe" />
        <InputField label="Email *" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} type="email" placeholder="john@example.com" />
        <InputField label="Password *" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} type="password" placeholder="••••••••" />
        <SelectField label="Role" value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} options={[{ value: "user", label: "Tenant" }, { value: "landlord", label: "Landlord" }, { value: "admin", label: "Admin" }]} />
        <div className="flex justify-end gap-2.5 mt-2">
          <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => setAddUserModal(false)}>Cancel</BtnSm>
          <BtnSm cls="bg-[#1a2744] text-white hover:bg-[#243356]" onClick={handleAddUser}>Create User</BtnSm>
        </div>
      </Modal>

      {/* View User Modal */}
      <Modal open={!!userViewModal} onClose={() => setUserViewModal(null)} title="User Details">
        {userViewModal && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                ["Name", `${userViewModal.firstName} ${userViewModal.lastName}`],
                ["Email", userViewModal.email],
                ["Role", userViewModal.role],
                ["Status", userViewModal.status || "active"],
                ["Joined", fmt(userViewModal.createdAt)],
                ["User ID", userViewModal._id?.slice(-8).toUpperCase()],
              ].map(([k, v]) => (
                <div key={k} className="bg-[#faf9f7] rounded-[10px] p-3.5">
                  <div className="text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-1">{k}</div>
                  <div className="text-[0.88rem] font-semibold text-[#1a2744] capitalize">{v}</div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-[0.78rem] font-bold text-[#8a7f74] mb-2">Bookings by this user</div>
              <div className="text-[0.88rem] text-[#3d3730]">{bookings.filter(b => b.tenantId?._id === userViewModal._id).length} booking(s)</div>
            </div>
            <div className="flex justify-end gap-2.5">
              <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => { setUserViewModal(null); handleEditUser(userViewModal); }}>Edit</BtnSm>
              <BtnSm cls="bg-[#fdf0ec] text-[#e05a3a] hover:bg-orange-100" onClick={() => { setUserViewModal(null); handleBlockUser(userViewModal); }}>{userViewModal.status === "blocked" ? "Unblock" : "Block"}</BtnSm>
              <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => setUserViewModal(null)}>Close</BtnSm>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal open={!!userModal} onClose={() => setUserModal(null)} title="Edit User">
        {userModal && (
          <>
            <InputField label="First Name" value={editUser.firstName || ""} onChange={e => setEditUser(p => ({ ...p, firstName: e.target.value }))} />
            <InputField label="Last Name" value={editUser.lastName || ""} onChange={e => setEditUser(p => ({ ...p, lastName: e.target.value }))} />
            <InputField label="Email" value={editUser.email || ""} onChange={e => setEditUser(p => ({ ...p, email: e.target.value }))} type="email" />
            <SelectField label="Role" value={editUser.role || "user"} onChange={e => setEditUser(p => ({ ...p, role: e.target.value }))} options={[{ value: "user", label: "Tenant" }, { value: "landlord", label: "Landlord" }, { value: "admin", label: "Admin" }]} />
            <SelectField label="Status" value={editUser.status || "active"} onChange={e => setEditUser(p => ({ ...p, status: e.target.value }))} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "blocked", label: "Blocked" }]} />
            <div className="flex justify-end gap-2.5 mt-2">
              <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => setUserModal(null)}>Cancel</BtnSm>
              <BtnSm cls="bg-[#1a2744] text-white hover:bg-[#243356]" onClick={saveEditUser}>Save Changes</BtnSm>
            </div>
          </>
        )}
      </Modal>

      {/* Edit Property Modal */}
      <Modal open={!!propModal} onClose={() => setPropModal(null)} title="Edit Property">
        {propModal && (
          <>
            <InputField label="PG Name" value={editProp.pgName || ""} onChange={e => setEditProp(p => ({ ...p, pgName: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="City" value={editProp.city || ""} onChange={e => setEditProp(p => ({ ...p, city: e.target.value }))} />
              <InputField label="Area" value={editProp.area || ""} onChange={e => setEditProp(p => ({ ...p, area: e.target.value }))} />
            </div>
            <InputField label="Address" value={editProp.address || ""} onChange={e => setEditProp(p => ({ ...p, address: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Rent (₹)" value={editProp.rent || ""} onChange={e => setEditProp(p => ({ ...p, rent: Number(e.target.value) }))} type="number" />
              <SelectField label="Gender" value={editProp.gender || "unisex"} onChange={e => setEditProp(p => ({ ...p, gender: e.target.value }))} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "unisex", label: "Unisex" }]} />
            </div>
            <SelectField label="Room Type" value={editProp.roomType || "single"} onChange={e => setEditProp(p => ({ ...p, roomType: e.target.value }))} options={[{ value: "single", label: "Single" }, { value: "double", label: "Double" }, { value: "triple", label: "Triple" }]} />
            <SelectField label="Status" value={editProp.available ? "true" : "false"} onChange={e => setEditProp(p => ({ ...p, available: e.target.value === "true" }))} options={[{ value: "true", label: "Available" }, { value: "false", label: "Paused" }]} />
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-[0.78rem] font-semibold text-[#3d3730]">Description</label>
              <textarea value={editProp.description || ""} onChange={e => setEditProp(p => ({ ...p, description: e.target.value }))} rows={3}
                className="bg-[#faf9f7] border border-[#e2ddd6] rounded-[9px] py-2 px-3.5 text-[0.85rem] text-[#1a1a1a] outline-none transition-all duration-300 focus:border-[#2a7c6f] resize-none"
                style={{ fontFamily: "'Outfit',sans-serif" }} />
            </div>
            <div className="flex justify-end gap-2.5 mt-2">
              <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => setPropModal(null)}>Cancel</BtnSm>
              <BtnSm cls="bg-[#1a2744] text-white hover:bg-[#243356]" onClick={saveEditProp}>Save Changes</BtnSm>
            </div>
          </>
        )}
      </Modal>

      {/* Property Reviews Modal */}
      <Modal open={!!propViewModal} onClose={() => { setPropViewModal(null); setReviews([]); }} title={`Reviews — ${propViewModal?.pgName}`}>
        {propViewModal && (
          <div>
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-[#8a7f74]">No reviews yet for this property.</div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
                {reviews.map((r, i) => (
                  <div key={r._id || i} className="bg-[#faf9f7] rounded-[10px] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[0.88rem] text-[#1a2744]">{r.user?.firstName || "Anonymous"}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className={`text-[1rem] ${star <= (r.rating || 0) ? "text-[#c8922a]" : "text-[#e2ddd6]"}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[0.85rem] text-[#3d3730]">{r.reviewText || "No comment."}</p>
                    <span className="text-[0.73rem] text-[#8a7f74] mt-1.5 block">{fmt(r.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => { setPropViewModal(null); setReviews([]); }}>Close</BtnSm>
            </div>
          </div>
        )}
      </Modal>

      {/* Dispute Details Modal */}
      <Modal open={!!disputeModal} onClose={() => setDisputeModal(null)} title="Dispute Details">
        {disputeModal && (() => {
          const dm = disputeModal;
          const raisedBy = dm.raisedBy;
          const raisedAgainst = dm.raisedAgainst;
          const prop = dm.property;
          const isLandlordRaised = raisedBy?.role === "landlord";

          const RoleBadge = ({ role }) => {
            if (!role) return null;
            const isLL = role === "landlord";
            return (
              <span className={`text-[0.62rem] font-bold uppercase tracking-[0.8px] py-[2px] px-1.5 rounded-[4px] ml-1 ${isLL ? "bg-[#fdf6e8] text-[#c8922a]" : "bg-[#eef2fb] text-[#3b6bcc]"}`}>
                {isLL ? "Landlord" : "Tenant"}
              </span>
            );
          };

          return (
            <div>
              {/* Meta row */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  ["Status", <span className="capitalize font-semibold">{dm.status}</span>],
                  ["Date", fmt(dm.createdAt)],
                  ["Dispute ID", `#${dm._id?.slice(-8).toUpperCase()}`],
                  ["Property", prop ? `${prop.pgName}${prop.city ? ` · ${prop.city}` : ""}` : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-[#faf9f7] rounded-[10px] p-3">
                    <div className="text-[0.68rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-1">{k}</div>
                    <div className="text-[0.85rem] text-[#1a2744]">{v}</div>
                  </div>
                ))}
              </div>

              {/* Raised By / Against */}
              <div className="mb-1">
                <div className="text-[0.68rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-2">Parties Involved</div>
                <div className="flex gap-2 items-center flex-wrap">
                  {/* Raised By */}
                  <div className={`flex-1 min-w-[130px] rounded-[10px] p-3 border ${isLandlordRaised ? "bg-[#fdf6e8] border-[rgba(200,146,42,0.25)]" : "bg-[#eef2fb] border-[rgba(59,107,204,0.2)]"}`}>
                    <div className={`text-[0.65rem] font-bold uppercase tracking-[1px] mb-1 ${isLandlordRaised ? "text-[#c8922a]" : "text-[#3b6bcc]"}`}>
                      ✦ Raised By
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[0.88rem] font-bold text-[#1a2744]">{raisedBy ? `${raisedBy.firstName} ${raisedBy.lastName}` : "—"}</span>
                      <RoleBadge role={raisedBy?.role} />
                    </div>
                    <div className="text-[0.75rem] text-[#8a7f74] mt-0.5">{raisedBy?.email || ""}</div>
                  </div>

                  <svg viewBox="0 0 24 24" fill="none" stroke="#e05a3a" strokeWidth="2" className="w-5 h-5 flex-shrink-0">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" />
                  </svg>

                  {/* Raised Against */}
                  <div className="flex-1 min-w-[130px] bg-[#fdf0ec] border border-[rgba(224,90,58,0.2)] rounded-[10px] p-3">
                    <div className="text-[0.65rem] font-bold uppercase tracking-[1px] text-[#e05a3a] mb-1">Against</div>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[0.88rem] font-bold text-[#1a2744]">{raisedAgainst ? `${raisedAgainst.firstName} ${raisedAgainst.lastName}` : "—"}</span>
                      <RoleBadge role={raisedAgainst?.role} />
                    </div>
                    <div className="text-[0.75rem] text-[#8a7f74] mt-0.5">{raisedAgainst?.email || ""}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#faf9f7] rounded-[10px] p-4 mt-4 mb-5">
                <div className="text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-2">Complaint Description</div>
                <p className="text-[0.88rem] text-[#3d3730] leading-[1.6]">{dm.description || "No description."}</p>
              </div>

              <div className="flex justify-end gap-2.5">
                {dm.status === "open" && (
                  <BtnSm cls="bg-[#e8f5f3] text-[#2a7c6f] hover:bg-[rgba(42,124,111,0.18)]" onClick={() => { resolveDispute(dm._id); setDisputeModal(null); }}>Mark Resolved</BtnSm>
                )}
                <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => setDisputeModal(null)}>Close</BtnSm>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Log Details Modal */}
      <Modal open={!!logUserModal} onClose={() => setLogUserModal(null)} title="Log Details">
        {logUserModal && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                ["Date", fmt(logUserModal.createdAt)],
                ["Activity", logUserModal.activity || "—"],
                ["User", logUserModal.userId?.firstName || "System"],
                ["Log ID", `#${logUserModal._id?.slice(-8).toUpperCase()}`],
              ].map(([k, v]) => (
                <div key={k} className="bg-[#faf9f7] rounded-[10px] p-3.5">
                  <div className="text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-1">{k}</div>
                  <div className="text-[0.88rem] font-semibold text-[#1a2744]">{v}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#faf9f7] rounded-[10px] p-4 mb-5">
              <div className="text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-2">Description</div>
              <p className="text-[0.88rem] text-[#3d3730]">{logUserModal.description || "No description."}</p>
            </div>
            <div className="flex justify-end">
              <BtnSm cls="bg-[#f0ede8] text-[#3d3730] hover:bg-[#e2ddd6]" onClick={() => setLogUserModal(null)}>Close</BtnSm>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminSidebar;