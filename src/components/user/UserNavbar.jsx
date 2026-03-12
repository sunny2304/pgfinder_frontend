import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export const UserNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow-md z-50">
        <div className="h-full max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <h1 className="text-2xl font-bold text-green-600">
            PGFinder
          </h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6 text-gray-700 font-medium items-center">
            <li><Link to="/user/home" className="hover:text-green-600">Home</Link></li>
            <li><Link to="/user/bookings" className="hover:text-green-600">My Bookings</Link></li>
            <li><Link to="/user/savedpgs" className="hover:text-green-600">Saved PGs</Link></li>
            <li><Link to="/user/profile" className="hover:text-green-600">Profile</Link></li>
            <li><Link to="/user/useeffectdemo" className="hover:text-green-600">Useeffectdemo</Link></li>
            <li><Link to="/user/getapidemo" className="hover:text-green-600">getapidemo</Link></li>
            <li>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg">
                Logout
              </button>
            </li>
          </ul>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-green-600"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu (absolute so it does NOT push content) */}
        {open && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden">
            <div className="flex flex-col gap-4 px-6 py-4 text-gray-700 font-medium">
              <Link to="/user/home" onClick={() => setOpen(false)}>Home</Link>
              <Link to="/user/bookings" onClick={() => setOpen(false)}>My Bookings</Link>
              <Link to="/user/savedpgs" onClick={() => setOpen(false)}>Saved PGs</Link>
              <Link to="/user/profile" onClick={() => setOpen(false)}>Profile</Link>
              <button className="bg-green-500 text-white py-2 rounded-lg">
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Layout Wrapper */}
      <main className="pt-16 bg-green-50">
        <Outlet />
      </main>
    </>
  );
};