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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>

      <footer className="border-t border-[#e2ddd6] bg-[#f5f2ed]" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6 lg:px-14 py-12">
          {/* Brand */}
          <div>
            <span
              className="block text-[1.3rem] font-black text-[#1a2744] mb-3 cursor-pointer"
              style={{ fontFamily: "'Fraunces', serif" }}
              onClick={() => navigate("/user/home")}
            >
              PG<em className="text-[#2a7c6f] not-italic">Finder</em>
            </span>
            <p className="text-[#8a7f74] text-[0.85rem] leading-[1.65] max-w-[240px]">
              India's most trusted platform for finding and booking verified paying guest accommodations.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-bold text-[0.85rem] text-[#1a2744] mb-4 uppercase tracking-[0.8px]">
                {heading}
              </h4>
              {links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-[#8a7f74] text-[0.85rem] no-underline mb-2.5 transition-colors duration-200 hover:text-[#1a2744]"
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#e2ddd6] px-6 lg:px-14 py-5 flex items-center justify-between flex-wrap gap-3 text-[#8a7f74] text-[0.82rem]">
          <div>© 2025 PGFinder. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="/privacypolicy" className="text-[#8a7f74] no-underline transition-colors duration-200 hover:text-[#1a2744]">Privacy</a>
            <a href="/t&c" className="text-[#8a7f74] no-underline transition-colors duration-200 hover:text-[#1a2744]">Terms</a>
            <a href="#" className="text-[#8a7f74] no-underline transition-colors duration-200 hover:text-[#1a2744]">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
}