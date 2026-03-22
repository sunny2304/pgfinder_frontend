import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export const BrowsePG = () => {
  const navigate = useNavigate();
  const [pgs, setPgs] = useState([]);
  const [searchParams] = useSearchParams();

  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  // APPLIED FILTERS
  const [filters, setFilters] = useState({
    location: "",
    gender: "",
    minPrice: "",
    maxPrice: "",
    amenities: []
  });

  // TEMP FILTERS (UI ONLY)
  const [tempFilters, setTempFilters] = useState({
    location: searchParams.get("location") || "",
    gender: "",
    minPrice: "",
    maxPrice: "",
    amenities: []
  });

  const amenitiesList = ["wifi", "ac", "meals", "laundry", "gym", "parking", "security"];

  // FETCH PRICE RANGE (UI ONLY)
  const getPriceRange = async () => {
    try {
      const res = await axios.get("properties/pricerange");
      setPriceRange({
        min: res.data.minPrice,
        max: res.data.maxPrice
      });
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH PGs
  const getAllPGs = async () => {
    try {
      let params = {};
      if (filters.location) params.location = filters.location;
      if (filters.gender) params.gender = filters.gender;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.amenities.length > 0) params.amenities = filters.amenities.join(",");

      const res = await axios.get("properties", { params });
      setPgs(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPriceRange();
    getAllPGs(); // LOAD ALL DATA INITIALLY
  }, []);

  useEffect(() => {
    getAllPGs();
  }, [filters]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        {/* SIDEBAR */}
        <div className="bg-white p-6 rounded-xl shadow sticky top-20 h-fit">
          <h3 className="text-xl font-semibold mb-4">Filters</h3>

          <input
            type="text"
            value={tempFilters.location}
            onChange={(e) => setTempFilters({ ...tempFilters, location: e.target.value })}
            placeholder="Location"
            className="w-full mb-4 border px-3 py-2 rounded"
          />

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

          {/* PRICE */}
          <div className="mb-6">
            <label className="text-sm">Max Price</label>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={tempFilters.maxPrice || priceRange.max}
              onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: e.target.value })}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-sm">
              <span>₹{priceRange.min}</span>
              <span>₹{tempFilters.maxPrice || priceRange.max}</span>
            </div>
          </div>

          {/* AMENITIES */}
          <div className="mb-6">
            <label className="text-sm font-medium">Amenities</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {amenitiesList.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tempFilters.amenities.includes(item)}
                    onChange={(e) => {
                      let updated = [...tempFilters.amenities];
                      if (e.target.checked) updated.push(item);
                      else updated = updated.filter((a) => a !== item);
                      setTempFilters({ ...tempFilters, amenities: updated });
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* APPLY */}
          <button
            onClick={() => setFilters(tempFilters)}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Apply Filters
          </button>

          {/* RESET */}
          <button
            onClick={() => {
              const reset = { location: "", gender: "", minPrice: "", maxPrice: "", amenities: [] };
              setTempFilters(reset);
              setFilters(reset);
            }}
            className="w-full bg-gray-200 py-2 rounded mt-2"
          >
            Reset
          </button>
        </div>

        {/* RESULTS */}
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Available PGs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pgs.length > 0 ? (
              pgs.map((pg) => (
                <div
                  key={pg._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/user/property/${pg._id}`)}
                >
                  {/* IMAGE */}
                  <div className="h-44 w-full">
                    <img
                      src={pg.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"}
                      alt={pg.pgName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{pg.pgName}</h3>
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