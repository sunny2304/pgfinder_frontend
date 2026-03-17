import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {

  const navigate = useNavigate()

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

      // ✅ STORE DATA
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
    console.log(err);
    toast.error(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-96">

        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition duration-300"
          >
            Login
          </button>

          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
};