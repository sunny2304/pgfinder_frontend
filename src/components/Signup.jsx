import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {useNavigate } from "react-router-dom";
import axios from "axios";
export const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate()
  const password = watch("password");

  const onSubmit = async(data) => {
    console.log("data..",data);
    //axios.post("http://localhost:3000/user/register")
    const res = await axios.post("/user/register",data)

    console.log("response..",res)
    console.log("response.data..",res.data)
    console.log("response.data.data..",res.data.data)
    console.log("status",res.status)
    if(res.status==201){
      toast.success("User registered successfully")
      navigate("/") // / -->login -->check your routes in AppRouter.jsx
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96">
        
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("firstName", { required: "first Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* last name */}
          <div>
            <label className="block text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("lastName", { required: "Last Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition duration-300"
          >
            Create Account
          </button>
        </form>

      </div>
    </div>
  );
};

// import { useState } from "react";
// import { Link } from "react-router-dom";

// /* Helper component */
// const Feature = ({ icon, title, desc }) => (
//   <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
//     <span className="text-xl">{icon}</span>
//     <div>
//       <p className="text-sm font-semibold">{title}</p>
//       <p className="text-xs text-white/60">{desc}</p>
//     </div>
//   </div>
// );

// export const Signup = () => {
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirmPass, setShowConfirmPass] = useState(false);

//   return (
//     <div className="min-h-screen flex flex-col font-sans">

//       {/* NAVBAR */}
//       <nav className="sticky top-0 z-50 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 md:px-10">
//         <Link to="/" className="text-2xl font-extrabold text-indigo-600">
//           PG<span className="text-emerald-500">Finder</span>
//         </Link>

//         <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
//           <li><Link to="/">Home</Link></li>
//           <li><Link to="/search">Search PGs</Link></li>
//           <li><Link to="/list">List Your PG</Link></li>
//         </ul>

//         <div className="flex gap-3">
//           <Link
//             to="/login"
//             className="px-5 py-2 rounded-full border border-gray-300 text-sm font-semibold hover:border-indigo-500 hover:text-indigo-600 transition"
//           >
//             Login
//           </Link>
//           <Link
//             to="/signup"
//             className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
//           >
//             Sign Up
//           </Link>
//         </div>
//       </nav>

//       {/* MAIN */}
//       <div className="flex-1 grid md:grid-cols-2">

//         {/* LEFT PANEL (Same Design, Different Text) */}
//         <div className="hidden md:flex flex-col justify-between p-14 bg-gradient-to-br from-indigo-600 via-indigo-800 to-indigo-950 text-white relative overflow-hidden">

//           <div>
//             <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full text-xs font-semibold border border-white/20 mb-8">
//               <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
//               Join 50,000+ happy users
//             </div>

//             <h2 className="text-4xl font-extrabold leading-tight mb-4">
//               Create Your <span className="text-indigo-200">PGFinder</span> Account
//             </h2>

//             <p className="text-sm text-white/70 mb-10 leading-relaxed">
//               Sign up to explore verified PGs, save favorites,
//               and schedule visits easily.
//             </p>

//             <div className="space-y-4">
//               <Feature icon="🏠" title="Verified PG Listings" desc="Browse trusted & reviewed PGs" />
//               <Feature icon="❤️" title="Save Favorites" desc="Shortlist PGs you love" />
//               <Feature icon="📅" title="Easy Visit Booking" desc="Schedule PG visits instantly" />
//             </div>
//           </div>

//           <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-lg">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center font-bold">
//                 A
//               </div>
//               <div>
//                 <p className="font-semibold text-sm">Ankit Verma</p>
//                 <p className="text-xs text-white/60">Moved hassle-free!</p>
//               </div>
//             </div>
//             <p className="text-xs mt-3 text-white/70 italic">
//               "Signing up on PGFinder was the best decision. Found my PG within a week!"
//             </p>
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="flex items-center justify-center bg-gray-50 p-6">
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-10 w-full max-w-md">

//             <div className="text-center mb-8">
//               <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl">
//                 📝
//               </div>
//               <h1 className="text-2xl font-extrabold mb-1">Create Account</h1>
//               <p className="text-sm text-gray-500">
//                 Already have an account?{" "}
//                 <Link to="/login" className="text-indigo-600 font-semibold">
//                   Log in →
//                 </Link>
//               </p>
//             </div>

//             <form className="space-y-5">

//               {/* Full Name */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">First Name</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-3">👤</span>
//                   <input
//                     type="text"
//                     placeholder="Your full name"
//                     className="w-full border border-gray-200 rounded-lg px-4 py-3 pl-10 bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none"
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Email</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-3">📧</span>
//                   <input
//                     type="email"
//                     placeholder="you@example.com"
//                     className="w-full border border-gray-200 rounded-lg px-4 py-3 pl-10 bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Password</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-3">🔒</span>
//                   <input
//                     type={showPass ? "text" : "password"}
//                     placeholder="Create password"
//                     className="w-full border border-gray-200 rounded-lg px-4 py-3 pl-10 pr-10 bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPass(!showPass)}
//                     className="absolute right-3 top-3 text-lg"
//                   >
//                     {showPass ? "🙈" : "👁️"}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Confirm Password</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-3">🔐</span>
//                   <input
//                     type={showConfirmPass ? "text" : "password"}
//                     placeholder="Confirm password"
//                     className="w-full border border-gray-200 rounded-lg px-4 py-3 pl-10 pr-10 bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPass(!showConfirmPass)}
//                     className="absolute right-3 top-3 text-lg"
//                   >
//                     {showConfirmPass ? "🙈" : "👁️"}
//                   </button>
//                 </div>
//               </div>

//               {/* Terms */}
//               <div className="flex items-center gap-2 text-sm">
//                 <input type="checkbox" className="accent-indigo-600" />
//                 <span>
//                   I agree to the{" "}
//                   <span className="text-indigo-600 font-semibold cursor-pointer">
//                     Terms & Conditions
//                   </span>
//                 </span>
//               </div>

//               {/* Button */}
//               <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md">
//                 Create Account →
//               </button>

//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };