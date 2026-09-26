import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  PackageSearch,
  FileQuestion,
  Headphones,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

function Contacts() {
  const colorCode = "#e85d04";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // SUBMIT FORM
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact Form:", formData);

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="w-full min-h-screen bg-white text-black sm:mt-20 mt-16">

      {/* ==================================================
          BREADCRUMB
      ================================================== */}

      <div className="max-w-6xl mx-auto px-5 pt-6">

        <div className="
          flex
          items-center
          gap-2
          text-[12px]
          uppercase
          text-gray-400
        ">

          <Link
            to="/"
            className="hover:text-[#e85d04] transition"
          >
            Home
          </Link>

          <ChevronRight size={11} />

          <span className="text-gray-700">
            Contact Us
          </span>

        </div>

      </div>


      {/* ==================================================
          MAIN CONTACT SECTION
      ================================================== */}

      <section className="
        max-w-6xl
        mx-auto
        px-5
        py-8
        sm:py-10
      ">

        <div className="
          grid
          grid-cols-1
          lg:grid-cols-[1fr_0.85fr]
          gap-8
          lg:gap-12
          items-start
        ">

          {/* ==================================================
              LEFT CONTENT
          ================================================== */}

          <div>

            {/* SECTION LABEL */}

            <p className="
              text-[11px]
              uppercase
              tracking-wide
            
              font-medium
            "style={{ color: colorCode }}>
              Get In Touch
            </p>


            {/* HEADING */}

            <h1 className="
              mt-3
              text-xl
              sm:text-2xl
              font-semibold
              text-gray-900
            ">
              Let's Find the Right Test &
              Measurement Solution for You
            </h1>


            {/* DESCRIPTION */}

            <p className="
              mt-3
              max-w-xl
              text-[15px]
              leading-5
              text-gray-600
            ">
              Looking for a specific test and
              measurement instrument? Have questions
              about product specifications, availability
              or technical requirements?
            </p>

            <p className="
              mt-2
              max-w-xl
              text-[15px]
              leading-5
              text-gray-600
            ">
              Get in touch with the IKONIX team.
              Share your requirement and we will help
              you explore a suitable solution.
            </p>


            {/* ==================================================
                CONTACT OPTIONS
            ================================================== */}

            <h2 className="
              mt-7
              text-[15px]
              font-semibold
             
            "style={{ color: colorCode }}>
              Contact Options
            </h2>


            <div className="
              mt-4
              space-y-4
            ">

              {/* PRODUCT ENQUIRIES */}

              <ContactOption
                icon={<PackageSearch size={17} />}
                title="Product Enquiries"
                text="Have a product in mind? Send us your requirements and enquire about the instrument."
              />


              {/* REQUEST A QUOTE */}

              <ContactOption
                icon={<FileQuestion size={17} />}
                title="Request a Quote"
                text="Looking for pricing or multiple products? Submit your requirement to receive further information."
              />


              {/* TECHNICAL ASSISTANCE */}

              <ContactOption
                icon={<Headphones size={17} />}
                title="Technical Assistance"
                text="Need more information about a product or its specifications? Our team is available to assist."
              />

            </div>


            {/* ==================================================
                LOCATION
            ================================================== */}

            <h2 className="
              mt-8
              text-xs
              font-semibold
              text-gray-900
            ">
              Our Location
            </h2>


            <div className="
              mt-3
              w-full
              max-w-[430px]
              h-[230px]
              overflow-hidden
              rounded-md
              border
              border-gray-100
            ">

              <iframe
                title="IKONIX Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6434795109108!2d77.59989727794112!3d12.99464005463564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae165c0c60c8f7%3A0x3e6b0217656f1984!2sGowramma%20fliuring%20mill%2C%2032%2F2%2C%20BM%20layout%20vinteshpur%2C%20beside%20North%20Mariyamma%20temple%2C%20Cantonment%20Railway%20Quarters%2C%20Shivaji%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560046!5e0!3m2!1sen!2sin!4v1790433526363!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
              />

            </div>

          </div>


          {/* ==================================================
              RIGHT CONTACT FORM
          ================================================== */}

          <div className="
            rounded-lg
            border
            border-gray-100
            bg-[#fafafa]
            p-5
            sm:p-6
          ">

            {/* FORM HEADER */}

            <p className="
              text-[10px]
              uppercase
              tracking-wide
              
              font-medium
            "style={{ color: colorCode }}>
              Contact Us
            </p>

            <h2 className="
              mt-2
              text-lg
              sm:text-[25px]
              font-semibold
              text-gray-900
            ">
              How Can We Assist You?
            </h2>

            <p className="
              mt-2
              text-xs
              leading-5
              text-gray-500
            ">
              Share your questions, feedback, and
              ideas with us.
            </p>
            
            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-5"
            >

              {/* NAME + EMAIL */}

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-3
              ">

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="
                    w-full
                    h-9
                    px-3
                    rounded-sm
                    border
                    border-gray-200
                    bg-white
                    text-xs
                    outline-none
                    focus:border-[#e85d04]
                    transition
                  "
                />


                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="
                    w-full
                    h-9
                    px-3
                    rounded-sm
                    border
                    border-gray-200
                    bg-white
                    text-xs
                    outline-none
                    focus:border-[#e85d04]
                    transition
                  "
                />

              </div>


              {/* PHONE */}

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="
                  mt-3
                  w-full
                  h-9
                  px-3
                  rounded-sm
                  border
                  border-gray-200
                  bg-white
                  text-xs
                  outline-none
                  focus:border-[#e85d04]
                  transition
                "
              />


              {/* MESSAGE */}

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                required
                rows="6"
                className="
                  mt-3
                  w-full
                  px-3
                  py-3
                  rounded-sm
                  border
                  border-gray-200
                  bg-white
                  text-xs
                  outline-none
                  resize-none
                  focus:border-[#e85d04]
                  transition
                "
              />


              {/* SUCCESS MESSAGE */}

              {submitted && (
                <div className="
                  mt-3
                  rounded-md
                  bg-green-50
                  border
                  border-green-100
                  px-3
                  py-2
                  text-[10px]
                  text-green-700
                ">
                  Thank you. Your enquiry has been
                  submitted successfully.
                </div>
              )}


              {/* SUBMIT */}

              <button
                type="submit"
                className="
                  mt-4
                  w-full
                  h-10
                  rounded-md
                  bg-[#e85d04]
                  text-white
                  text-xs
                  font-medium
                  hover:bg-orange-500
                  transition
                "
              >
                Submit
              </button>

            </form>


            {/* ==================================================
                QUICK CONTACT
            ================================================== */}

            <p className="
              mt-5
              text-[10px]
              text-gray-500
            ">
              Prefer quick communication?
            </p>

            <div className="
              mt-2
              grid
              grid-cols-2
              gap-2
            ">

              {/* WHATSAPP */}

              <a
                href="https://wa.me/918111856618"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  h-8
                  rounded-full
                  border
                  
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-[10px]
                  text-gray-700
                  hover:bg-orange-50
                  transition
                "style={{ borderColor: colorCode }}
              >

                <MessageCircle
                  size={13}
                  className="text-green-600"
                />

                WhatsApp

              </a>


              {/* EMAIL */}

              <a
                href="mailto:info@ikonixinstruments.com"
                className="
                  h-8
                  rounded-full
                  border
                  border-[#e85d04]
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-[10px]
                  text-gray-700
                  hover:bg-orange-50
                  transition
                "
              >

                <Mail
                  size={13}
                  style={{ color: colorCode }}
                />

                Email Us

              </a>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          CONTACT INFORMATION BAR
      ================================================== */}

      <section className="
        border-t
        border-gray-100
        bg-[#fafafa]
      ">

        <div className="
          max-w-6xl
          mx-auto
          px-5
          py-8
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-5
        ">

          {/* PHONE */}

          <ContactInfo
            icon={<Phone size={17} />}
            title="Call Us"
            value="+91 81181 56618"
            href="tel:+918118156618"
          />


          {/* EMAIL */}

          <ContactInfo
            icon={<Mail size={17} />}
            title="Email Us"
            value="info@ikonixinstruments.com"
            href="mailto:info@ikonixinstruments.com"
          />


          {/* LOCATION */}

          <ContactInfo
            icon={<MapPin size={17} />}
            title="Location"
            value="India"
          />

        </div>

      </section>

    </div>
  );
}


// ======================================================
// CONTACT OPTION
// ======================================================

function ContactOption({
  icon,
  title,
  text,
}) {
  const colorCode = "#ff3f34";
  return (
    <div className="
      flex
      items-start
      gap-3
    ">

      <div className="
        w-8
        h-8
        shrink-0
        rounded-md
        bg-orange-50
        
        flex
        items-center
        justify-center
      "style={{ color: colorCode }}>
        {icon}
      </div>

      <div>

        <h3 className="
          text-xs
          font-medium
          text-gray-800
        ">
          {title}
        </h3>

        <p className="
          mt-1
          max-w-md
          text-[10px]
          leading-4
          text-gray-500
        ">
          {text}
        </p>

      </div>

    </div>
  );
}


// ======================================================
// CONTACT INFO
// ======================================================

function ContactInfo({
  icon,
  title,
  value,
  href,
}) {
const colorCode = "#ff3f34";
  const content = (
    <div className="
      flex
      items-center
      gap-3
    ">

      <div className="
        w-9
        h-9
        rounded-md
        bg-white
        border
        border-orange-100
      
        flex
        items-center
        justify-center
        shrink-0
      " style={{ color: colorCode }}>
        {icon}
      </div>

      <div>

        <p className="
          text-[9px]
          uppercase
          tracking-wide
          text-gray-400
        ">
          {title}
        </p>

        <p className="
          mt-1
          text-xs
          font-medium
          text-gray-800
        ">
          {value}
        </p>

      </div>

    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="hover:opacity-70 transition"
      >
        {content}
      </a>
    );
  }

  return content;
}

export default Contacts;