import React from "react";

const PrivacyPolicy = () => {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>
      <div
        className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-xl mt-8"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <h1
          className="text-3xl font-black text-[#1a2744] mb-6"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Privacy Policy
        </h1>
        <p className="mb-4 text-[#3d3730] leading-relaxed">
          PG Finder values your privacy. This policy explains what information we collect, how we use it, and how we protect it.
        </p>

        <h2
          className="text-2xl font-bold text-[#1a2744] mb-3"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          1. Information Collection
        </h2>
        <p className="mb-4 text-[#3d3730] leading-relaxed">
          We collect personal information such as name, email, and contact details when users register on our platform.
        </p>

        <h2
          className="text-2xl font-bold text-[#1a2744] mb-3"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          2. Use of Information
        </h2>
        <p className="mb-4 text-[#3d3730] leading-relaxed">
          The information is used to provide services, communicate with users, and improve the platform. We do not sell or share your personal information with third parties without consent.
        </p>

        <h2
          className="text-2xl font-bold text-[#1a2744] mb-3"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          3. Cookies
        </h2>
        <p className="mb-4 text-[#3d3730] leading-relaxed">
          PG Finder may use cookies to enhance user experience. You can control cookie preferences in your browser settings.
        </p>

        <h2
          className="text-2xl font-bold text-[#1a2744] mb-3"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          4. Data Security
        </h2>
        <p className="mb-4 text-[#3d3730] leading-relaxed">
          We take reasonable steps to protect your data from unauthorized access, alteration, or disclosure.
        </p>

        <h2
          className="text-2xl font-bold text-[#1a2744] mb-3"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          5. Updates
        </h2>
        <p className="text-[#3d3730] leading-relaxed">
          We may update this policy occasionally. Continued use of the platform constitutes acceptance of any changes.
        </p>
      </div>
    </>
  );
};

export default PrivacyPolicy;