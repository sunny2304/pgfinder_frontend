import React from "react";

export const UserFooter = () => {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold">
            PG<span className="text-blue-600">Finder</span>
          </h2>
          <p className="text-gray-600 mt-3 text-sm">
            Find affordable, safe and verified PGs easily. Your comfort is our priority.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>Home</li>
            <li>Browse PG</li>
            <li>Bookings</li>
            <li>Profile</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact</h3>
          <p className="text-gray-600 text-sm">Ahmedabad, India</p>
          <p className="text-gray-600 text-sm mt-1">support@pgfinder.com</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t text-center py-4 text-sm text-gray-500">
        © 2026 PGFinder. All rights reserved.
      </div>
    </footer>
  );
};