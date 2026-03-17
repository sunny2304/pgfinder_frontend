import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // if you store token
    toast.success("Logged out successfully");
    navigate("/");
  };

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
            <li><Link to="/user/home">Home</Link></li>
            <li><Link to="/user/bookings">My Bookings</Link></li>
            <li><Link to="/user/savedpgs">Saved PGs</Link></li>

            {/* NEW */}
            <li><Link to="/user/add-property" className="hover:text-green-600">Add Property</Link></li>
            <li>
              <Link to="/user/browse" className="hover:text-green-600">
                Browse PG
              </Link>
            </li>

            <li><Link to="/user/profile">Profile</Link></li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg"
              >
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

        {/* Mobile Menu */}
        {open && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden">
            <div className="flex flex-col gap-4 px-6 py-4 text-gray-700 font-medium">
              <Link to="/user/home" onClick={() => setOpen(false)}>Home</Link>
              <Link to="/user/bookings" onClick={() => setOpen(false)}>My Bookings</Link>
              <Link to="/user/savedpgs" onClick={() => setOpen(false)}>Saved PGs</Link>
              <Link to="/user/profile" onClick={() => setOpen(false)}>Profile</Link>

              {/* NEW */}
              <Link to="/user/add-property" onClick={() => setOpen(false)}>
                Add Property
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Layout Wrapper */}
      <main className="pt-16 bg-green-50 min-h-screen">
        <Outlet />
      </main>
    </>
  );
};