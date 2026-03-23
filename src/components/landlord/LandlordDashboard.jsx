import React, { useState } from "react";
import axios from "axios";

const LandlordDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    room_type: "single",
    amenities: [],
    description: "",
  });

  const handleChange = (e) => {
    const { id, value, options } = e.target;

    if (options) {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setFormData({ ...formData, [id]: selected });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/properties", {
        landlord_id: 1,
        name: formData.name,
        location: formData.location,
        price: formData.price,
        room_type: formData.room_type,
        amenities: formData.amenities.join(","),
        description: formData.description,
      });

      alert("Property added successfully!");

      setFormData({
        name: "",
        location: "",
        price: "",
        room_type: "single",
        amenities: [],
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding property");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <h3 className="px-5 py-4 text-lg font-semibold border-b">
          Landlord Panel
        </h3>

        <ul>
          {[
            "dashboard",
            "properties",
            "add-property",
            "bookings",
            "messages",
            "profile",
          ].map((item) => (
            <li key={item}>
              <button
                onClick={() => setActiveSection(item)}
                className={`w-full text-left px-5 py-3 transition ${
                  activeSection === item
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.replace("-", " ").toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Landlord Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">🏠</div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-gray-500">Total Properties</div>
              </div>

              <div className="bg-white shadow rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-gray-500">Active Bookings</div>
              </div>

              <div className="bg-white shadow rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">₹</div>
                <div className="text-2xl font-bold">1.8L</div>
                <div className="text-gray-500">Total Earnings</div>
              </div>

              <div className="bg-white shadow rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold">4.7</div>
                <div className="text-gray-500">Avg Rating</div>
              </div>

            </div>
          </div>
        )}

        {/* ADD PROPERTY */}
        {activeSection === "add-property" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Add New Property</h2>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow max-w-3xl"
            >
              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="block mb-1 font-medium">
                    Property Name
                  </label>
                  <input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Location
                  </label>
                  <input
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    type="text"
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Monthly Rent (₹)
                  </label>
                  <input
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="number"
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Room Type
                  </label>
                  <select
                    id="room_type"
                    value={formData.room_type}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">
                    Amenities (Ctrl + Click)
                  </label>
                  <select
                    id="amenities"
                    multiple
                    value={formData.amenities}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 h-28 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="WiFi">WiFi</option>
                    <option value="AC">AC</option>
                    <option value="Laundry">Laundry</option>
                    <option value="Meals">Meals</option>
                    <option value="Gym">Gym</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add Property
              </button>
            </form>
          </div>
        )}

        {/* OTHER SECTIONS */}
        {["properties", "bookings", "messages", "profile"].includes(activeSection) && (
          <div className="text-center mt-20 text-gray-500">
            <h2 className="text-xl font-semibold">
              {activeSection.replace("-", " ").toUpperCase()}
            </h2>
            <p className="mt-2">UI ready. Backend connection coming next.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;