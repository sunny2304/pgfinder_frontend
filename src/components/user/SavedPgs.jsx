import React from "react";

const SavedPgs = () => {
  return (
    <div className="w-full px-6 py-6 bg-green-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Saved PGs
      </h1>

      {/* Summary Section */}
      <div className="bg-white rounded-xl shadow border border-green-100 p-4 mb-8">
        <p className="text-sm text-gray-500">Total Saved PGs</p>
        <p className="text-2xl font-semibold text-green-600">3</p>
      </div>

      {/* PG Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow border border-green-100 p-5 flex flex-col"
          >
            {/* Image Placeholder */}
            <div className="h-36 bg-green-100 rounded-lg mb-4"></div>

            <h2 className="font-semibold text-gray-800">
              Comfort Stay PG
            </h2>
            <p className="text-sm text-gray-500">
              Vastrapur, Ahmedabad
            </p>
            <p className="text-green-600 font-medium mt-1">
              ₹7,500 / month
            </p>

            <div className="mt-4 flex justify-between items-center">
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                Verified
              </span>

              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPgs;