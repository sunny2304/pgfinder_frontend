import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/forgotpassword", data);
      if (res.status === 200) {
        toast.success("Reset link sent! Check your email.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── LEFT PANEL ── */}
      <div className="flex-1 relative overflow-hidden flex-col justify-end p-16 min-h-[500px] bg-[#1a2744] hidden lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(26,39,68,0.97) 0%, rgba(26,39,68,0.4) 70%, transparent 100%)",
          }}
        />
        <div className="relative z-10">
          <span
            className="block text-white text-xl font-black mb-8"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            PG<span className="text-[#2a7c6f]">Finder</span>
          </span>

          <h2
            className="text-4xl font-black text-white leading-tight mb-4"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Forgot your <br />
            <span className="text-[#7dd3c8] italic">password?</span>
          </h2>

          <p className="text-white/65 text-base leading-relaxed max-w-sm">
            No worries. Enter your registered email and we'll send you a secure
            link to reset it instantly.
          </p>

          <div className="mt-10 bg-white/[0.07] border border-white/[0.12] rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#2a7c6f] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">Check your inbox</p>
                <p className="text-white/60 text-sm leading-relaxed">
                  The reset link expires in 15 minutes. Check your spam folder if you don't see it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-[500px] bg-white flex flex-col justify-center px-8 py-16 lg:px-14 overflow-y-auto">
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm text-[#8a7f74] hover:text-[#1a2744] transition-colors mb-10 w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to login
        </Link>

        <h1
          className="text-3xl font-black text-[#1a2744] mb-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Reset Password
        </h1>
        <p className="text-[#8a7f74] text-sm mb-10">
          Enter your email and we'll send you a reset link.
        </p>

        <div className="flex items-center gap-4 mb-7 text-[#8a7f74] text-xs">
          <span className="flex-1 h-px bg-[#e2ddd6]" />
          enter your email
          <span className="flex-1 h-px bg-[#e2ddd6]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#8a7f74]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="priya@email.com"
              className={`bg-[#faf9f7] border-[1.5px] rounded-xl text-[#1a1a1a] text-sm px-3.5 py-3 outline-none w-full transition-all focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.1)] focus:bg-white ${
                errors.email ? "border-red-400" : "border-[#e2ddd6]"
              }`}
              style={{ fontFamily: "'Outfit', sans-serif" }}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#1a2744] text-white font-bold text-base cursor-pointer transition-all hover:bg-[#243356] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {loading ? "Sending..." : "Send Reset Link →"}
          </button>
        </form>

        <div className="text-center mt-7 text-sm text-[#8a7f74]">
          Remembered it?{" "}
          <Link to="/login" className="text-[#2a7c6f] font-semibold no-underline hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}