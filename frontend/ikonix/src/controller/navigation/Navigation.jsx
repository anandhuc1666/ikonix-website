import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { MdSpaceDashboard } from "react-icons/md";
import { BiSolidShoppingBags } from "react-icons/bi";
import { HiDocumentDuplicate } from "react-icons/hi";
import { SiBrandfolder } from "react-icons/si";
import { FaJediOrder } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

const Navigation = () => {
  const navigate = useNavigate();

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    // Remove JWT token
    localStorage.removeItem("adminToken");

    // Remove stored admin information if available
    localStorage.removeItem("admin");

    // Redirect to admin login
    navigate("/", {
      replace: true,
    });
  };

  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-white
        text-black
        p-5
        flex
        flex-col
        border-r
        border-gray-100
      "
    >

      {/* ==================================================
          LOGO
      ================================================== */}

      <div className="mb-8">

        <h1 className="text-2xl font-bold">
          IKONIX
        </h1>

        <p className="text-xs text-gray-400 mt-1">
          Admin Panel
        </p>

      </div>


      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <nav className="space-y-2 flex-1">

        {/* DASHBOARD */}

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-lg
            transition
            duration-200
            ${
              isActive
                ? "bg-[#FC9D03] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }
            `
          }
        >
          <MdSpaceDashboard className="text-2xl" />

          <span>
            Dashboard
          </span>
        </NavLink>


        {/* PRODUCTS */}

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-lg
            transition
            duration-200
            ${
              isActive
                ? "bg-[#FC9D03] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }
            `
          }
        >
          <BiSolidShoppingBags className="text-2xl" />

          <span>
            Products
          </span>
        </NavLink>


        {/* CATEGORIES */}

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-lg
            transition
            duration-200
            ${
              isActive
                ? "bg-[#FC9D03] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }
            `
          }
        >
          <HiDocumentDuplicate className="text-2xl" />

          <span>
            Categories
          </span>
        </NavLink>


        {/* BRANDS */}

        <NavLink
          to="/admin/brands"
          className={({ isActive }) =>
            `
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-lg
            transition
            duration-200
            ${
              isActive
                ? "bg-[#FC9D03] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }
            `
          }
        >
          <SiBrandfolder className="text-2xl" />

          <span>
            Brands
          </span>
        </NavLink>


        {/* ORDERS */}

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-lg
            transition
            duration-200
            ${
              isActive
                ? "bg-[#FC9D03] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }
            `
          }
        >
          <FaJediOrder className="text-2xl" />

          <span>
            Orders
          </span>
        </NavLink>

      </nav>


      {/* ==================================================
          LOGOUT
      ================================================== */}

      <div className="pt-5 border-t border-gray-100">

        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-lg
            text-gray-700
            hover:bg-red-50
            hover:text-red-500
            transition
            duration-200
          "
        >

          <FiLogOut className="text-xl" />

          <span className="font-medium">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
};

export default Navigation;