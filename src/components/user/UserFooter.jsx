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

        .pgf-footer {
          border-top: 1px solid #e2ddd6;
          background: #f5f2ed;
          font-family: 'Outfit', sans-serif;
        }
        .pgf-footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 40px;
          padding: 40px 56px 32px;
        }
        .pgf-footer-logo {
          font-family: 'Fraunces', serif;
          font-size: 1.3rem; font-weight: 900;
          color: #1a2744; margin-bottom: 12px;
          display: block; cursor: pointer;
        }
        .pgf-footer-logo em { color: #2a7c6f; font-style: normal; }
        .pgf-footer-brand p {
          color: #8a7f74; font-size: 0.85rem;
          line-height: 1.65; max-width: 240px;
        }
        .pgf-footer-col h4 {
          font-weight: 700; font-size: 0.85rem;
          color: #1a2744; margin-bottom: 16px;
          text-transform: uppercase; letter-spacing: 0.8px;
        }
        .pgf-footer-col a {
          display: block; color: #8a7f74;
          font-size: 0.85rem; text-decoration: none;
          margin-bottom: 10px;
          transition: color 0.2s;
        }
        .pgf-footer-col a:hover { color: #1a2744; }

        .pgf-footer-bottom {
          border-top: 1px solid #e2ddd6;
          padding: 20px 56px;
          display: flex; align-items: center;
          justify-content: space-between;
          color: #8a7f74; font-size: 0.82rem;
          font-family: 'Outfit', sans-serif;
          flex-wrap: wrap; gap: 12px;
        }
        .pgf-footer-bottom-links {
          display: flex; gap: 20px;
        }
        .pgf-footer-bottom-links a {
          color: #8a7f74; text-decoration: none;
          transition: color 0.2s;
        }
        .pgf-footer-bottom-links a:hover { color: #1a2744; }

        @media (max-width: 900px) {
          .pgf-footer-grid {
            grid-template-columns: 1fr 1fr;
            padding: 32px 24px 24px;
          }
          .pgf-footer-bottom {
            padding: 16px 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
        @media (max-width: 560px) {
          .pgf-footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
      `}</style>

      <footer className="pgf-footer">
        <div className="pgf-footer-grid">
          {/* Brand */}
          <div className="pgf-footer-brand">
            <span className="pgf-footer-logo" onClick={() => navigate("/user/home")}>
              PG<em>Finder</em>
            </span>
            <p>India's most trusted platform for finding and booking verified paying guest accommodations.</p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="pgf-footer-col">
              <h4>{heading}</h4>
              {links.map((l) => (
                <a key={l} href="#">{l}</a>
              ))}
            </div>
          ))}
        </div>

        <div className="pgf-footer-bottom">
          <div>© 2025 PGFinder. All rights reserved.</div>
          <div className="pgf-footer-bottom-links">
            <a href="/privacypolicy">Privacy</a>
            <a href="/t&c">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
}