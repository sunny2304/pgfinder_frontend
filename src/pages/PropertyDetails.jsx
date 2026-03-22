import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [pg, setPg] = useState(null);

  // 🔥 Get booking status
  const bookingStatus = location.state?.bookingStatus;

  useEffect(() => {
    const getProperty = async () => {
      try {
        const res = await axios.get(`/properties/${id}`);
        setPg(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProperty();
  }, [id]);

  if (!pg) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* BACK */}
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">
        ← Back
      </button>

      {/* CARD */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold">{pg.pgName}</h1>

        <p className="text-blue-600 mt-1">₹{pg.rent} / month</p>

        <p className="text-gray-600 mt-2">
          📍 {pg.area}, {pg.city}
        </p>

        <div className="flex gap-4 mt-3">
          <p>👤 {pg.gender}</p>
          <p>🛏 {pg.roomType}</p>
        </div>

        <div className="mt-4">
          <h2 className="font-semibold">Description</h2>
          <p className="text-gray-600">
            {pg.description || "No description"}
          </p>
        </div>
      </div>

      {/* 🔥 BUTTON LOGIC */}
      {bookingStatus === "pending" || bookingStatus === "confirmed" ? (
        <button className="mt-6 w-full bg-gray-400 text-white py-3 rounded-xl cursor-not-allowed">
          Already Booked
        </button>
      ) : (
        <button
          onClick={() => navigate(`/user/book/${pg._id}`)}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
        >
          Book Now
        </button>
      )}
    </div>
  );
};

export default PropertyDetails;