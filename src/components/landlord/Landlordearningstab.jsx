// EarningsTab — shows ONLY the current landlord's earnings
// Props: payments (all payments from backend), myBookings, myPropIds (landlord's property IDs)
export const EarningsTab = ({ payments, myBookings, myPropIds = [] }) => {

  // ── Filter payments that belong to THIS landlord ──────────────────────────
  // A payment belongs to this landlord if the booking's property is one of theirs.
  const myPayments = payments.filter(p => {
    const pgId =
      p.bookingId?.pgId?._id ||
      p.bookingId?.pgId ||
      p.booking?.pgId?._id ||
      p.booking?.pgId;
    return myPropIds.includes(pgId) || myPropIds.includes(String(pgId));
  });

  const successPayments  = myPayments.filter(p => p.paymentStatus === "success");
  const totalEarnings    = successPayments.reduce((s, p) => s + (p.landlordAmount || p.amount || 0), 0);
  const totalFeeDeducted = successPayments.reduce((s, p) => s + (p.platformFee || 0), 0);
  const totalGross       = successPayments.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingAmount    = myPayments.filter(p => p.paymentStatus === "pending").reduce((s, p) => s + (p.amount || 0), 0);

  // This month / last month earnings
  const now          = new Date();
  const thisMonth    = now.getMonth();
  const thisYear     = now.getFullYear();
  const lastMonth    = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const thisMonthEarnings = successPayments
    .filter(p => { const d = new Date(p.createdAt); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; })
    .reduce((s, p) => s + (p.landlordAmount || p.amount || 0), 0);

  const lastMonthEarnings = successPayments
    .filter(p => { const d = new Date(p.createdAt); return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear; })
    .reduce((s, p) => s + (p.landlordAmount || p.amount || 0), 0);

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const pillCls = (s) => {
    if (!s) return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]";
    const v = s.toLowerCase();
    if (v === "success") return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[rgba(42,124,111,0.1)] text-[#2a7c6f]";
    if (v === "failed")  return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf0ec] text-[#e05a3a]";
    return "inline-flex items-center gap-1.5 text-[0.72rem] font-bold py-1 px-2.5 rounded-full bg-[#fdf6e8] text-[#c8922a]";
  };

  const thCls = "bg-[#faf9f7] text-left text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] py-[11px] px-[18px]";
  const tdCls = "py-3.5 px-[18px] text-[0.875rem] text-[#3d3730] border-t border-[#e2ddd6]";

  const exportCSV = () => {
    if (!myPayments.length) return;
    const rows = [
      ["Date", "Tenant", "Property", "Gross Amount", "Platform Fee (5%)", "Your Earnings", "Status"],
      ...[...myPayments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(p => {
        const fee = p.platformFee || Math.round((p.amount || 0) * 5 / 100);
        const net = p.landlordAmount || ((p.amount || 0) - fee);
        const tenant = (p.userId?.firstName || p.bookingId?.tenantId?.firstName || "—");
        return [fmt(p.createdAt), tenant, p.bookingId?.pgId?.pgName || "—", p.amount || 0, fee, net, p.paymentStatus];
      }),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "my_earnings.csv";
    a.click();
  };

  const statCards = [
    { label: "This Month",    val: `₹${thisMonthEarnings.toLocaleString()}`, sub: "Your earnings this month",   iconCls: "bg-[#fdf6e8] text-[#c8922a]",           icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></> },
    { label: "Last Month",    val: `₹${lastMonthEarnings.toLocaleString()}`, sub: "Previous month",             iconCls: "bg-[#e8f5f3] text-[#2a7c6f]",           icon: <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" /> },
    { label: "Total Earned",  val: `₹${totalEarnings.toLocaleString()}`,     sub: "After 5% platform fee",      iconCls: "bg-[rgba(26,39,68,0.07)] text-[#1a2744]", icon: <><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></> },
    { label: "Pending Payout",val: `₹${pendingAmount.toLocaleString()}`,     sub: "Awaiting settlement",        iconCls: "bg-[#eef2fb] text-[#3b6bcc]",            icon: <><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></> },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>
      <div style={{ fontFamily: "'Outfit',sans-serif" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-[1.8rem] font-bold text-[#1a2744]" style={{ fontFamily: "'Fraunces',serif" }}>Earnings</h1>
            <p className="text-[#8a7f74] text-[0.9rem] mt-[3px]">Track your rental income across all your properties.</p>
          </div>
          <button onClick={exportCSV} className="bg-transparent border border-[#e2ddd6] text-[#1a2744] py-1.5 px-4 rounded-[9px] text-[0.85rem] font-semibold cursor-pointer hover:border-[#1a2744] hover:bg-[#f0ede8] transition-all duration-300" style={{ fontFamily: "'Outfit',sans-serif" }}>
            Export CSV
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-[#e8f5f3] border border-[rgba(42,124,111,0.25)] rounded-[12px] py-3 px-5 mb-5 flex items-center gap-2.5 text-[0.87rem] text-[#2a7c6f]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          PGFinder charges a <strong className="mx-1">5% platform fee</strong> on each successful transaction. Your earnings shown below are after this deduction.
        </div>

        {/* Stat cards */}
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

        {/* Gross / Fee / Net summary */}
        {successPayments.length > 0 && (
          <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] mb-5 grid grid-cols-3 divide-x divide-[#e2ddd6]">
            {[
              { label: "Gross Collected",   val: `₹${totalGross.toLocaleString()}`,       sub: "Total paid by tenants",        accent: false },
              { label: "Platform Fee (5%)", val: `₹${totalFeeDeducted.toLocaleString()}`, sub: "Deducted by PGFinder",         accent: true  },
              { label: "Net to You",        val: `₹${totalEarnings.toLocaleString()}`,    sub: "Credited to your account",     accent: false },
            ].map(r => (
              <div key={r.label} className="p-6">
                <div className="text-[0.7rem] font-bold uppercase tracking-[1px] text-[#8a7f74] mb-1.5">{r.label}</div>
                <div className={`text-[1.5rem] font-black leading-none ${r.accent ? "text-[#e05a3a]" : "text-[#1a2744]"}`} style={{ fontFamily: "'Fraunces',serif" }}>{r.val}</div>
                <div className="text-[0.75rem] text-[#8a7f74] mt-1">{r.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white border border-[#e2ddd6] rounded-[14px] shadow-[0_2px_16px_rgba(26,39,68,0.08)] overflow-hidden mb-5">
          <div className="flex items-center px-6 py-5 border-b border-[#e2ddd6]">
            <h3 className="text-[0.95rem] font-bold text-[#1a2744]">Transaction History</h3>
            <span className="ml-3 text-[0.75rem] text-[#8a7f74]">({myPayments.length} transactions)</span>
          </div>
          {myPayments.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <svg className="w-12 h-12 text-[#e2ddd6] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
              <p className="text-[#8a7f74] text-[0.9rem]">No payments recorded for your properties yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>{["Date", "Tenant", "Property", "Gross", "Fee (5%)", "Your Earnings", "Status"].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[...myPayments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(p => {
                    const fee = p.platformFee || Math.round((p.amount || 0) * 5 / 100);
                    const net = p.landlordAmount || ((p.amount || 0) - fee);
                    const tenantName = p.userId?.firstName
                      ? `${p.userId.firstName} ${p.userId.lastName || ""}`.trim()
                      : p.bookingId?.tenantId?.firstName
                        ? `${p.bookingId.tenantId.firstName} ${p.bookingId.tenantId.lastName || ""}`.trim()
                        : "—";
                    const dotColor = p.paymentStatus === "success" ? "#2a7c6f" : p.paymentStatus === "failed" ? "#e05a3a" : "#c8922a";
                    const statusLabel = p.paymentStatus === "success" ? "Received" : p.paymentStatus === "failed" ? "Failed" : "Pending";
                    return (
                      <tr key={p._id} className="hover:bg-[#faf9f7]">
                        <td className={`${tdCls} text-[#8a7f74] whitespace-nowrap`}>{fmt(p.createdAt)}</td>
                        <td className={tdCls}><strong>{tenantName}</strong></td>
                        <td className={tdCls}>{p.bookingId?.pgId?.pgName || "—"}</td>
                        <td className={tdCls}>₹{(p.amount || 0).toLocaleString()}</td>
                        <td className={`${tdCls} text-[#e05a3a]`}>−₹{fee.toLocaleString()}</td>
                        <td className={`${tdCls} font-bold text-[#1a2744]`}>₹{net.toLocaleString()}</td>
                        <td className={tdCls}>
                          <span className={pillCls(p.paymentStatus)}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, display: "inline-block", flexShrink: 0 }} />
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EarningsTab;