import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export const BrowsePG = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [pgs, setPgs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Applied filters
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    gender: "",
    minPrice: "",
    maxPrice: "",
    amenities: []
  });

  // Temporary filters for UI
  const [tempFilters, setTempFilters] = useState({ ...filters });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 }); // max will be dynamic

  const amenitiesList = ["wifi", "ac", "meals", "laundry", "gym", "parking", "security"];

  // =============================
  // FETCH ALL PGs (used for dynamic max price)
  // =============================
  const getAllPGs = async () => {
    try {
      let params = {};
      if (filters.location) params.location = filters.location;
      if (filters.gender) params.gender = filters.gender;
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
      if (filters.amenities.length > 0) params.amenities = filters.amenities.join(",");

      const res = await axios.get("/properties", { params });
      setPgs(res.data.data);

      // Dynamically calculate max rent
      if (res.data.data.length > 0) {
        const rents = res.data.data.map(pg => pg.rent);
        const maxRent = Math.max(...rents);
        const minRent = Math.min(...rents);
        setPriceRange({ min: minRent, max: maxRent });
      } else {
        setPriceRange({ min: 0, max: 0 });
      }
    } catch (err) {
      console.log("Error fetching PGs:", err);
    }
  };

  // =============================
  // INITIAL LOAD
  // =============================
  useEffect(() => {
    getAllPGs();
  }, [filters]);

  // =============================
  // APPLY FILTERS
  // =============================
  const handleApply = () => {
    if (tempFilters.minPrice && Number(tempFilters.minPrice) < priceRange.min) {
      alert(`Min price cannot be less than ₹${priceRange.min}`);
      return;
    }
    if (tempFilters.maxPrice && Number(tempFilters.maxPrice) > priceRange.max) {
      alert(`Max price cannot exceed ₹${priceRange.max}`);
      return;
    }
    if (tempFilters.minPrice && tempFilters.maxPrice &&
        Number(tempFilters.minPrice) > Number(tempFilters.maxPrice)) {
      alert("Min price cannot be greater than Max price");
      return;
    }

    setFilters({ ...tempFilters });
    setShowFilters(false);
  };

  // =============================
  // RESET FILTERS
  // =============================
  const handleReset = () => {
    const reset = { location: "", gender: "", minPrice: "", maxPrice: "", amenities: [] };
    setTempFilters(reset);
    setFilters(reset);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Filter Button */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setShowFilters(true)}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Filters
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-4 gap-6">

        {/* FILTER SIDEBAR */}
        <div className={`
          fixed md:static top-0 left-0
          w-3/4 sm:w-1/2 md:w-full
          h-full md:h-fit overflow-y-auto
          bg-white p-6 shadow-lg
          z-[100] md:z-auto
          transform transition-transform duration-300
          ${showFilters ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}>
          <div className="md:hidden flex justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={() => setShowFilters(false)}>✖</button>
          </div>

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            value={tempFilters.location}
            onChange={(e) => setTempFilters({ ...tempFilters, location: e.target.value })}
            className="w-full mb-4 border px-3 py-2 rounded"
          />

          {/* Gender */}
          <select
            value={tempFilters.gender}
            onChange={(e) => setTempFilters({ ...tempFilters, gender: e.target.value })}
            className="w-full mb-4 border px-3 py-2 rounded"
          >
            <option value="">All Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>

          {/* Price */}
          <div className="mb-4">
            <label className="text-sm">Min Price</label>
            <input
              type="number"
              placeholder={`₹${priceRange.min}`}
              value={tempFilters.minPrice}
              onChange={(e) => setTempFilters({ ...tempFilters, minPrice: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
          <div className="mb-6">
            <label className="text-sm">Max Price</label>
            <input
              type="number"
              placeholder={`₹${priceRange.max}`}
              value={tempFilters.maxPrice}
              onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <label className="text-sm font-medium">Amenities</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {amenitiesList.map(item => (
                <label key={item} className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tempFilters.amenities.includes(item)}
                    onChange={(e) => {
                      let updated = [...tempFilters.amenities];
                      if (e.target.checked) updated.push(item);
                      else updated = updated.filter(a => a !== item);
                      setTempFilters({ ...tempFilters, amenities: updated });
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={handleApply}
            className="w-full bg-blue-600 text-white py-2 rounded mb-2"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="w-full bg-gray-200 py-2 rounded"
          >
            Reset
          </button>
        </div>

        {/* Overlay */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-[50]"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* PG RESULTS */}
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Available PGs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pgs.length > 0 ? (
              pgs.map(pg => (
                <div
                  key={pg._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/user/property/${pg._id}`)}
                >
                  <div className="h-44 w-full">
                    <img
                      src={pg.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"}
                      alt={pg.pgName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{pg.pgName}</h3>
                    <p className="text-sm text-gray-500 mt-1">📍 {pg.area}, {pg.city}</p>
                    <p className="text-blue-600 font-bold mt-2 text-lg">
                      ₹{pg.rent} <span className="text-sm text-gray-500 font-normal">/month</span>
                    </p>
                    <p className="text-xs text-gray-600 capitalize mt-1">👤 {pg.gender}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {pg.amenities?.slice(0, 3).map((item, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>

                    <button
                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/property/${pg._id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <h3 className="text-xl font-semibold">No PGs found</h3>
                <p className="text-gray-500">Try changing filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};