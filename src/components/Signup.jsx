import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [loading, setLoading]           = useState(false);
  const navigate = useNavigate();

  const passwordValue = watch("password", "");

  // ── password strength helper
  const getStrength = (val) => {
    if (!val) return { score: 0, label: "Enter a password", color: "#e2ddd6" };
    if (val.length < 6)  return { score: 1, label: "Weak",    color: "#e05a3a" };
    if (val.length < 10) return { score: 2, label: "Fair",    color: "#c8922a" };
    return                      { score: 3, label: "Strong ✓", color: "#2a7c6f" };
  };
  const strength = getStrength(passwordValue);

  // ── submit → POST /register
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        phone:     data.phone,
        password:  data.password,
        role:      selectedRole,
      };

      const res = await axios.post("/register", payload);

      if (res.status === 201) {
        toast.success("Account created! Welcome to PGFinder 🎉");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    background: "#faf9f7",
    border: hasError ? "1.5px solid #e05a3a" : "1.5px solid #e2ddd6",
    fontFamily: "'Outfit', sans-serif",
    color: "#1a1a1a",
  });

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div
        className="hidden md:flex flex-1 relative overflow-hidden p-14 items-end"
        style={{ background: "#1a2744" }}
      >
        {/* bg photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80')",
            opacity: 0.22,
          }}
        />
        {/* gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(26,39,68,0.97) 0%, rgba(26,39,68,0.5) 60%, transparent 100%)",
          }}
        />

        {/* content */}
        <div className="relative z-10 text-white">
          {/* Logo */}
          <div
            className="text-2xl font-black mb-8 tracking-tight cursor-pointer"
            style={{ fontFamily: "'Fraunces', serif", color: "#fff" }}
          >
            PG<span style={{ color: "#2a7c6f" }}>Finder</span>
          </div>

          <h2
            className="text-4xl font-black leading-tight mb-4"
            style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-1px" }}
          >
            Your perfect <br />
            <span className="italic" style={{ color: "#7dd3c8" }}>
              home
            </span>{" "}
            awaits.
          </h2>

          <p className="mb-10 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", maxWidth: 380 }}>
            Join 48,000+ happy tenants who found their ideal PG through PGFinder.
            Quick, safe, and completely reliable.
          </p>

          {/* Stats strip */}
          <div className="flex gap-8 mb-10">
            {[
              { num: "12,400+", lbl: "Properties" },
              { num: "98%",     lbl: "Verified" },
              { num: "320+",    lbl: "Cities" },
            ].map((s) => (
              <div key={s.lbl}>
                <div
                  className="text-2xl font-black"
                  style={{ fontFamily: "'Fraunces', serif", color: "#7dd3c8" }}
                >
                  {s.num}
                </div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(10px)",
            }}
          >
            <p className="text-sm italic leading-relaxed" style={{ color: "rgba(255,255,255,0.82)" }}>
              "Listed my property on PGFinder and got my first tenant within a
              week. Amazing platform for landlords!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "#c8922a", color: "#fff" }}
              >
                R
              </div>
              <div>
                <div className="text-sm font-semibold">Ramesh Kumar</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Landlord · 4 Properties
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────── */}
      <div
        className="w-full md:w-[520px] flex flex-col justify-center overflow-y-auto"
        style={{ background: "#fff", padding: "48px 52px" }}
      >
        {/* Mobile logo */}
        <div
          className="text-xl font-black mb-6 md:hidden"
          style={{ fontFamily: "'Fraunces', serif", color: "#1a2744" }}
        >
          PG<span style={{ color: "#2a7c6f" }}>Finder</span>
        </div>

        <h1
          className="text-3xl font-black mb-1"
          style={{ fontFamily: "'Fraunces', serif", color: "#1a2744" }}
        >
          Create Account
        </h1>
        <p className="text-sm mb-7" style={{ color: "#8a7f74" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold" style={{ color: "#2a7c6f" }}>
            Log in →
          </Link>
        </p>

        {/* ── Role Selector ── */}
        <p className="text-xs font-bold uppercase mb-3" style={{ letterSpacing: "1px", color: "#8a7f74" }}>
          I am a
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            {
              key: "user",
              label: "Tenant",
              icon: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              ),
            },
            {
              key: "landlord",
              label: "Landlord",
              icon: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              ),
            },
          ].map((r) => {
            const active = selectedRole === r.key;
            return (
              <div
                key={r.key}
                onClick={() => setSelectedRole(r.key)}
                className="flex flex-col items-center gap-2 py-4 rounded-xl cursor-pointer transition-all"
                style={{
                  border: active ? "1.5px solid #2a7c6f" : "1.5px solid #e2ddd6",
                  background: active ? "#e8f5f3" : "#faf9f7",
                  color: active ? "#2a7c6f" : "#8a7f74",
                }}
              >
                {r.icon}
                <span className="text-sm font-semibold">{r.label}</span>
              </div>
            );
          })}
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* First + Last name */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-2" style={{ letterSpacing: "0.9px", color: "#8a7f74" }}>
                First Name
              </label>
              <input
                type="text"
                placeholder="Priya"
                {...register("firstName", { required: "First name is required" })}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle(errors.firstName)}
                onFocus={(e) => (e.target.style.borderColor = "#2a7c6f")}
                onBlur={(e) => (e.target.style.borderColor = errors.firstName ? "#e05a3a" : "#e2ddd6")}
              />
              {errors.firstName && (
                <p className="text-xs mt-1" style={{ color: "#e05a3a" }}>{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2" style={{ letterSpacing: "0.9px", color: "#8a7f74" }}>
                Last Name
              </label>
              <input
                type="text"
                placeholder="Sharma"
                {...register("lastName", { required: "Last name is required" })}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle(errors.lastName)}
                onFocus={(e) => (e.target.style.borderColor = "#2a7c6f")}
                onBlur={(e) => (e.target.style.borderColor = errors.lastName ? "#e05a3a" : "#e2ddd6")}
              />
              {errors.lastName && (
                <p className="text-xs mt-1" style={{ color: "#e05a3a" }}>{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase mb-2" style={{ letterSpacing: "0.9px", color: "#8a7f74" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="priya@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={inputStyle(errors.email)}
              onFocus={(e) => (e.target.style.borderColor = "#2a7c6f")}
              onBlur={(e) => (e.target.style.borderColor = errors.email ? "#e05a3a" : "#e2ddd6")}
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: "#e05a3a" }}>{errors.email.message}</p>
            )}
          </div>

          {/* ── Phone Number (NEW) ── */}
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase mb-2" style={{ letterSpacing: "0.9px", color: "#8a7f74" }}>
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="9876543210"
              maxLength={10}
              {...register("phone", {
                required: "Mobile number is required",
                pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit mobile number" },
              })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={inputStyle(errors.phone)}
              onFocus={(e) => (e.target.style.borderColor = "#2a7c6f")}
              onBlur={(e) => (e.target.style.borderColor = errors.phone ? "#e05a3a" : "#e2ddd6")}
            />
            {errors.phone && (
              <p className="text-xs mt-1" style={{ color: "#e05a3a" }}>{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-1">
            <label className="block text-xs font-bold uppercase mb-2" style={{ letterSpacing: "0.9px", color: "#8a7f74" }}>
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                style={inputStyle(errors.password)}
                onFocus={(e) => (e.target.style.borderColor = "#2a7c6f")}
                onBlur={(e) => (e.target.style.borderColor = errors.password ? "#e05a3a" : "#e2ddd6")}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                style={{ color: "#8a7f74" }}
              >
                {showPassword ? (
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 3l18 18"/>
                    <path d="M10.58 10.58A2 2 0 0013.42 13.42"/>
                    <path d="M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 7 9 7a16.5 16.5 0 01-3.07 3.94M6.1 6.1A16.5 16.5 0 003 12s4 7 9 7a9.77 9.77 0 004.12-.91"/>
                  </svg>
                ) : (
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1.5 12s4.5-7 10.5-7 10.5 7 10.5 7-4.5 7-10.5 7S1.5 12 1.5 12z"/>
                    <circle cx="12" cy="12" r="2.5"/>
                  </svg>
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-xs mt-1" style={{ color: "#e05a3a" }}>{errors.password.message}</p>
            )}
          </div>

          {/* Password strength bars */}
          <div className="mb-4 mt-2">
            <div className="flex gap-1.5 mb-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-all duration-300"
                  style={{ background: i <= strength.score ? strength.color : "#e2ddd6" }}
                />
              ))}
            </div>
            <p className="text-xs" style={{ color: strength.score > 0 ? strength.color : "#8a7f74" }}>
              {strength.label}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase mb-2" style={{ letterSpacing: "0.9px", color: "#8a7f74" }}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) => val === passwordValue || "Passwords do not match",
                })}
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                style={inputStyle(errors.confirmPassword)}
                onFocus={(e) => (e.target.style.borderColor = "#2a7c6f")}
                onBlur={(e) => (e.target.style.borderColor = errors.confirmPassword ? "#e05a3a" : "#e2ddd6")}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: "#8a7f74" }}
              >
                {showConfirm ? (
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 3l18 18"/>
                    <path d="M10.58 10.58A2 2 0 0013.42 13.42"/>
                    <path d="M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 7 9 7a16.5 16.5 0 01-3.07 3.94M6.1 6.1A16.5 16.5 0 003 12s4 7 9 7a9.77 9.77 0 004.12-.91"/>
                  </svg>
                ) : (
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1.5 12s4.5-7 10.5-7 10.5 7 10.5 7-4.5 7-10.5 7S1.5 12 1.5 12z"/>
                    <circle cx="12" cy="12" r="2.5"/>
                  </svg>
                )}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs mt-1" style={{ color: "#e05a3a" }}>{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms — now with real links */}
          <label className="flex items-start gap-2.5 mb-6 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded"
              style={{ accentColor: "#2a7c6f" }}
              {...register("terms", { required: "You must accept the terms" })}
            />
            <span className="text-sm leading-relaxed" style={{ color: "#3d3730" }}>
              I agree to PGFinder's{" "}
              <Link to="/t&c" target="_blank" className="font-semibold" style={{ color: "#2a7c6f" }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacypolicy" target="_blank" className="font-semibold" style={{ color: "#2a7c6f" }}>
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs -mt-4 mb-4" style={{ color: "#e05a3a" }}>{errors.terms.message}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all"
            style={{
              background: loading ? "#2a7c6f99" : "#2a7c6f",
              fontFamily: "'Outfit', sans-serif",
              boxShadow: "0 4px 14px rgba(42,124,111,0.3)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <div className="text-center mt-5 text-sm" style={{ color: "#8a7f74" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold" style={{ color: "#2a7c6f" }}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}