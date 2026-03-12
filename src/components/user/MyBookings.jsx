import React from "react";

const MyBookings = () => {
  return (
    <div className="w-full px-6 py-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        My Bookings
      </h1>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <p className="text-2xl font-semibold">3</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-slate-500">Active</p>
          <p className="text-2xl font-semibold">1</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-2xl font-semibold">2</p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {[1, 2].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold text-slate-800">
                Green Valley PG
              </h2>
              <p className="text-sm text-slate-500">
                Navrangpura, Ahmedabad
              </p>
              <p className="text-sm text-slate-400">
                Check-in: 12 Feb 2026
              </p>
            </div>

            <span className="px-4 py-1 rounded-full text-sm bg-slate-200 text-slate-700">
              Confirmed
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;