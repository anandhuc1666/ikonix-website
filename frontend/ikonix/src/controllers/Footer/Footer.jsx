import React from "react";
import { Link } from "react-router-dom";
import { FaSquareInstagram } from "react-icons/fa6";
import { BsLinkedin } from "react-icons/bs";
import { LuMessageCircleMore } from "react-icons/lu";
import { BsFillTelephoneFill } from "react-icons/bs";
import { RiMailUnreadFill } from "react-icons/ri";
import { SlGlobe } from "react-icons/sl";

function Footer() {
  return (
    <footer className="w-full bg-[#FFA500] text-black">
      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          sm:px-8
          lg:px-10
          py-10
          md:py-12
        "
      >

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-10
            lg:gap-8
          "
        >

          {/* =================================================
              COMPANY
          ================================================= */}

          <div className="lg:pr-8">

            <h2
              className="
                text-xl
                md:text-2xl
                font-bold
                leading-tight
              "
            >
              IKONIX
            </h2>

            <h3
              className="
                text-lg
                md:text-xl
                font-semibold
                leading-tight
              "
            >
              TEST AND MEASUREMENT LLP
            </h3>

            <p
              className="
                mt-5
                text-xs
                leading-[1.45]
                max-w-sm
              "
            >
              IKONIX Test and Measurement LLP provides
              reliable test and measurement instruments
              for electrical, electronic, industrial and
              professional applications. Explore our
              product range and connect with our team for
              product information, technical assistance
              and quotations.
            </p>

            {/* SOCIAL MEDIA */}

            <div className="flex items-center gap-5 mt-6">

              <a
                href="#"
                aria-label="WhatsApp"
                className="
                  hover:scale-110
                  transition-transform
                "
              ><LuMessageCircleMore 
                  size={21}
                  strokeWidth={2.5}
                />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="
                  hover:scale-110
                  transition-transform
                "
              >
                <FaSquareInstagram
                  size={21}
                  strokeWidth={2.5}
                />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="
                  hover:scale-110
                  transition-transform
                "
              >
               <BsLinkedin 
                  size={21}
                  strokeWidth={2.5} 
                />
              </a>

            </div>

          </div>


          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <div>

            <h3
              className="
                text-base
                font-semibold
                mb-5
              "
            >
              Quick Links
            </h3>

            <nav
              className="
                flex
                flex-col
                gap-1
              "
            >

              <Link
                to="/"
                className="
                  text-xs
                  hover:underline
                "
              >
                Home
              </Link>

              <Link
                to="/about"
                className="
                  text-xs
                  hover:underline
                "
              >
                About Us
              </Link>

              <Link
                to="/products"
                className="
                  text-xs
                  hover:underline
                "
              >
                Products
              </Link>

              <Link
                to="/brands"
                className="
                  text-xs
                  hover:underline
                "
              >
                Brands
              </Link>

              <Link
                to="/services"
                className="
                  text-xs
                  hover:underline
                "
              >
                Services
              </Link>

              <Link
                to="/downloads"
                className="
                  text-xs
                  hover:underline
                "
              >
                Downloads
              </Link>

              <Link
                to="/contact"
                className="
                  text-xs
                  hover:underline
                "
              >
                Contact Us
              </Link>

            </nav>

          </div>


          {/* =================================================
              PRODUCT CATEGORIES
          ================================================= */}

          <div>

            <h3
              className="
                text-base
                font-semibold
                mb-5
              "
            >
              Product Categories
            </h3>

            <nav
              className="
                flex
                flex-col
                gap-1
              "
            >

              <Link
                to="/products?category=Digital%20Multimeters"
                className="text-xs hover:underline"
              >
                Digital Multimeters
              </Link>

              <Link
                to="/products?category=Clamp%20Meters"
                className="text-xs hover:underline"
              >
                Clamp Meters
              </Link>

              <Link
                to="/products?category=Power%20Supplies"
                className="text-xs hover:underline"
              >
                Power Supplies
              </Link>

              <Link
                to="/products?category=Oscilloscopes"
                className="text-xs hover:underline"
              >
                Oscilloscopes
              </Link>

              <Link
                to="/products?category=Temperature%20Instruments"
                className="text-xs hover:underline"
              >
                Temperature Instruments
              </Link>

              <Link
                to="/products?category=Environmental%20Instruments"
                className="text-xs hover:underline"
              >
                Environmental Instruments
              </Link>

              <Link
                to="/products?category=Electrical%20Test%20Equipment"
                className="text-xs hover:underline"
              >
                Electrical Test Equipment
              </Link>

            </nav>

          </div>


          {/* =================================================
              CONTACT
          ================================================= */}

          <div>

            <h3
              className="
                text-base
                font-semibold
                mb-5
              "
            >
              Contact Us
            </h3>

            <div className="space-y-3">

              {/* PHONE */}

              <a
                href="tel:+918111856618"
                className="
                  flex
                  items-start
                  gap-2
                  text-xs
                  hover:underline
                "
              >

                <BsFillTelephoneFill 
                  size={14}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  +91 8111856618
                </span>

              </a>


              {/* EMAIL */}

              <a
                href="mailto:info@ikonixinstruments.com"
                className="
                  flex
                  items-start
                  gap-2
                  text-xs
                  hover:underline
                "
              >

              <RiMailUnreadFill 
                  size={14}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  info@ikonixinstruments.com
                </span>

              </a>


              {/* WEBSITE */}

              <a
                href="https://www.ikonixinstruments.com"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  items-start
                  gap-2
                  text-xs
                  hover:underline
                "
              >

                <SlGlobe 
                  size={14}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  www.ikonixinstruments.com
                </span>

              </a>

            </div>

          </div>

        </div>


        {/* =================================================
            COPYRIGHT
        ================================================= */}

        <div
          className="
            mt-10
            pt-5
            border-t
            border-black/10
            text-center
          "
        >

          <p className="text-[10px] sm:text-xs">
            © {new Date().getFullYear()} IKONIX Test and
            Measurement LLP. All Rights Reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;