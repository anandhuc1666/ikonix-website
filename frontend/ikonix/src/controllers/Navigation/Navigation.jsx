import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserCircle, Menu, X } from "lucide-react";
import { useState } from "react";

function Navigation() {
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  const navItems = [
    {
      name: "HOME",
      path: "/",
    },
    {
      name: "PRODUCTS",
      path: "/products/page",
    },
    {
      name: "BRANDS",
      path: "/brands/page",
    },
    {
      name: "ABOUT US",
      path: "/about/page",
    },
    {
      name: "CONTACT US",
      path: "/contact/page",
    },
  ];

  return (
    <header className="w-full bg-[#FFA500]">
      {/* =========================================
          DESKTOP / MAIN NAVIGATION
      ========================================= */}

      <div
        className="
          max-w-[1400px]
          mx-auto
          h-[70px]
          px-6
          md:px-10
          flex
          items-center
          justify-between
        "
      >
        {/* =========================================
            LOGO
        ========================================= */}

        <Link
          to="/"
          className="
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              w-12
              h-12
              md:w-14
              md:h-14
              rounded-full
              bg-black
              flex
              items-center
              justify-center
            "
          >
            {/* Add your logo image here later */}

            {/* Example:
            <img
              src="/logo.png"
              alt="IKONIX"
              className="w-full h-full object-contain"
            />
            */}
          </div>
        </Link>

        {/* =========================================
            DESKTOP MENU
        ========================================= */}

        <nav
          className="
            hidden
            md:flex
            items-center
            gap-8
            lg:gap-10
          "
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  relative
                  text-[12px]
                  lg:text-[13px]
                  font-medium
                  text-black
                  transition
                  hover:text-white
                  py-2
                  ${isActive ? "font-semibold" : ""}
                `}
              >
                {item.name}

                {/* ACTIVE LINE */}

                {isActive && (
                  <span
                    className="
                      absolute
                      left-0
                      right-0
                      -bottom-1
                      h-[2px]
                      bg-black
                      rounded-full
                    "
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* =========================================
            LOGIN
        ========================================= */}

        <Link
          to="/admin/login"
          className="
            hidden
            md:flex
            items-center
            gap-2
            text-black
            text-[12px]
            lg:text-[13px]
            font-medium
            hover:text-white
            transition
          "
        >
          <UserCircle size={21} strokeWidth={2} />

          <span>Login</span>
        </Link>

        {/* =========================================
            MOBILE MENU BUTTON
        ========================================= */}

        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="
            md:hidden
            w-10
            h-10
            flex
            items-center
            justify-center
            text-black
          "
        >
          {mobileMenu ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* =========================================
          MOBILE MENU
      ========================================= */}

      {mobileMenu && (
        <div
          className="
            md:hidden
            border-t
            border-black/10
            bg-[#FFA500]
            px-6
            pb-5
          "
        >
          <nav className="flex flex-col">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenu(false)}
                  className={`
                    py-3
                    text-sm
                    font-medium
                    text-black
                    border-b
                    border-black/10
                    ${isActive ? "font-bold" : ""}
                  `}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* MOBILE LOGIN */}

            <Link
              to="/admin/login"
              onClick={() => setMobileMenu(false)}
              className="
                flex
                items-center
                gap-2
                py-4
                text-sm
                font-medium
                text-black
              "
            >
              <UserCircle size={20} />

              <span>Login</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navigation;
