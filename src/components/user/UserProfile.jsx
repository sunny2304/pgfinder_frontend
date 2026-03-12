import React from "react";

const UserProfile = () => {
  return (
    <div className="w-full px-6 py-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        My Profile
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="w-24 h-24 bg-slate-300 rounded-full mx-auto mb-4"></div>
          <h2 className="text-center font-semibold text-lg">
            Sunny Adesara
          </h2>
          <p className="text-center text-sm text-slate-500">
            Ahmedabad
          </p>

          <button className="mt-6 w-full bg-slate-800 text-white py-2 rounded-lg">
            Edit Profile
          </button>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <p><span className="text-slate-500">Email:</span> sunny@gmail.com</p>
              <p><span className="text-slate-500">Phone:</span> +91 98765 43210</p>
              <p><span className="text-slate-500">Gender:</span> Male</p>
              <p><span className="text-slate-500">Occupation:</span> Student</p>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">PG Preferences</h3>
            <p className="text-sm text-slate-600">
              Single Sharing • AC • Food Included • Near College
            </p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-sm text-slate-500">Bookings</p>
              <p className="text-xl font-semibold">3</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-sm text-slate-500">Saved PGs</p>
              <p className="text-xl font-semibold">5</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-sm text-slate-500">Member Since</p>
              <p className="text-xl font-semibold">2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;