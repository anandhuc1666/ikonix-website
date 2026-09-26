import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { UserCircle, Menu, X, Search } from "lucide-react";

// import logo from "../../../public/imageone.png";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  // =====================================================
  // NAVIGATION ITEMS
  // =====================================================

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

  // =====================================================
  // SEARCH FOCUS
  // When user clicks the search bar,
  // move to Products page.
  // =====================================================

  const handleSearchFocus = () => {
    if (location.pathname !== "/products/page") {
      navigate("/products/page");
    }
  };

  // =====================================================
  // SEARCH CHANGE
  // Search while typing
  // =====================================================

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    // If user is not already on Products page
    if (location.pathname !== "/products/page") {
      navigate(
        value.trim()
          ? `/products/page?search=${encodeURIComponent(value)}`
          : "/products/page",
      );

      return;
    }

    // Already on Products page
    navigate(
      value.trim()
        ? `/products/page?search=${encodeURIComponent(value)}`
        : "/products/page",
      {
        replace: true,
      },
    );
  };

  // =====================================================
  // PRODUCTS LINK
  // =====================================================

  const handleProductsClick = () => {
    setSearch("");
    setMobileMenu(false);

    navigate("/products/page");
  };

  // =====================================================
  // LOGO CLICK
  // =====================================================

  const handleLogoClick = () => {
    setSearch("");
    setMobileMenu(false);
  };

  // =====================================================
  // ACTIVE NAVIGATION
  // =====================================================

  const isNavActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <header className="w-full bg-[#e85d04] fixed z-30">
      {/* =====================================================
          MAIN NAVIGATION
      ===================================================== */}

      <div
        className="
          max-w-[1400px]
          mx-auto
          min-h-[70px]
          px-4
          sm:px-6
          md:px-8
          lg:px-10
          flex
          items-center
          gap-4
        "
      >
        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          to="/"
          onClick={handleLogoClick}
          className="
            shrink-0
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              w-12
              h-12
              bg-white
              sm:w-13
              sm:h-13
              md:w-14
              p-1
              md:h-14
              rounded-full
              overflow-hidden
              flex
              items-center
              justify-center
            "
          >
            <h1 className="font-bold text-[15px]">IKONIX</h1>
          </div>
        </Link>

        {/* =====================================================
            DESKTOP SEARCH
        ===================================================== */}

        <div
          className="
          
         hidden
    sm:flex
    relative
    items-center
    shrink-0
    w-[240px]
    md:w-[280px]
    lg:w-[340px]
    xl:w-[400px]
  "
        >
          {/* SEARCH ICON */}

          <Search
            size={20}
            strokeWidth={2}
            className="
              absolute
              left-3
              text-gray-500
              pointer-events-none
            "
          />

          {/* SEARCH INPUT */}

          <input
            type="text"
            value={search}
            onFocus={handleSearchFocus}
            onChange={handleSearchChange}
            placeholder="What are you looking for?"
            className="
              w-full
              h-[45px]
              bg-white
              rounded-full
              pl-9
              pr-4
              text-[11px]
              md:text-[11px]
              lg:text-xs
              text-gray-800
              placeholder:text-gray-400
              outline-none
              border
              border-transparent
              focus:border-black/20
              transition
            "
          />
        </div>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <nav
          className="
            hidden
            md:flex
            flex-1
            items-center
            justify-center
            gap-6
            lg:gap-7
            xl:gap-8
          "
        >
          {navItems.map((item) => {
            const active = isNavActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (item.path === "/products/page") {
                    handleProductsClick();
                  }
                }}
                className={`
                  relative
                  whitespace-nowrap
                  py-1
                  text-[12px]
                  lg:text-xs
                  xl:text-[13px]
                  font-medium
                  text-black
                  transition
                  hover:text-white

                  ${active ? "font-semibold" : ""}
                `}
              >
                {item.name}

                {/* ACTIVE LINE */}

                {active && (
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

        {/* =====================================================
            LOGIN
        ===================================================== */}

        <Link
          to="/admin/login"
          className="
            hidden
            md:flex
            items-center
            gap-1.5
            shrink-0
            text-black
            text-[11px]
            lg:text-xs
            xl:text-[13px]
            font-medium
            hover:text-white
            transition
          "
        >
          <UserCircle size={21} strokeWidth={2} />

          <span>Login</span>
        </Link>

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="
            ml-auto
            md:hidden
            w-10
            h-10
            flex
            items-center
            justify-center
            text-black
          "
          aria-label="Toggle menu"
        >
          {mobileMenu ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileMenu && (
        <div
          className="
            md:hidden
            border-t
            border-black/10
            bg-[#e85d04]
            px-5
            pb-5
          "
        >
          {/* =================================================
              MOBILE SEARCH
          ================================================= */}

          <div
            className="
              relative
              flex
              items-center
              pt-4
              pb-4
            "
          >
            <Search
              size={18}
              className="
                absolute
                left-3
                text-gray-500
                pointer-events-none
              "
            />

            <input
              type="text"
              value={search}
              onFocus={handleSearchFocus}
              onChange={handleSearchChange}
              placeholder="What are you looking for?"
              className="
                w-full
                h-[42px]
                bg-white
                rounded-full
                pl-9
                pr-4
                text-xs
                text-gray-800
                placeholder:text-gray-400
                outline-none
                border
                border-transparent
                focus:border-black/20
              "
            />
          </div>

          {/* =================================================
              MOBILE NAVIGATION
          ================================================= */}

          <nav className="flex flex-col">
            {navItems.map((item) => {
              const active = isNavActive(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    if (item.path === "/products/page") {
                      setSearch("");
                    }

                    setMobileMenu(false);
                  }}
                  className={`
                    py-3
                    text-sm
                    font-medium
                    text-black
                    border-b
                    border-black/10

                    ${active ? "font-bold" : ""}
                  `}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* =================================================
                MOBILE LOGIN
            ================================================= */}

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
