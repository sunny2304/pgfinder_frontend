import React from "react";

export const UserFooter = () => {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">

        <div>
          {/* LOGO */}
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-5">
            <img src="/logo.png" alt="PG Finder Logo" className="w-22 h-12" />
          </h1>
          <p className="text-gray-600 text-sm mt-3">
            Finding the perfect paying guest accommodation made easy.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>Home</li>
            <li>About</li>
            <li>Bookings</li>
            <li>Messages</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Cities</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>Delhi</li>
            <li>Mumbai</li>
            <li>Bangalore</li>
            <li>Chennai</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-600">Ahmedabad, India</p>
          <p className="text-sm text-gray-600 mt-1">info@pgfinder.com</p>
        </div>

      </div>

      <div className="border-t text-center py-4 text-sm text-gray-500">
        © 2026 PG Finder. All rights reserved.
      </div>
    </footer>
  );
};