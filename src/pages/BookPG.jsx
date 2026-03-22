import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BookPG = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [roomType, setRoomType] = useState("");
  const [gender, setGender] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch(() => toast.error("Failed to load property"));
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate || !roomType) {
      return toast.error("Please fill all required fields");
    }

    try {
      await axios.post(
        `/users/${userId}/properties/${id}/bookings`,
        {
          checkInDate,
          checkOutDate,
          roomType,
          gender,
        }
      );

      toast.success("Booking successful 🎉");
    } catch (err) {
      toast.error("Booking failed");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Book Your PG
      </h1>

      {/* PROPERTY CARD */}
      {property && (
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6 border">
          <h2 className="text-2xl font-semibold text-blue-600">
            {property.pgName}
          </h2>

          <p className="text-gray-600 mt-2">
            {property.address}, {property.city}
          </p>

          <p className="text-lg font-medium mt-3 text-gray-800">
            ₹{property.rent} / month
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {property.amenities?.map((a, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleBooking}
        className="bg-white shadow-md rounded-2xl p-6 space-y-5 border"
      >
        <h2 className="text-xl font-semibold text-gray-700">
          Booking Details
        </h2>

        {/* ROOM TYPE */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">
            Room Type *
          </label>

          <div className="flex gap-4">
            {["single", "double", "triple"].map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setRoomType(type)}
                className={`px-4 py-2 rounded-lg border transition ${
                  roomType === type
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:border-blue-500"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* GENDER */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">
            Preferred Gender (optional)
          </label>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border p-2 rounded-lg focus:outline-blue-500"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* DATES */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">
              Check-in Date *
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full border p-2 rounded-lg focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">
              Check-out Date *
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full border p-2 rounded-lg focus:outline-blue-500"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-medium"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookPG;