import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

function AboutPage() {
  const colorCode = "#ff3f34";
  return (
    <div className="w-full bg-white text-black sm:mt-20 mt-16">
      {/* ==================================================
          BREADCRUMB
      ================================================== */}

      <div className="max-w-6xl mx-auto px-5 pt-6">
        <div
          className="
          flex
          items-center
          gap-2
          text-[12px]
          uppercase
          text-gray-400
        "
        >
          <Link to="/" className="hover:text-[#ff3f34]">
            Home
          </Link>

          <span>/</span>

          <span className="text-gray-700">About IKONIX</span>
        </div>
      </div>

      {/* ==================================================
          HERO / INTRODUCTION
      ================================================== */}

      <section className="max-w-6xl mx-auto px-5">
        <div
          className="
          mt-8
          grid
          grid-cols-1
          lg:grid-cols-[1fr_0.8fr]
          gap-10
          items-center
        "
        >
          {/* LEFT */}

          <div>
            <p
              className="
              text-[11px]
              uppercase
              tracking-wider
              
              font-medium
            "
              style={{ color: colorCode }}
            >
              About IKONIX
            </p>

            <h1
              className="
              mt-3
              text-3xl
              sm:text-4xl
              md:text-5xl
              font-bold
              leading-tight
            "
            >
              Precision You Can Measure.
              <br />
              <span style={{ color: colorCode }}>
                Confidence You Can Trust.
              </span>
            </h1>

            <p
              className="
              mt-5
              max-w-2xl
              text-xs
              sm:text-[15px]
              leading-6
              text-gray-600
            "
            >
              IKONIX Test and Measurement LLP is focused on providing quality
              test and measurement products for professionals, technicians,
              engineers, businesses and industrial applications.
            </p>

            <p
              className="
              mt-4
              max-w-2xl
              text-xs
              sm:text-[15px]
              leading-6
              text-gray-600
            "
            >
              Our product catalogue brings together practical measurement
              solutions designed to help customers select the right instrument
              for their specific testing requirements.
            </p>

            <div className="mt-6">
              <Link
                to="/products/page"
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-md
                  bg-[#ff3f34]
                  text-white
                  text-xs
                  font-medium
                  hover:bg-orange-500
                  transition
                "
              >
                Explore Products
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* RIGHT - PREMIUM INFO CARD */}

          <div
            className="
            relative
            rounded-2xl
            border
            border-orange-100
            bg-[#fffaf2]
            p-6
            sm:p-8
            overflow-hidden
          "
          >
            {/* Decorative circle */}

            <div
              className="
              absolute
              -top-12
              -right-12
              w-32
              h-32
              rounded-full
              
              opacity-10
            "
              style={{ backgroundColor: colorCode }}
            />

            <div
              className="
              absolute
              -bottom-16
              -left-16
              w-40
              h-40
              rounded-full
              border
              
              opacity-10
            "
              style={{ borderColor: colorCode }}
            />

            <div className="relative">
              <p
                className="
                text-[10px]
                uppercase
                tracking-widest
                
                font-semibold
              "
                style={{ color: colorCode }}
              >
                IKONIX
              </p>

              <h2
                className="
                mt-3
                text-2xl
                sm:text-3xl
                font-bold
              "
              >
                Test &
                <br />
                Measurement
              </h2>

              <div
                className="
                mt-5
                w-14
                h-1
                rounded-full
                
              "
                style={{ backgroundColor: colorCode }}
              />

              <p
                className="
                mt-5
                text-[15px]
                leading-5
                text-gray-600
              "
              >
                Reliable instruments and practical measurement solutions for a
                wide range of professional and industrial applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          WHO WE ARE
      ================================================== */}

      <section
        className="
        max-w-6xl
        mx-auto
        px-5
        py-14
      "
      >
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-8
        "
        >
          {/* TITLE */}

          <div>
            <p
              className="
              text-[10px]
              uppercase
              tracking-widest
              
              font-semibold
            "
              style={{ borderColor: colorCode }}
            >
              Who We Are
            </p>

            <h2
              className="
              mt-3
              text-2xl
              sm:text-3xl
              font-bold
              leading-tight
            "
            >
              Built around
              <span style={{ color: colorCode }}> accuracy.</span>
            </h2>
          </div>

          {/* CONTENT */}

          <div
            className="
            md:col-span-2
            space-y-4
            text-xs
            sm:text-[15px]
            leading-6
            text-gray-600
          "
          >
            <p>
              IKONIX Test and Measurement LLP provides reliable test and
              measurement instruments designed to support accurate testing,
              inspection and measurement across a wide range of professional and
              industrial applications.
            </p>

            <p>
              From electrical and electronic measurement to temperature,
              environmental and inspection applications, our goal is to make
              reliable testing equipment easier to discover and enquire about.
            </p>

            <p>
              We bring together product information, specifications and
              application-focused solutions to help customers make informed
              decisions about their measurement requirements.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          WHAT WE FOCUS ON
      ================================================== */}

      <section
        className="
        bg-[#fafafa]
        border-y
        border-gray-100
      "
      >
        <div
          className="
          max-w-6xl
          mx-auto
          px-5
          py-14
        "
        >
          <div className="text-center">
            <p
              className="
              text-[10px]
              uppercase
              tracking-widest
              
              font-semibold
            "
              style={{ color: colorCode }}
            >
              What We Focus On
            </p>

            <h2
              className="
              mt-2
              text-2xl
              sm:text-3xl
              font-bold
            "
            >
              Reliable Solutions.
              <span style={{ color: colorCode }}> Professional Service.</span>
            </h2>

            <p
              className="
              mt-3
              max-w-2xl
              mx-auto
              text-[15px]
              text-gray-500
              leading-5
            "
            >
              We focus on making quality test and measurement products easier to
              discover, understand and enquire about.
            </p>
          </div>

          {/* CARDS */}

          <div
            className="
            mt-9
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
          "
          >
            <InfoCard
              number="01"
              title="Quality Products"
              text="Reliable test and measurement instruments for professional applications."
            />

            <InfoCard
              number="02"
              title="Wide Selection"
              text="Explore solutions across electrical, electronic, temperature and inspection applications."
            />

            <InfoCard
              number="03"
              title="Technical Support"
              text="Get assistance in identifying suitable instruments for your requirements."
            />

            <InfoCard
              number="04"
              title="Customer Focus"
              text="We help customers find practical solutions for their testing needs."
            />
          </div>
        </div>
      </section>

      {/* ==================================================
          OUR COMMITMENT
      ================================================== */}

      <section
        className="
        max-w-6xl
        mx-auto
        px-5
        py-14
      "
      >
        <div
          className="
          rounded-2xl
          border
          border-orange-100
          bg-white
          p-7
          sm:p-10
        "
        >
          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-10
            items-center
          "
          >
            <div>
              <p
                className="
                text-[10px]
                uppercase
                tracking-widest
                
                font-semibold
              "
                style={{ color: colorCode }}
              >
                Our Commitment
              </p>

              <h2
                className="
                mt-3
                text-2xl
                sm:text-3xl
                font-bold
              "
              >
                Helping you choose the
                <span style={{ color: colorCode }}> right instrument.</span>
              </h2>

              <p
                className="
                mt-4
                text-xs
                sm:text-sm
                leading-6
                text-gray-600
              "
              >
                Whether you need a solution for electrical testing, temperature
                measurement, environmental monitoring or inspection, our team
                can help you identify suitable products for your application.
              </p>
            </div>

            {/* CHECK LIST */}

            <div
              className="
              space-y-4
            "
            >
              <CheckItem>Reliable test and measurement solutions</CheckItem>

              <CheckItem>Professional product information</CheckItem>

              <CheckItem>Application-focused assistance</CheckItem>

              <CheckItem>Support for product enquiries</CheckItem>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CTA
      ================================================== */}

      <section
        className="
        max-w-6xl
        mx-auto
        px-5
        pb-16
      "
      >
        <div
          className="
          rounded-2xl
          
          px-7
          py-9
          sm:px-10
          sm:py-11
          flex
          flex-col
          md:flex-row
          items-start
          md:items-center
          justify-between
          gap-6
        "
          style={{ backgroundColor: colorCode }}
        >
          <div>
            <p
              className="
              text-[10px]
              uppercase
              tracking-widest
              text-white/80
              font-semibold
            "
            >
              Need assistance?
            </p>

            <h2
              className="
              mt-2
              text-2xl
              sm:text-3xl
              font-bold
              text-white
            "
            >
              Let's find the right solution.
            </h2>

            <p
              className="
              mt-2
              text-xs
              text-white/90
            "
            >
              Contact our team for product information, technical assistance and
              quotations.
            </p>
          </div>

          <Link
            to="/contact/page"
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-md
              bg-white
              
              text-xs
              font-semibold
              hover:bg-gray-50
              transition
            "
            style={{ color: colorCode }}
          >
            Contact Us
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

// ======================================================
// INFO CARD
// ======================================================

function InfoCard({ number, title, text }) {
  const colorCode = "#ff3f34";
  return (
    <div
      className="
      group
      rounded-xl
      border
      border-orange-100
      bg-white
      p-5
      hover:border-[#ff3f34]
      hover:-translate-y-1
      transition-all
      duration-300
    "
    >
      <span
        className="
        text-sm
        font-bold
        
      "
        style={{ color: colorCode }}
      >
        {number}
      </span>

      <h3
        className="
        mt-4
        text-sm
        font-semibold
        text-gray-900
      "
      >
        {title}
      </h3>

      <p
        className="
        mt-2
        text-[11px]
        leading-5
        text-gray-500
      "
      >
        {text}
      </p>
    </div>
  );
}

// ======================================================
// CHECK ITEM
// ======================================================

function CheckItem({ children }) {
  const colorCode = "#ff3f34";
  return (
    <div
      className="
      flex
      items-start
      gap-3
    "
    >
      <CheckCircle2
        size={18}
        className="
          
          shrink-0
          mt-0.5
        "
        style={{ color: colorCode }}
      />

      <p
        className="
        text-xs
        sm:text-sm
        text-gray-600
        leading-5
      "
      >
        {children}
      </p>
    </div>
  );
}

export default AboutPage;
