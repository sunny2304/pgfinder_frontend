import React from "react";
import { UserFooter } from "./UserFooter";

const UserProfile = () => {
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* PROFILE SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Profile
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT PROFILE CARD */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://randomuser.me/api/portraits/men/32.jpg')",
              }}
            ></div>

            <h3 className="text-lg font-semibold">Rahul Sharma</h3>
            <p className="text-gray-500 text-sm">
              rahul.sharma@example.com
            </p>

            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Edit Profile
            </button>
          </div>

          {/* RIGHT CONTENT */}
          <div className="md:col-span-2 space-y-6">

            {/* PERSONAL INFO */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg mb-4">
                Personal Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Full Name:</span>
                  <span>Rahul Sharma</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span>rahul.sharma@example.com</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span>+91 98765 43210</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Role:</span>
                  <span>Tenant</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since:</span>
                  <span>January 15, 2022</span>
                </div>
              </div>

              <h3 className="font-semibold text-lg mt-6 mb-4">
                Preferences
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Preferred Location:
                  </span>
                  <span>Delhi</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Budget Range:
                  </span>
                  <span>₹7,000 - ₹12,000/month</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Room Type:
                  </span>
                  <span>Single Occupancy</span>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-6 flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Update Profile
                </button>

                <button className="border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-100">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOOKING HISTORY */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">
            Booking History
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* CARD 1 */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold">Sunshine PG</h3>
              <p className="text-sm text-gray-600 mt-2">
                Stayed: 3 months
              </p>
              <p className="text-sm text-gray-600">
                Amount: ₹8,500/month
              </p>
              <p className="text-sm text-gray-600">
                Completed: 15 Sep 2023
              </p>

              <button className="mt-4 border border-blue-600 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 text-sm">
                View Details
              </button>
            </div>

            {/* CARD 2 */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold">Green Valley PG</h3>
              <p className="text-sm text-gray-600 mt-2">
                Stayed: 6 months
              </p>
              <p className="text-sm text-gray-600">
                Amount: ₹7,200/month
              </p>
              <p className="text-sm text-gray-600">
                Completed: 20 Aug 2023
              </p>

              <button className="mt-4 border border-blue-600 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 text-sm">
                View Details
              </button>
            </div>

            {/* CARD 3 */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold">Elite Residency</h3>
              <p className="text-sm text-gray-600 mt-2">
                Stayed: 1 month
              </p>
              <p className="text-sm text-gray-600">
                Amount: ₹12,000/month
              </p>
              <p className="text-sm text-gray-600">
                Completed: 10 Aug 2023
              </p>

              <button className="mt-4 border border-blue-600 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 text-sm">
                View Details
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <UserFooter />
    </div>
  );
};

export default UserProfile;