import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // <--- add this

const UserProfile = () => {
  const navigate = useNavigate(); // <--- initialize navigate
  const [user, setUser] = useState(null);

  // fetch profile data
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
    } catch (err) {
      alert("Failed to load profile");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (!user) return <h2 className="text-center mt-10">Loading...</h2>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>

      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT CARD */}
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <img
            src={user.profilePic || "https://via.placeholder.com/100"}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            alt="profile"
          />
          <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <span className="inline-block mt-3 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
            {user.role}
          </span>
          <p className="mt-3 text-sm">
            Status: <span className="text-green-600 font-medium">{user.status}</span>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:col-span-2 space-y-6">

          {/* ACCOUNT INFO */}
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Full Name</span><span>{user.firstName} {user.lastName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{user.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Role</span><span>{user.role}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Member Since</span><span>{new Date(user.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Bookings</p>
                <h2 className="text-xl font-bold text-blue-600">0</h2>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Reviews Given</p>
                <h2 className="text-xl font-bold text-green-600">0</h2>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            {/* FIXED: Navigate to edit page */}
            <button
              onClick={() => navigate("/user/edit-profile")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;