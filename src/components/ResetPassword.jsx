import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.put("/resetpassword", {
        newPassword: data.newPassword,
        token: token,
      });
      if (res.status === 200) {
        toast.success("Password reset successfully! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const EyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A2 2 0 0013.42 13.42" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 7 9 7a16.5 16.5 0 01-3.07 3.94M6.1 6.1A16.5 16.5 0 003 12s4 7 9 7a9.77 9.77 0 004.12-.91" />
    </svg>
  );

  const EyeClosed = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12s4.5-7 10.5-7 10.5 7 10.5 7-4.5 7-10.5 7S1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );

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
            Create a new <br />
            <span className="text-[#7dd3c8] italic">password.</span>
          </h2>

          <p className="text-white/65 text-base leading-relaxed max-w-sm">
            Choose a strong password you haven't used before. Your account
            security is our priority.
          </p>

          <div className="mt-10 bg-white/[0.07] border border-white/[0.12] rounded-2xl p-6 backdrop-blur-md">
            <p className="text-white font-semibold text-sm mb-3">Password tips</p>
            <ul className="space-y-2">
              {[
                "At least 8 characters long",
                "Mix of uppercase & lowercase",
                "Include numbers and symbols",
              ].map((tip) => (
                <li key={tip} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#2a7c6f] flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-white/70 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
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
          New Password
        </h1>
        <p className="text-[#8a7f74] text-sm mb-10">
          Enter and confirm your new password below.
        </p>

        <div className="flex items-center gap-4 mb-7 text-[#8a7f74] text-xs">
          <span className="flex-1 h-px bg-[#e2ddd6]" />
          set new password
          <span className="flex-1 h-px bg-[#e2ddd6]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* NEW PASSWORD */}
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#8a7f74]">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className={`bg-[#faf9f7] border-[1.5px] rounded-xl text-[#1a1a1a] text-sm px-3.5 py-3 pr-11 outline-none w-full transition-all focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.1)] focus:bg-white ${
                  errors.newPassword ? "border-red-400" : "border-[#e2ddd6]"
                }`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a7f74] hover:text-[#1a2744] bg-transparent border-none cursor-pointer flex items-center transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-0.5">{errors.newPassword.message}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex flex-col gap-1.5 mb-6">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#8a7f74]">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                className={`bg-[#faf9f7] border-[1.5px] rounded-xl text-[#1a1a1a] text-sm px-3.5 py-3 pr-11 outline-none w-full transition-all focus:border-[#2a7c6f] focus:shadow-[0_0_0_3px_rgba(42,124,111,0.1)] focus:bg-white ${
                  errors.confirmPassword ? "border-red-400" : "border-[#e2ddd6]"
                }`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === watch("newPassword") || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a7f74] hover:text-[#1a2744] bg-transparent border-none cursor-pointer flex items-center transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#1a2744] text-white font-bold text-base cursor-pointer transition-all hover:bg-[#243356] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {loading ? "Resetting..." : "Reset Password →"}
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