import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

          {/* LOGO */}
          <h1 className="text-2xl font-bold">
            PG<span className="text-blue-600">Finder</span>
          </h1>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex gap-6 items-center text-gray-700 font-medium">

            <li>
              <Link to="/user/home" className="hover:text-blue-600 transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/user/bookings" className="hover:text-blue-600 transition">
                My Bookings
              </Link>
            </li>

            <li>
              <Link to="/user/savedpgs" className="hover:text-blue-600 transition">
                Saved PGs
              </Link>
            </li>

            <li>
              <Link to="/user/add-property" className="hover:text-blue-600 transition">
                Add Property
              </Link>
            </li>

            <li>
              <Link to="/user/browse" className="hover:text-blue-600 transition">
                Browse PG
              </Link>
            </li>

            <li>
              <Link to="/user/profile" className="hover:text-blue-600 transition">
                Profile
              </Link>
            </li>

            {/* LOGOUT BUTTON */}
            <li>
              <button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition"
              >
                Logout
              </button>
            </li>

          </ul>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-blue-600"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden">
            <div className="flex flex-col gap-4 px-6 py-4 text-gray-700 font-medium">

              <Link to="/user/home" onClick={() => setOpen(false)}>
                Home
              </Link>

              <Link to="/user/bookings" onClick={() => setOpen(false)}>
                My Bookings
              </Link>

              <Link to="/user/savedpgs" onClick={() => setOpen(false)}>
                Saved PGs
              </Link>

              <Link to="/user/add-property" onClick={() => setOpen(false)}>
                Add Property
              </Link>

              <Link to="/user/browse" onClick={() => setOpen(false)}>
                Browse PG
              </Link>

              <Link to="/user/profile" onClick={() => setOpen(false)}>
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main className="pt-16 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </>
  );
};