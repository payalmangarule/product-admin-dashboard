"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../services/authService";

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const data = await loginUser(username, password);

      localStorage.setItem("token", data.accessToken);

      setSuccess("Login successful!");

      router.push("/products");
    } catch (error) {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Left Side */}
          <div className="hidden md:flex bg-slate-800 text-white p-10 lg:p-12 flex-col justify-between">

            <div>
              {/* Logo */}
              <div className="flex items-center gap-3 mb-10">
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 0L4 7m8 4v10"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    Product Admin
                  </h2>
                  <p className="text-xs text-slate-400">
                    Dashboard
                  </p>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                Manage your products
                <span className="text-blue-400">
                  {" "}with ease.
                </span>
              </h1>

              <p className="text-slate-300 mt-5 leading-7 max-w-md">
                Manage products, pricing, inventory and product
                information from one simple dashboard.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-blue-400">
                    ✓
                  </div>
                  <span className="text-sm text-slate-200">
                    Easy product management
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-blue-400">
                    ✓
                  </div>
                  <span className="text-sm text-slate-200">
                    Search and filter products
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-blue-400">
                    ✓
                  </div>
                  <span className="text-sm text-slate-200">
                    Manage inventory efficiently
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Right Side - Login */}
          <div className="p-7 sm:p-10 lg:p-12">

            {/* Mobile Logo */}
            <div className="md:hidden flex items-center justify-center gap-3 mb-8">

              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 0L4 7m8 4v10"
                  />
                </svg>
              </div>

              <div>
                <h2 className="font-bold text-lg text-slate-800">
                  Product Admin
                </h2>
                <p className="text-xs text-slate-500">
                  Dashboard
                </p>
              </div>

            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800">
                Welcome back
              </h1>

              <p className="text-sm text-slate-500 mt-2">
                Sign in to access your product dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>

                <div className="relative">

                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 outline-none bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />

                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 outline-none bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />

                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <span className="text-sm">⚠️</span>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                  <span className="text-sm">✓</span>
                  <p className="text-sm">{success}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>

            </form>

            {/* Secure Login Icon */}
            <div className="flex flex-col items-center justify-center mt-7">

              <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                🔐 Secure Login
              </p>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}