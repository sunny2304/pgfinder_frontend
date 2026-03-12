import React from "react";
import { UserNavbar } from "./UserNavbar";

export const UserHome = () => {
  return (
    <>
      <UserNavbar />

      {/* Page Wrapper */}
      <div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-green-600">
            Find Your Perfect PG 🏠
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Affordable • Safe • Verified PGs near you
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="text"
              placeholder="Enter city or area"
              className="w-full md:w-96 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition">
              Search PG
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-xl font-semibold text-green-600">
              Verified PGs
            </h3>
            <p className="text-gray-600 mt-2">
              All PGs are verified for safety and comfort.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-xl font-semibold text-green-600">
              Affordable Pricing
            </h3>
            <p className="text-gray-600 mt-2">
              Best PGs at student-friendly prices.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-xl font-semibold text-green-600">
              Easy Booking
            </h3>
            <p className="text-gray-600 mt-2">
              Book your PG in just a few clicks.
            </p>
          </div>
        </section>

        {/* Popular PGs */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold text-green-600 mb-6">
            Popular PGs Near You
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* PG Card */}
            {[1, 2, 3].map((pg) => (
              <div
                key={pg}
                className="bg-white rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="h-40 bg-green-100 rounded-t-xl flex items-center justify-center">
                  <span className="text-green-600 font-semibold">
                    PG Image
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    Green Stay PG
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Ahmedabad • Boys PG
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-green-600 font-bold">
                      ₹6,000 / month
                    </span>
                    <button className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Call To Action */}
        <section className="bg-green-500 text-white text-center py-12 mt-10">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to find your PG?
          </h2>
          <p className="mt-3 text-green-100">
            Start searching from verified PGs today
          </p>
          <button className="mt-6 bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-100 transition">
            Explore PGs
          </button>
        </section>

      </div>
    </>
  );
};