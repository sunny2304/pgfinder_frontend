import React, { useEffect, useState } from "react";
import axios from "axios";

export const BrowsePG = () => {

  const [pgs, setPgs] = useState([]);

  const getAllPGs = async () => {
    try {
      const res = await axios.get("/properties");
      setPgs(res.data.data || res.data); // handle both cases
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllPGs();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-6">

      <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
        Browse PGs
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {pgs.length > 0 ? (
          pgs.map((pg) => (
            <div
              key={pg._id}
              className="bg-white shadow-lg rounded-xl p-4"
            >
              <h3 className="text-xl font-bold text-green-700">
                {pg.pgName}
              </h3>

              <p className="text-gray-600">
                📍 {pg.area}, {pg.city}
              </p>

              <p className="mt-2">
                💰 Rent: ₹{pg.rent}
              </p>

              <p>
                🛏 Room: {pg.roomType}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {pg.description}
              </p>

              <div className="mt-2">
                <strong>Amenities:</strong>
                <ul className="text-sm">
                  {pg.amenities?.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>

              <p className="mt-2 text-sm">
                Status: {pg.available ? "Available ✅" : "Not Available ❌"}
              </p>

            </div>
          ))
        ) : (
          <p>No PGs found</p>
        )}

      </div>

    </div>
  );
};