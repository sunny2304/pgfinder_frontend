import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/login", data);

      if (res.status === 200) {
        toast.success("Login Success");

        const user = res.data.data;

        localStorage.setItem("userId", user._id);
        localStorage.setItem("token", res.data.token);

        const role = user.role;

        if (role === "user" || role === "USER") {
          navigate("/user");
        } else if (role === "admin" || role === "ADMIN") {
          navigate("/admin");
        } else {
          toast.error("Invalid role");
          navigate("/");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 font-sans">

      {/* Form Container */}
      <div className="w-full max-w-md bg-white p-8 rounded-[12px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">

        <h2 className="text-2xl font-semibold text-center text-[#1e293b] mb-8 relative">
          Welcome Back
          {/* underline like your CSS */}
          <span className="block w-12 h-[3px] bg-[#2c6bed] mx-auto mt-2"></span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#1e293b]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-[8px] text-sm focus:outline-none focus:border-[#2c6bed] focus:ring-2 focus:ring-[rgba(44,107,237,0.1)] transition"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#1e293b]">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-[8px] text-sm focus:outline-none focus:border-[#2c6bed] focus:ring-2 focus:ring-[rgba(44,107,237,0.1)] transition"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-[#64748b]">Remember me</span>
            </div>

            <Link
              to="/forgot-password"
              className="text-[#2c6bed] hover:text-[#0d9488] transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#2c6bed] text-white py-3 rounded-[8px] font-medium hover:bg-[#1d4ed8] transition hover:-translate-y-[1px]"
          >
            Login
          </button>

          {/* Signup */}
          <p className="text-center text-sm text-[#64748b] mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#2c6bed] font-medium hover:text-[#0d9488]"
            >
              Sign Up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};