import React, { useState } from "react";
import { Link } from "react-router-dom";

export const AdminSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3">
        <h1 className="text-xl font-bold text-green-600">PGFinder Admin</h1>
        <button
          onClick={() => setOpen(!open)}
          className="text-green-600 text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 z-50`}
      >
        {/* Header */}
        <div className="p-5 border-b">
          <h2 className="text-2xl font-bold text-green-600">
            PGFinder Admin
          </h2>
        </div>

        {/* Menu */}
        <ul className="p-4 space-y-3 text-gray-700 font-medium">
          <li>
            <Link
              to="/admin/dashboard"
              className="block px-4 py-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/admin/pgs"
              className="block px-4 py-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition"
            >
              Manage PGs
            </Link>
          </li>

          <li>
            <Link
              to="/admin/bookings"
              className="block px-4 py-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition"
            >
              Bookings
            </Link>
          </li>

          <li>
            <Link
              to="/admin/users"
              className="block px-4 py-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition"
            >
              Users
            </Link>
          </li>

          <li>
            <Link
              to="/admin/owners"
              className="block px-4 py-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition"
            >
              PG Owners
            </Link>
          </li>

          <li>
            <Link
              to="/admin/settings"
              className="block px-4 py-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition"
            >
              Settings
            </Link>
          </li>
        </ul>

        {/* Logout */}
        <div className="absolute bottom-4 w-full px-4">
          <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition">
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 md:hidden z-40"
        ></div>
      )}
    </>
  );
};