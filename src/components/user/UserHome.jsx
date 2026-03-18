import React from "react";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";

export const UserHome = () => {
  return (
    <>
      <UserNavbar />

      <div>

        {/* HERO SECTION */}
        <section className="bg-blue-600 text-white py-20 text-center">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Find Your Perfect PG
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Discover the best paying guest accommodations tailored to your needs and budget
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex justify-center">
              <div className="flex w-full max-w-xl">
                <input
                  type="text"
                  placeholder="Search by location, property name..."
                  className="w-full px-4 py-3 rounded-l-lg text-black focus:outline-none"
                />
                <button className="bg-blue-800 px-6 py-3 rounded-r-lg hover:bg-blue-900 transition">
                  🔍 Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TRENDING PROPERTIES */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">
              Trending Properties
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {/* Card 1 */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267')",
                  }}
                ></div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">Sunshine PG</h3>
                  <p className="text-blue-600 font-bold">₹8,500/month</p>

                  <div className="flex flex-wrap gap-2 mt-2 text-sm">
                    <span className="bg-gray-200 px-2 py-1 rounded">WiFi</span>
                    <span className="bg-gray-200 px-2 py-1 rounded">AC</span>
                    <span className="bg-gray-200 px-2 py-1 rounded">Laundry</span>
                    <span className="bg-gray-200 px-2 py-1 rounded">Meals</span>
                  </div>

                  <div className="mt-2 text-yellow-500">
                    ★★★★☆ <span className="text-gray-600 text-sm">4.5 (128)</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1615529162924-f8605388463a')",
                  }}
                ></div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">Green Valley PG</h3>
                  <p className="text-blue-600 font-bold">₹7,200/month</p>

                  <div className="flex flex-wrap gap-2 mt-2 text-sm">
                    <span className="bg-gray-200 px-2 py-1 rounded">WiFi</span>
                    <span className="bg-gray-200 px-2 py-1 rounded">Gym</span>
                    <span className="bg-gray-200 px-2 py-1 rounded">Laundry</span>
                  </div>

                  <div className="mt-2 text-yellow-500">
                    ★★★★☆ <span className="text-gray-600 text-sm">4.2 (95)</span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2')",
                  }}
                ></div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">Elite Residency</h3>
                  <p className="text-blue-600 font-bold">₹12,000/month</p>

                  <div className="flex flex-wrap gap-2 mt-2 text-sm">
                    <span className="bg-gray-200 px-2 py-1 rounded">WiFi</span>
                    <span className="bg-gray-200 px-2 py-1 rounded">AC</span>
                    <span className="bg-gray-200 px-2 py-1 rounded">Laundry</span>
                    <span className="bg-gray-200 px-2 py-1 rounded">Meals</span>
                    <span className="bg-gray-200 px-2 py-1 rounded">Gym</span>
                  </div>

                  <div className="mt-2 text-yellow-500">
                    ★★★★★ <span className="text-gray-600 text-sm">4.8 (210)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="bg-gray-100 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">
              Why Choose PG Finder?
            </h2>

            <div className="grid md:grid-cols-4 gap-6 text-center">

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl text-blue-600 mb-3">🏠</div>
                <h3 className="font-semibold">Verified Properties</h3>
                <p className="text-gray-600 text-sm mt-2">
                  All properties are verified for quality and safety standards
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl text-teal-500 mb-3">₹</div>
                <h3 className="font-semibold">Best Prices</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Competitive pricing with no hidden charges
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl text-sky-500 mb-3">🎧</div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Round-the-clock customer support
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl text-purple-500 mb-3">🔒</div>
                <h3 className="font-semibold">Secure Booking</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Safe and secure payment options
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>
      
      <UserFooter/>
    </>
  );
};