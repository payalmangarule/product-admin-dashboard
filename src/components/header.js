"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Left Side */}
          <div className="flex items-center gap-3">

            {/* Logo */}
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-white"
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

            {/* Dashboard Name */}
            <div>
              <h1 className="text-lg sm:text-xl font-bold">
                Product Admin Dashboard
              </h1>

              <p className="text-xs text-gray-300 hidden sm:block">
                Manage your products
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-5">

            {/* Notification Icon */}
            <button
              className="text-gray-300 hover:text-white transition"
              aria-label="Notifications"
            >
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
                  d="M15 17h5l-1.5-2V10a6.5 6.5 0 00-13 0v5L4 17h5m6 0a3 3 0 01-6 0"
                />
              </svg>
            </button>

            {/* Divider */}
            <div className="hidden sm:block h-7 w-px bg-gray-600"></div>

            {/* Admin */}
            <div className="flex items-center gap-2">

              {/* Person Icon */}
              <div className="w-9 h-9 rounded-full bg-gray-200 text-slate-700 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" />
                </svg>
              </div>

              {/* Welcome Text */}
              <div className="hidden sm:block">
                <p className="text-xs text-gray-300">
                  Welcome to
                </p>

                <p className="text-sm font-semibold">
                  Product Dashboard
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-800 transition"
>
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
          d="M15 12H3m0 0l4-4m-4 4l4 4m8-9V5a2 2 0 00-2-2H9m6 14v2a2 2 0 01-2 2H9"
        />
          </svg>
        <span className="hidden sm:inline">
         Logout
        </span>
        </button>
        </div>
        </div>
      </div>
    </header>
  );
}