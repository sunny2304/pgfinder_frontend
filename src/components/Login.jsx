import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-1 bg-[#1a2744] relative overflow-hidden p-14 items-end">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80')] bg-cover bg-center opacity-25"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2744] via-[#1a2744]/70 to-transparent"></div>

        <div className="relative z-10 text-white">
          <div className="text-xl font-bold mb-6">
            PG<span className="text-teal-400">Finder</span>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-4">
            Welcome <br />
            <span className="italic text-teal-300">back.</span>
          </h2>

          <p className="text-gray-300 max-w-md mb-8">
            Thousands of verified PGs waiting for you. Log in and continue your search.
          </p>

          <div className="bg-white/10 border border-white/20 rounded-xl p-5 backdrop-blur">
            <p className="text-sm italic text-gray-200">
              "Found my perfect PG within 2 days. The booking process was seamless!"
            </p>

            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-sm font-bold">
                P
              </div>
              <div>
                <p className="text-sm font-semibold">Priya Sharma</p>
                <p className="text-xs text-gray-400">Tenant · Bengaluru</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-[500px] bg-white flex flex-col justify-center px-10 py-12">

        <h1 className="text-3xl font-bold text-[#1a2744] mb-2">
          Log In
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-600 font-semibold">
            Sign up free →
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 my-4 text-gray-400 text-sm">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          continue with email
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-xs font-bold uppercase text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              placeholder="priya@email.com"
              {...register("email", { required: true })}
              className="w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4 relative">
            <label className="text-xs font-bold uppercase text-gray-500">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              {...register("password", { required: true })}
              className="w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            {/* Eye Icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-[#1a2744] transition"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58A2 2 0 0013.42 13.42" />
                  <path d="M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 7 9 7a16.5 16.5 0 01-3.07 3.94M6.1 6.1A16.5 16.5 0 003 12s4 7 9 7a9.77 9.77 0 004.12-.91" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                  <path d="M1.5 12s4.5-7 10.5-7 10.5 7 10.5 7-4.5 7-10.5 7S1.5 12 1.5 12z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              )}
            </span>
          </div>

          {/* REMEMBER */}
          <div className="flex justify-between items-center mb-5 text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-teal-500" />
              Remember me
            </label>

            <Link to="/forgot-password" className="text-teal-600 font-semibold">
              Forgot password?
            </Link>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#1a2744] text-white py-3 rounded-xl font-bold hover:bg-[#243356] transition"
          >
            Log In →
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-600 font-semibold">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}