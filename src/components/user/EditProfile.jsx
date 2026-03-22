import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    requestStatus: "", // stores requested status
  });

  // possible statuses according to your user model
  const statusOptions = ["active", "inactive", "deleted", "blocked"];

  // fetch current profile data
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        firstName: res.data.data.firstName,
        lastName: res.data.data.lastName,
        requestStatus: "", // default empty
      });
    } catch {
      alert("Failed to load profile");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/profile-advanced",
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated!");
      navigate("/user/profile");
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 space-y-4">

        {/* First Name */}
        <div>
          <label className="block mb-1 text-sm">First Name</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 text-sm">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Request Status Dropdown */}
        <div>
          <label className="block mb-1 text-sm">Request Status Change</label>
          <select
            name="requestStatus"
            value={form.requestStatus}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="">-- Select Status --</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/user/profile")}
            className="border px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProfile;