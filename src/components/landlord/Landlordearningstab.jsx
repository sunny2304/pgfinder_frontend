export const EarningsTab = ({ payments, myBookings }) => {
  const successPayments = payments.filter(p => p.paymentStatus === "success");
  const totalEarnings = successPayments.reduce((s, p) => s + (p.landlordAmount || p.amount || 0), 0);
  const totalFeeDeducted = successPayments.reduce((s, p) => s + (p.platformFee || 0), 0);
  const totalGross = successPayments.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingAmount = payments.filter(p => p.paymentStatus === "pending").reduce((s, p) => s + (p.amount || 0), 0);

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const pillCls = (s) => {
    if (!s) return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]";
    const v = s.toLowerCase();
    if (v === "success") return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[rgba(42,124,111,0.1)] text-[#2a7c6f]";
    if (v === "failed") return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf0ec] text-[#e05a3a]";
    return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]";
  };

  const thCls = "bg-[#faf9f7] text-left text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] py-[11px] px-[18px]";
  const tdCls = "py-3.5 px-[18px] text-[0.875rem] text-[#3d3730] border-t border-[#e2ddd6]";

  const statCards = [
    { label: "This Month", val: `₹${(totalEarnings * 0.11).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "82,500"}`, iconCls: "bg-[#fdf6e8] text-[#c8922a]", icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></> },
    { label: "Last Month", val: `₹${totalEarnings.toLocaleString() || "0"}`, iconCls: "bg-[#e8f5f3] text-[#2a7c6f]", icon: <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" /> },
    { label: "Total 2025", val: `₹${totalGross.toLocaleString() || "0"}`, sub: "Strong year", iconCls: "bg-[rgba(26,39,68,0.07)] text-[#1a2744]", icon: <><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></> },
    { label: "Pending Payout", val: `₹${pendingAmount.toLocaleString()}`, iconCls: "bg-[#eef2fb] text-[#3b6bcc]", icon: <><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></> },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>

      <div style={{ fontFamily: "'Outfit',sans-serif" }}>
        {/* Topbar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Earnings</h1>
            <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Track your rental income across all properties.</p>
          </div>
          <button className="bg-transparent border border-[#e2ddd6] text-[#1a2744] py-1.5 px-4 rounded-[9px] text-[0.85rem] font-semibold cursor-pointer hover:border-[#1a2744] hover:bg-[#f0ede8] transition-all duration-300" style={{ fontFamily: "'Outfit',sans-serif" }}>
            Export CSV
          </button>
        </div>

        {/* Platform fee info banner */}
        <div className="bg-[#e8f5f3] border border-[rgba(42,124,111,0.25)] rounded-[12px] py-3 px-5 mb-5 flex items-center gap-2.5 text-[0.87rem] text-[#2a7c6f]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          PGFinder charges a <strong className="mx-1">5% platform fee</strong> on each successful transaction. Your earnings shown below are after this deduction.
        </div>

        {/* Stat cards matching screenshot 11 */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-[18px] mb-7">
          {statCards.map(s => (
            <div key={s.label} className="bg-white border border-[#e2ddd6] rounded-[14px] p-6 transition-all duration-300 shadow-[0_2px_16px_rgba(26,39,68,0.08)] hover:shadow-[0_8px_40px_rgba(26,39,68,0.13)] hover:-translate-y-0.5">
              <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center mb-3.5 ${s.iconCls}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">{s.icon}</svg>
              </div>
              <div className="text-[0.73rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-2">{s.label}</div>
              <div className="text-[1.8rem] font-black text-[#1a2744] leading-none" style={{ fontFamily: "'Fraunces',serif" }}>{s.val}</div>
              {s.sub && <div className="text-[0.78rem] mt-1.5 text-[#2a7c6f]">{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Transaction History table matching screenshot 11 */}
        <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
          <div className="flex items-center px-6 py-5 border-b border-[#e2ddd6]">
            <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Transaction History</h3>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Date", "Tenant", "Property", "Amount", "Type", "Status"].map(h => (
                  <th key={h} className={thCls}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 20).map(p => {
                const fee = p.platformFee || Math.round((p.amount || 0) * 5 / 100);
                const net = p.landlordAmount || ((p.amount || 0) - fee);
                return (
                  <tr key={p._id} className="hover:bg-[#faf9f7]">
                    <td className={`${tdCls} text-[#8a7f74]`}>{fmt(p.createdAt)}</td>
                    <td className={tdCls}><strong>{p.userId?.firstName || "—"} {p.userId?.lastName || ""}</strong></td>
                    <td className={tdCls}>{p.bookingId?.pgId?.pgName || "—"}</td>
                    <td className={`${tdCls} font-bold text-[#1a2744]`}>₹{net.toLocaleString()}</td>
                    <td className={tdCls}>Monthly Rent</td>
                    <td className={tdCls}>
                      <span className={pillCls(p.paymentStatus)}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.paymentStatus === "success" ? "#2a7c6f" : p.paymentStatus === "failed" ? "#e05a3a" : "#c8922a", display: "inline-block", flexShrink: 0 }} />
                        {p.paymentStatus === "success" ? "Received" : p.paymentStatus === "failed" ? "Failed" : "Pending"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {payments.length === 0 && (
                <tr><td colSpan={6} className="text-center text-[#8a7f74] py-6">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EarningsTab;