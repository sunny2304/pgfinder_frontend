import React, { useState } from "react";
import axios from "axios";

const LandlordDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [propertyForm, setPropertyForm] = useState({
    name: "",
    location: "",
    price: "",
    roomType: "single",
    amenities: [],
    description: "",
  });

  const handleSidebarClick = (section) => {
    setActiveSection(section);
  };

  const handleInputChange = (e) => {
    const { id, value, options } = e.target;
    if (options) {
      // Multi-select amenities
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setPropertyForm({ ...propertyForm, [id]: selected });
    } else {
      setPropertyForm({ ...propertyForm, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/pg_properties", {
        name: propertyForm.name,
        location: propertyForm.location,
        price: propertyForm.price,
        room_type: propertyForm.roomType,
        amenities: propertyForm.amenities.join(","),
        description: propertyForm.description,
      });
      alert("Property added successfully!");
      setPropertyForm({
        name: "",
        location: "",
        price: "",
        roomType: "single",
        amenities: [],
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add property.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <h3 className="text-xl font-semibold border-b pb-3 mb-4">Landlord Panel</h3>
        <ul className="space-y-2">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "properties", label: "My Properties" },
            { id: "add-property", label: "Add Property" },
            { id: "bookings", label: "Booking Requests" },
            { id: "messages", label: "Messages" },
            { id: "profile", label: "Profile" },
          ].map((item) => (
            <li key={item.id}>
              <button
                className={`w-full text-left px-4 py-2 rounded-l-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : "hover:bg-blue-50"
                }`}
                onClick={() => handleSidebarClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeSection === "add-property" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Add New Property</h2>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block font-medium mb-1">
                    Property Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={propertyForm.name}
                    onChange={handleInputChange}
                    placeholder="Enter property name"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block font-medium mb-1">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={propertyForm.location}
                    onChange={handleInputChange}
                    placeholder="Enter property location"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block font-medium mb-1">
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={propertyForm.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="roomType" className="block font-medium mb-1">
                    Room Type
                  </label>
                  <select
                    id="roomType"
                    value={propertyForm.roomType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="amenities" className="block font-medium mb-1">
                    Amenities (Ctrl+Click to select multiple)
                  </label>
                  <select
                    id="amenities"
                    multiple
                    value={propertyForm.amenities}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
                  >
                    <option value="WiFi">WiFi</option>
                    <option value="AC">AC</option>
                    <option value="Laundry">Laundry</option>
                    <option value="Parking">Parking</option>
                    <option value="Food">Food</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={propertyForm.description}
                    onChange={handleInputChange}
                    placeholder="Enter property description"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Property
              </button>
            </form>
          </div>
        )}

        {activeSection !== "add-property" && (
          <div className="text-gray-500 text-center py-20">
            <p className="text-xl">This section is under construction.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;