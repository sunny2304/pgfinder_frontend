import React from "react";
import { UserFooter } from "./UserFooter";

export const UserHome = () => {
  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="bg-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Find Your Perfect PG
          </h1>

          <p className="text-gray-600 mb-6">
            Discover the best paying guest accommodations tailored to your needs and budget
          </p>

          <div className="flex justify-center">
            <div className="flex bg-white rounded-lg overflow-hidden shadow-md w-full max-w-xl">
              <input
                type="text"
                placeholder="Search by location..."
                className="flex-1 px-4 py-3 outline-none text-gray-700"
              />
              <button className="bg-blue-600 px-6 text-white font-semibold hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Trending Properties */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-2xl font-bold mb-8 text-center">
            Trending Properties
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition">
              <div
                className="h-48 bg-cover bg-center rounded-t-xl"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267')",
                }}
              ></div>

              <div className="p-4">
                <h3 className="text-lg font-semibold">Sunshine PG</h3>
                <p className="text-blue-600 font-bold mt-1">₹8,500/month</p>

                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  <span className="bg-gray-100 px-2 py-1 rounded">WiFi</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">AC</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Laundry</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Meals</span>
                </div>

                <div className="mt-3 text-yellow-500 text-sm">
                  ★★★★☆ <span className="text-gray-600">(4.5)</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition">
              <div
                className="h-48 bg-cover bg-center rounded-t-xl"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1615529162924-f8605388463a')",
                }}
              ></div>

              <div className="p-4">
                <h3 className="text-lg font-semibold">Green Valley PG</h3>
                <p className="text-blue-600 font-bold mt-1">₹7,200/month</p>

                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  <span className="bg-gray-100 px-2 py-1 rounded">WiFi</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Gym</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Laundry</span>
                </div>

                <div className="mt-3 text-yellow-500 text-sm">
                  ★★★★☆ <span className="text-gray-600">(4.2)</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition">
              <div
                className="h-48 bg-cover bg-center rounded-t-xl"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2')",
                }}
              ></div>

              <div className="p-4">
                <h3 className="text-lg font-semibold">Elite Residency</h3>
                <p className="text-blue-600 font-bold mt-1">₹12,000/month</p>

                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  <span className="bg-gray-100 px-2 py-1 rounded">WiFi</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">AC</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Laundry</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Meals</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Gym</span>
                </div>

                <div className="mt-3 text-yellow-500 text-sm">
                  ★★★★★ <span className="text-gray-600">(4.8)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-2xl font-bold mb-10">
            Why Choose PG Finder?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-4xl text-blue-600 mb-4">🏠</div>
              <h3 className="font-semibold">Verified Properties</h3>
              <p className="text-sm text-gray-600 mt-2">
                All properties are verified for quality and safety
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-4xl text-teal-500 mb-4">💰</div>
              <h3 className="font-semibold">Best Prices</h3>
              <p className="text-sm text-gray-600 mt-2">
                Competitive pricing with no hidden charges
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-4xl text-sky-500 mb-4">🎧</div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-gray-600 mt-2">
                Round-the-clock support
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-4xl text-purple-500 mb-4">🔒</div>
              <h3 className="font-semibold">Secure Booking</h3>
              <p className="text-sm text-gray-600 mt-2">
                Safe and secure payment options
              </p>
            </div>

          </div>
        </div>
      </section>
    <UserFooter/>
    </div>
  );
};