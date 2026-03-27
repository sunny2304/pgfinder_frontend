import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/register", {
        ...data,
        role,
      });

      if (res.status === 201) {
        toast.success("User registered successfully");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ fontFamily: "Poppins, sans-serif", background: "#f1f5f9" }}
    >
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* First + Last Name */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="First Name"
              className="w-1/2 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              {...register("firstName", { required: "First name required" })}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-1/2 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              {...register("lastName", { required: "Last name required" })}
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            {...register("email", { required: "Email is required" })}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            {...register("password", {
              required: "Password required",
              minLength: { value: 6, message: "Min 6 chars" },
            })}
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />

          {/* Role */}
          <div className="flex gap-4">
            <div
              onClick={() => setRole("user")}
              className={`flex-1 text-center p-3 rounded-lg cursor-pointer ${
                role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              Tenant
            </div>

            <div
              onClick={() => setRole("landlord")}
              className={`flex-1 text-center p-3 rounded-lg cursor-pointer ${
                role === "landlord"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              Landlord
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" required />
            <span>
              I agree to{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/t&c")}
              >
                Terms
              </span>{" "}
              &{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/privacypolicy")}
              >
                Privacy Policy
              </span>
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};