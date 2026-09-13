import React, { useEffect, useState } from "react";
import axios from "axios";

function IndustryBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH BRANDS
  // ======================================================

  const fetchBrands = async () => {
    try {
      setLoading(true);

      const response = await axios.get("https://ikonix-backend.vercel.app/api/brands/getAllBrands");

      console.log("Brands Response:", response.data);

      const allBrands = response.data.brands || [];

      // Only show active brands
      const activeBrands = allBrands.filter(
        (brand) => brand.status === "Active",
      );

      setBrands(activeBrands);
    } catch (error) {
      console.error("Fetch Brands Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD BRANDS
  // ======================================================

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <section className="w-full bg-white">
      {/* ==================================================
          ABOUT / INTRO SECTION
      ================================================== */}

      <div
        className="
          max-w-6xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          py-14
        "
      >
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-8
            items-center
          "
        >
          {/* LEFT CONTENT */}

          <div>
            <h2
              className="
                text-2xl
                sm:text-3xl
                font-semibold
                text-gray-900
              "
            >
              Explore Leading Test &{" "}
              <span className="text-[#FC9D03]">Measurement Brands</span>
            </h2>

            <p
              className="
                mt-5
                text-xs
                sm:text-sm
                leading-5
                text-gray-700
              "
            >
              Discover trusted brands and a comprehensive range of test and
              measurement instruments, including electrical, electronic,
              temperature and industrial measurement solutions from IKONIX.
            </p>

            <p
              className="
                mt-3
                text-xs
                sm:text-sm
                leading-5
                text-gray-700
              "
            >
              We work with established brands and product ranges to provide
              customers with dependable testing and measurement solutions.
            </p>
          </div>

          {/* RIGHT IMAGE */}

          <div className="flex justify-center md:justify-end">
            <img
              src="https://media.istockphoto.com/id/2196774602/photo/businessmen-do-an-assessment-questionnaire-evaluation-online-survey-online-test-checklist-and.jpg?s=612x612&w=0&k=20&c=7KO5rjbIDYD_WMtY-qF-0ueYjF6fsucIlbWMdIRPqG4="
              alt="Test and Measurement"
              className="
                w-full
                max-w-[420px]
                h-[190px]
                object-cover
                rounded-lg
              "
            />
          </div>
        </div>

        {/* ==================================================
            OUR SERVICES
        ================================================== */}

        <div className="mt-10">
          <p
            className="
              text-xs
              font-medium
              text-[#FC9D03]
            "
          >
            Our Services
          </p>

          <div
            className="
              mt-5
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
              max-w-4xl
              mx-auto
            "
          >
            {/* SERVICE 1 */}

            <div
              className="
                bg-[#FC9D03]
                text-white
                px-5
                py-4
                min-h-[95px]
              "
            >
              <div className="flex gap-3">
                <span
                  className="
                    text-xl
                    font-medium
                  "
                >
                  1
                </span>

                <div>
                  <h3 className="text-sm font-semibold">
                    Product Consultation
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      leading-4
                    "
                  >
                    Get assistance in identifying suitable instruments based on
                    your application and measurement requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* SERVICE 2 */}

            <div
              className="
                bg-[#FC9D03]
                text-white
                px-5
                py-4
                min-h-[95px]
              "
            >
              <div className="flex gap-3">
                <span
                  className="
                    text-xl
                    font-medium
                  "
                >
                  2
                </span>

                <div>
                  <h3 className="text-sm font-semibold">Calibration Support</h3>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      leading-4
                    "
                  >
                    Support for customers requiring reliable measurement
                    equipment and calibration-related solutions.
                  </p>
                </div>
              </div>
            </div>

            {/* SERVICE 3 */}

            <div
              className="
                bg-[#FC9D03]
                text-white
                px-5
                py-4
                min-h-[95px]
              "
            >
              <div className="flex gap-3">
                <span
                  className="
                    text-xl
                    font-medium
                  "
                >
                  3
                </span>

                <div>
                  <h3 className="text-sm font-semibold">
                    Technical Assistance
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      leading-4
                    "
                  >
                    Get product-related assistance and guidance when evaluating
                    test and measurement instruments.
                  </p>
                </div>
              </div>
            </div>

            {/* SERVICE 4 */}

            <div
              className="
                bg-[#FC9D03]
                text-white
                px-5
                py-4
                min-h-[95px]
              "
            >
              <div className="flex gap-3">
                <span
                  className="
                    text-xl
                    font-medium
                  "
                >
                  4
                </span>

                <div>
                  <h3 className="text-sm font-semibold">Product Enquiry</h3>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      leading-4
                    "
                  >
                    Contact our team directly for product availability,
                    specifications, quotations and other requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          BRANDS SECTION
      ================================================== */}

      <div
        className="
          max-w-6xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          pb-14
        "
      >
        {/* TITLE */}

        <div className="text-center">
          <h2
            className="
              text-2xl
              sm:text-3xl
              font-semibold
              text-gray-900
            "
          >
            <span className="text-[#FC9D03]">Browse Industry</span> Leading
            Brands
          </h2>

          <p
            className="
              mt-3
              max-w-2xl
              mx-auto
              text-xs
              sm:text-sm
              text-gray-600
            "
          >
            IKONIX Measuring Equipment LLC collaborates with hundreds of
            suppliers in the test and measurement sector, offering a wide range
            of brands and thousands of products.
          </p>
        </div>

        {/* ==================================================
            BRAND LOGOS
        ================================================== */}

        <div
          className="
            mt-8
            min-h-[170px]
            flex
            items-center
            justify-center
          "
        >
          {loading ? (
            <div
              className="
                w-8
                h-8
                border-4
                border-orange-100
                border-t-[#FC9D03]
                rounded-full
                animate-spin
              "
            />
          ) : brands.length === 0 ? (
            <p className="text-sm text-gray-400">No brands available.</p>
          ) : (
            <div
              className="
                w-full
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-6
                gap-x-8
                gap-y-8
                items-center
                justify-items-center
              "
            >
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="
                    group
                    w-full
                    h-[70px]
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                  "
                >
                  {brand.Image ? (
                    <img
                      src={brand.Image}
                      alt={brand.brandName || "Brand"}
                      title={brand.brandName}
                      className="
                        max-w-[125px]
                        max-h-[55px]
                        w-auto
                        h-auto
                        object-contain
                        transition-all
                        duration-300
                        group-hover:scale-110
                      "
                    />
                  ) : (
                    <span
                      className="
                        text-xs
                        font-semibold
                        text-gray-500
                      "
                    >
                      {brand.brandName}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================================================
          TRUSTED DESTINATION SECTION
      ================================================== */}

      <div
        className="
          border-t
          border-gray-100
          bg-[#fafafa]
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
            px-5
            sm:px-8
            lg:px-10
            py-12
          "
        >
          <h2
            className="
              text-lg
              sm:text-xl
              font-semibold
              text-gray-900
            "
          >
            Your Trusted Destination for Test & Measurement Solutions
          </h2>

          <div
            className="
              mt-5
              space-y-3
              text-xs
              sm:text-sm
              leading-5
              text-gray-700
            "
          >
            <p>
              IKONIX Test and Measurement LLP provides reliable test and
              measurement instruments designed to meet the needs of
              professionals, engineers, technicians, business and industrial
              users.
            </p>

            <p>
              Our product-focused catalogue brings together a range of
              measurement and testing solutions, making it easier to find the
              right equipment for your specific requirements.
            </p>

            <p>
              We offer carefully selected test and measurement products focused
              on accuracy, reliability and professional performance.
            </p>

            <p>
              Our range can support applications across electrical testing,
              electronics, temperature measurement, inspection and other
              professional measurement requirements.
            </p>

            <p>
              For product specifications, view available documentation and
              connect with our team through WhatsApp or email.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IndustryBrands;
