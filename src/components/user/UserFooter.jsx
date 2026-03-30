import { useNavigate } from "react-router-dom";

const footerLinks = {
  Tenants: ["Browse PGs", "How it works", "Reviews", "Map Search"],
  Landlords: ["List Property", "Pricing", "Resources", "Support"],
  Company: ["About Us", "Blog", "Careers", "Privacy & Terms"],
};

export default function UserFooter() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
      `}</style>

      <footer
        className="bg-[#f5f2ed]"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {/* Main footer grid */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-14 pt-14 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div>
            <span
              className="inline-block text-[1.35rem] font-black text-[#1a2744] mb-4 cursor-pointer select-none"
              style={{ fontFamily: "'Fraunces', serif" }}
              onClick={() => navigate("/user/home")}
            >
              PG<em className="text-[#2a7c6f] not-italic">Finder</em>
            </span>
            <p className="text-[#8a7f74] text-[0.875rem] leading-[1.7] max-w-[220px]">
              India's most trusted platform for finding and booking verified paying guest accommodations.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[0.78rem] font-bold uppercase tracking-[1.5px] text-[#1a2744] mb-5">
                {heading}
              </h4>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[#8a7f74] text-[0.875rem] no-underline transition-colors duration-200 hover:text-[#1a2744]"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-14 py-5 border-t border-[#e2ddd6] flex items-center justify-between flex-wrap gap-3">
          <p className="text-[#8a7f74] text-[0.82rem] m-0">
            © 2025 PGFinder. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacypolicy" className="text-[#8a7f74] text-[0.82rem] no-underline transition-colors duration-200 hover:text-[#1a2744]">Privacy</a>
            <a href="/t&c" className="text-[#8a7f74] text-[0.82rem] no-underline transition-colors duration-200 hover:text-[#1a2744]">Terms</a>
            <a href="#" className="text-[#8a7f74] text-[0.82rem] no-underline transition-colors duration-200 hover:text-[#1a2744]">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
}