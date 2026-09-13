import React, { useState } from "react";
import axios from "axios";
import { Lock, Mail, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://ikonix-backend.vercel.app/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ======================================================
  // LOGIN
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/admin/login`,
        {
          email: email.trim(),
          password,
        }
      );

      console.log(
        "Login Response:",
        response.data
      );

      // ==================================================
      // SAVE TOKEN
      // ==================================================

      const token = response.data.token;

      if (!token) {
        alert("Login failed. Token not received.");
        return;
      }

      localStorage.setItem(
        "adminToken",
        token
      );

      // Optional admin data
      if (response.data.admin) {
        localStorage.setItem(
          "admin",
          JSON.stringify(
            response.data.admin
          )
        );
      }

      alert(
        response.data.message ||
          "Login successful."
      );

      // ==================================================
      // GO TO DASHBOARD
      // ==================================================

      navigate("/admin/dashboard");

    } catch (error) {
      console.error(
        "Admin Login Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Invalid email or password."
      );

    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#f7f8fa]
        flex
        items-center
        justify-center
        px-4
      "
    >

      <div className="w-full max-w-md">

        {/* LOGO / BRAND */}

        <div className="text-center mb-8">

          <div
            className="
              w-14
              h-14
              mx-auto
              rounded-2xl
              bg-orange-500
              flex
              items-center
              justify-center
              text-white
              shadow-sm
              mb-4
            "
          >
            <Lock size={25} />
          </div>

          <h1
            className="
              text-2xl
              font-semibold
              text-gray-900
            "
          >
            Admin Login
          </h1>

          <p
            className="
              text-sm
              text-gray-500
              mt-2
            "
          >
            Sign in to access the admin dashboard
          </p>

        </div>

        {/* LOGIN CARD */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
            md:p-8
          "
        >

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="admin@example.com"
                  disabled={loading}
                  className="
                    w-full
                    h-11
                    pl-10
                    pr-4
                    rounded-lg
                    border
                    border-gray-200
                    text-sm
                    text-gray-800
                    outline-none
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                    disabled:bg-gray-50
                  "
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter your password"
                  disabled={loading}
                  className="
                    w-full
                    h-11
                    pl-10
                    pr-4
                    rounded-lg
                    border
                    border-gray-200
                    text-sm
                    text-gray-800
                    outline-none
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                    disabled:bg-gray-50
                  "
                />

              </div>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-11
                rounded-lg
                bg-orange-500
                hover:bg-orange-600
                text-white
                text-sm
                font-medium
                flex
                items-center
                justify-center
                gap-2
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              <LogIn size={18} />

              {loading
                ? "Signing in..."
                : "Sign In"}

            </button>

          </form>

        </div>

        {/* FOOTER */}

        <p
          className="
            text-center
            text-xs
            text-gray-400
            mt-6
          "
        >
          Admin access only
        </p>

      </div>

    </div>
  );
};

export default AdminLogin;