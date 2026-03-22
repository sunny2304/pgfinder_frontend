import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`/users/${userId}/bookings`);
      setBookings(res.data);
    } catch (err) {
      toast.error("Failed to load bookings");
    }
  };

  // ❌ Cancel Booking
  const handleCancel = async (bookingId) => {
    try {
      await axios.patch(`/bookings/${bookingId}/status`, {
        status: "cancelled",
      });

      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center mt-24">
          <p className="text-gray-500 text-lg">No bookings yet 😕</p>
          <button
            onClick={() => navigate("/user/browse")}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse PGs
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const isCancelled = booking.bookingStatus === "cancelled";

            return (
              <div
                key={booking._id}
                className={`p-6 rounded-2xl border shadow-md ${isCancelled
                  ? "bg-gray-100 opacity-70"
                  : "bg-white hover:shadow-xl"
                  }`}
              >
                {/* TOP */}
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-600">
                      {booking.pgId?.pgName}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      📍 {booking.pgId?.city}
                    </p>
                  </div>
                  {/* STATUS  */}
                  <span
                    className={`inline-flex items-center justify-center 
  px-4 h-7 text-xs font-medium rounded-full whitespace-nowrap
  ${booking.bookingStatus === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : booking.bookingStatus === "cancelled"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                  >
                    {booking.bookingStatus}
                  </span>
                </div>

                {/* INFO */}
                <div className="mt-4 text-sm text-gray-700">
                  <p>💰 ₹{booking.pgId?.rent} / month</p>
                  <p>🛏 Room: {booking.roomType}</p>
                  <p>
                    📅{" "}
                    {new Date(booking.checkInDate).toLocaleDateString()} →{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/user/property/${booking.pgId?._id}`, {
                        state: {
                          bookingStatus: booking.bookingStatus, // 🔥 IMPORTANT
                        },
                      })
                    }
                    className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50"
                  >
                    View Details
                  </button>

                  {!isCancelled && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;