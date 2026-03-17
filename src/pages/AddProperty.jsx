import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export const AddProperty = () => {

  const {
    register,
    handleSubmit,
    reset
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await axios.post(
        `/users/${userId}/properties`,
        {
          ...data,
          rent: Number(data.rent), // convert to number
          amenities: data.amenities.split(",") // string → array
        }
      );

      if (res.status === 201) {
        toast.success("Property Added Successfully ✅");
        reset();
      }

    } catch (err) {
      console.log(err);
      toast.error("Failed to add property ❌");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50 p-4">
      
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        
        <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
          Add Property
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* PG Name */}
          <input
            type="text"
            placeholder="PG Name"
            {...register("pgName", { required: true })}
            className="w-full border p-2 rounded"
          />

          {/* City */}
          <input
            type="text"
            placeholder="City"
            {...register("city")}
            className="w-full border p-2 rounded"
          />

          {/* Area */}
          <input
            type="text"
            placeholder="Area"
            {...register("area")}
            className="w-full border p-2 rounded"
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            {...register("address")}
            className="w-full border p-2 rounded"
          />

          {/* Rent */}
          <input
            type="number"
            placeholder="Rent"
            {...register("rent")}
            className="w-full border p-2 rounded"
          />

          {/* Room Type */}
          <select
            {...register("roomType")}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Room Type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
          </select>

          {/* Amenities */}
          <input
            type="text"
            placeholder="Amenities (comma separated)"
            {...register("amenities")}
            className="w-full border p-2 rounded"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            {...register("description")}
            className="w-full border p-2 rounded"
          />

          {/* Available */}
          <select
            {...register("available")}
            className="w-full border p-2 rounded"
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Add Property
          </button>

        </form>

      </div>
    </div>
  );
};