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
        localStorage.setItem("user", JSON.stringify(user));

        const role = user.role;

        if (role === "user" || role === "USER") {
          navigate("/");
        } else if (role === "admin" || role === "ADMIN") {
          navigate("/admin");

        }
        else if (role === "landlord" || role === "LANDLORD") {
          navigate("/landlord"); 
        }  
        else {
          toast.error("Invalid role");
          navigate("/");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; }

        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          font-family: 'Outfit', sans-serif;
        }

        /* LEFT PANEL */
        .auth-left {
          flex: 1;
          background: #1a2744;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 60px;
          min-height: 500px;
        }
        .auth-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80');
          background-size: cover; background-position: center;
          opacity: 0.25;
        }
        .auth-left::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(26,39,68,0.97) 0%, rgba(26,39,68,0.4) 70%, transparent 100%);
        }
        .auth-left-content {
          position: relative; z-index: 2;
        }
        .auth-logo {
          font-family: 'Fraunces', serif;
          font-size: 1.3rem; font-weight: 900;
          color: #fff; margin-bottom: 32px;
          display: block;
        }
        .auth-logo em { color: #2a7c6f; font-style: normal; }
        .auth-left-content h2 {
          font-family: 'Fraunces', serif;
          font-size: 2.4rem; font-weight: 900;
          color: #fff; line-height: 1.15; margin-bottom: 16px;
        }
        .auth-left-content h2 i { color: #7dd3c8; font-style: italic; }
        .auth-left-content p {
          color: rgba(255,255,255,0.65); font-size: 1rem;
          line-height: 1.7; max-width: 380px;
        }
        .auth-testimonial {
          margin-top: 40px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px; padding: 22px;
          backdrop-filter: blur(10px);
        }
        .auth-testimonial p {
          color: rgba(255,255,255,0.8); font-size: 0.9rem;
          line-height: 1.65; font-style: italic;
        }
        .auth-testimonial-author {
          display: flex; align-items: center;
          gap: 10px; margin-top: 14px;
        }
        .auth-testimonial-ava {
          width: 34px; height: 34px; border-radius: 50%;
          background: #2a7c6f;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
        }
        .auth-testimonial-name {
          color: #fff; font-size: 0.84rem; font-weight: 600;
        }
        .auth-testimonial-role {
          color: rgba(255,255,255,0.5); font-size: 0.75rem;
        }

        /* RIGHT PANEL */
        .auth-right {
          flex: 0 0 500px;
          background: #fff;
          display: flex; flex-direction: column;
          justify-content: center;
          padding: 64px 56px;
          overflow-y: auto;
        }
        .auth-right h1 {
          font-family: 'Fraunces', serif;
          font-size: 2rem; font-weight: 900;
          color: #1a2744; margin-bottom: 8px;
        }
        .auth-sub {
          color: #8a7f74; font-size: 0.92rem; margin-bottom: 36px;
        }
        .auth-sub a { color: #2a7c6f; font-weight: 600; text-decoration: none; }
        .auth-sub a:hover { text-decoration: underline; }

        /* Form divider */
        .form-divider {
          display: flex; align-items: center; gap: 16px;
          margin: 0 0 24px; color: #8a7f74; font-size: 0.82rem;
        }
        .form-divider::before, .form-divider::after {
          content: ''; flex: 1; height: 1px; background: #e2ddd6;
        }

        /* Form groups */
        .form-group {
          display: flex; flex-direction: column;
          gap: 7px; margin-bottom: 18px;
        }
        .form-group label {
          font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.9px;
          color: #8a7f74;
        }
        .form-input {
          background: #faf9f7;
          border: 1.5px solid #e2ddd6;
          border-radius: 10px; color: #1a1a1a;
          font-family: 'Outfit', sans-serif;
          font-size: 0.92rem; padding: 12px 14px;
          outline: none; width: 100%;
          transition: all 0.25s;
        }
        .form-input:focus {
          border-color: #2a7c6f;
          box-shadow: 0 0 0 3px rgba(42,124,111,0.1);
          background: #fff;
        }
        .form-input.has-icon { padding-right: 44px; }

        /* Password wrapper */
        .pwd-wrap {
          position: relative;
        }
        .pwd-toggle {
          position: absolute; right: 14px;
          top: 50%; transform: translateY(-50%);
          color: #8a7f74; cursor: pointer; background: none; border: none;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
        }
        .pwd-toggle:hover { color: #1a2744; }

        /* Remember row */
        .remember-row {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 20px;
        }
        .remember-row label {
          display: flex; align-items: center;
          gap: 8px; font-size: 0.85rem; color: #3d3730; cursor: pointer;
        }
        .remember-row label input[type="checkbox"] {
          accent-color: #2a7c6f; width: 15px; height: 15px; cursor: pointer;
        }
        .remember-row a {
          font-size: 0.85rem; color: #2a7c6f;
          font-weight: 600; text-decoration: none;
        }
        .remember-row a:hover { text-decoration: underline; }

        /* Submit button */
        .btn-submit {
          width: 100%; padding: 14px;
          border-radius: 12px; background: #1a2744;
          color: #fff; border: none;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: all 0.25s;
        }
        .btn-submit:hover { background: #243356; transform: translateY(-1px); }

        /* Bottom switch */
        .auth-switch {
          text-align: center; margin-top: 24px;
          font-size: 0.88rem; color: #8a7f74;
        }
        .auth-switch a {
          color: #2a7c6f; font-weight: 600; text-decoration: none;
        }
        .auth-switch a:hover { text-decoration: underline; }

        /* Responsive */
        @media (max-width: 900px) {
          .auth-left { display: none; }
          .auth-right {
            flex: 1; padding: 48px 32px;
          }
        }
        @media (max-width: 480px) {
          .auth-right { padding: 40px 20px; }
          .auth-right h1 { font-size: 1.7rem; }
        }
      `}</style>

      <div className="auth-page">

        {/* ── LEFT PANEL ── */}
        <div className="auth-left">
          <div className="auth-left-content">
            <span className="auth-logo">PG<em>Finder</em></span>

            <h2>
              Welcome <br />
              <i>back.</i>
            </h2>

            <p>Thousands of verified PGs waiting for you. Log in and continue your search.</p>

            <div className="auth-testimonial">
              <p>"Found my perfect PG within 2 days. The booking process was seamless!"</p>
              <div className="auth-testimonial-author">
                <div className="auth-testimonial-ava">P</div>
                <div>
                  <div className="auth-testimonial-name">Priya Sharma</div>
                  <div className="auth-testimonial-role">Tenant · Bengaluru</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="auth-right">
          <h1>Log In</h1>

          <p className="auth-sub">
            Don't have an account?{" "}
            <Link to="/signup">Sign up free →</Link>
          </p>

          <div className="form-divider">continue with email</div>

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* EMAIL */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="priya@email.com"
                className="form-input"
                {...register("email", { required: true })}
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>
              <div className="pwd-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className="form-input has-icon"
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A2 2 0 0013.42 13.42" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 7 9 7a16.5 16.5 0 01-3.07 3.94M6.1 6.1A16.5 16.5 0 003 12s4 7 9 7a9.77 9.77 0 004.12-.91" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12s4.5-7 10.5-7 10.5 7 10.5 7-4.5 7-10.5 7S1.5 12 1.5 12z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="remember-row">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            {/* SUBMIT */}
            <button type="submit" className="btn-submit">
              Log In →
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">Create one</Link>
          </div>
        </div>

      </div>
    </>
  );
}