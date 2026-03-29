// ─── LANDLORD EARNINGS UPDATE NOTE ───────────────────────────────────────────
// In your existing LandlordDashboard.jsx, replace the earnings stat cards section
// and payment history table with this updated version.
// 
// The key change: payments now have a `landlordAmount` field (amount minus 5% platform fee)
// Use p.landlordAmount instead of p.amount for landlord's actual earnings.
//
// In the ══ EARNINGS ══ section, update the stat cards:

/*
REPLACE THIS stat card:
{ label: "Total Payments Received", val: `₹${payments.filter(p => p.paymentStatus === "success").reduce((s, p) => s + (p.amount || 0), 0).toLocaleString()}` }

WITH THIS:
{ label: "Total Earnings (After Fee)", val: `₹${payments.filter(p => p.paymentStatus === "success").reduce((s, p) => s + (p.landlordAmount || p.amount || 0), 0).toLocaleString()}` }

AND ADD THIS stat card:
{ label: "Platform Fee Deducted (5%)", val: `₹${payments.filter(p => p.paymentStatus === "success").reduce((s, p) => s + (p.platformFee || 0), 0).toLocaleString()}` }
*/

// ─── FULL UPDATED EARNINGS SECTION for LandlordDashboard ─────────────────────
// Replace the {tab === "earnings" && (...)} section in LandlordDashboard.jsx:

export const EarningsTab = ({ payments, myBookings }) => {
  const successPayments = payments.filter(p => p.paymentStatus === "success");
  const totalEarnings = successPayments.reduce((s, p) => s + (p.landlordAmount || p.amount || 0), 0);
  const totalFeeDeducted = successPayments.reduce((s, p) => s + (p.platformFee || 0), 0);
  const totalGross = successPayments.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingAmount = payments.filter(p => p.paymentStatus === "pending").reduce((s, p) => s + (p.amount || 0), 0);

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
  const pillClass = (s) => {
    if (!s) return "pill pill-pending";
    const v = s.toLowerCase();
    if (v === "success") return "pill pill-active";
    if (v === "failed") return "pill pill-inactive";
    return "pill pill-pending";
  };

  return (
    <div>
      <div className="topbar">
        <div><h1>Earnings</h1><p>Track your rental income across all properties.</p></div>
      </div>

      {/* Info banner about platform fee */}
      <div style={{ background: "var(--teal-pale)", border: "1px solid rgba(42,124,111,0.25)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontFamily: "'Outfit',sans-serif", fontSize: "0.87rem", color: "var(--teal)", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        PGFinder charges a <strong style={{ margin: "0 4px" }}>5% platform fee</strong> on each successful transaction. Your earnings shown below are after this deduction.
      </div>

      <div className="stat-cards">
        {[
          { label: "Net Earnings (After 5% Fee)", val: `₹${totalEarnings.toLocaleString()}`, cls: "sci-gold", icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></> },
          { label: "Gross Rent Collected", val: `₹${totalGross.toLocaleString()}`, cls: "sci-teal", icon: <><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/></> },
          { label: "Platform Fee Paid (5%)", val: `₹${totalFeeDeducted.toLocaleString()}`, cls: "sci-navy", icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></> },
          { label: "Pending Payouts", val: `₹${pendingAmount.toLocaleString()}`, cls: "sci-blue", icon: <><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></> },
          { label: "Total Bookings", val: myBookings.length, cls: "sci-coral", icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`sc-icon ${s.cls}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{s.icon}</svg></div>
            <div className="sc-label">{s.label}</div>
            <div className="sc-num" style={{ fontSize: "1.5rem" }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head"><h3>Payment History</h3></div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Booking ID</th>
              <th>Tenant</th>
              <th>Gross Amount</th>
              <th>Platform Fee (5%)</th>
              <th>Net to You</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.slice(0, 20).map(p => {
              const fee = p.platformFee || Math.round((p.amount || 0) * 5 / 100);
              const net = p.landlordAmount || ((p.amount || 0) - fee);
              return (
                <tr key={p._id}>
                  <td style={{ color: "var(--muted)" }}>{fmt(p.createdAt)}</td>
                  <td><strong style={{ color: "var(--navy)", fontSize: "0.78rem" }}>#{p._id?.slice(-6)?.toUpperCase()}</strong></td>
                  <td>{p.userId?.firstName || "—"} {p.userId?.lastName || ""}</td>
                  <td>₹{p.amount?.toLocaleString()}</td>
                  <td style={{ color: "var(--teal)" }}>−₹{fee.toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: "var(--navy)" }}>₹{net.toLocaleString()}</td>
                  <td style={{ textTransform: "capitalize" }}>{p.paymentMethod}</td>
                  <td><span className={pillClass(p.paymentStatus)}>{p.paymentStatus}</span></td>
                </tr>
              );
            })}
            {payments.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No payments found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarningsTab;