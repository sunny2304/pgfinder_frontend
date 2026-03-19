// src/pages/PropertyDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pg, setPg] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchPG = async () => {
      try {
        const res = await axios.get(`/properties/${id}`);
        setPg(res.data.pg);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPG();
  }, [id]);

  if (!pg) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Browse PGs
      </button>

      {/* PG Name & Price */}
      <h1 className="text-3xl font-bold mb-2">{pg.pgName}</h1>
      <p className="text-xl text-blue-600 font-semibold mb-4">
        ₹{pg.rent} /month
      </p>

      {/* Description */}
      <p className="text-gray-700 mb-6">{pg.description}</p>

      {/* Location & Gender & Room Type */}
      <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
        <p>📍 {pg.area}, {pg.city}</p>
        <p>👤 {pg.gender}</p>
        <p>🛏 {pg.roomType} Room</p>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pg.amenities?.map((amenity, i) => (
          <span
            key={i}
            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
          >
            {amenity}
          </span>
        ))}
      </div>

      {/* Reviews */}
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((rev) => (
          <div key={rev._id} className="border-b py-3">
            <p className="font-semibold">{rev.userName}</p>
            <p className="text-sm text-gray-500">{rev.comment}</p>
            <p className="text-xs text-gray-400">Rating: {rev.rating} / 5</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 mb-6">No reviews yet.</p>
      )}

      {/* Book Now Button */}
      <button
        onClick={() => navigate("/checkout")}
        className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Book Now
      </button>
    </div>
  );
};