// NOTE: THIS IS THE CONTACT PAGE (FOOTER + CONTACT) THIS WILL DISPLAY ON LANDING PAGE

// react-router-dom
import { Link } from "react-router";

// react
import { useState } from "react";

// props-validation
import PropTypes from "prop-types";

export default function Footer({ contactRef }) {
  // get the current year
  const [year] = useState(new Date().getFullYear());

  return (
    <div ref={contactRef} className="py-20 bg-[#0C090A] px-5  ">
      <div className="lg:flex md:mb-20 xl:mb-30 2xl:max-w-7xl 2xl:mx-auto">
        <div className="company_name mb-15 lg:w-1/3 xl:w-2/5">
          <h1 className="footer-text ">prics technologies inc</h1>
          <p className="text-white italic text-sm">
            Innovation comes from all directions
          </p>
        </div>

        <div className="lg:flex lg:w-2/3 xl:w-3/5">
          <div className="md:flex">
            <div className="contact_section mb-5 md:mr-20 lg:mr-15">
              <h1 className="footer-text mb-3">CONTACT</h1>
              <a
                href="mailto:sales@pricstechnologies.com"
                className="text-white "
              >
                sales@pricstechnologies.com
              </a>
              <p className="text-white my-2 " title="tel number">
                (+632) 7964-1010
              </p>
              <p className="text-white mb-2 " title="viber number">
                (+63) 917 1101110
              </p>
            </div>

            <div className="social_media_section mb-5 lg:mr-15">
              <h1 className="footer-text mb-3">Socials</h1>

              <Link
                to={"https://www.facebook.com/PRICSTechnologiesInc"}
                target="_blank"
                title="PRICSTechnologiesInc"
              >
                <p className="text-white mb-2  hover:text-[#0866FF]">
                  Facebook
                </p>
              </Link>

              <Link
                to={"https://www.linkedin.com/company/prics-technologies-inc"}
                target="_blank"
                title="prics-technologies-inc"
              >
                <p className="text-white mb-2 hover:text-[#0077B5] ">
                  LinkedIn
                </p>
              </Link>
              <Link
                to={"https://www.vfi.pricswms.com/"}
                target="_blank"
                title="vfi.pricswms"
              >
                <p className="text-white hover:opacity-50 ">Website</p>
              </Link>
            </div>
          </div>

          <div className="location_section">
            <h1 className="footer-text mb-3">location</h1>
            <p className="text-white">
              Level 10-1, One Global Place, 25th Street and 5th Avenue,
              Bonifacio Global City (BGC), Taguig City, Philippines
            </p>
          </div>
        </div>
      </div>

      <div className="company_year_rights border-t-1 mt-7 border-gray-500 2xl:max-w-7xl 2xl:mx-auto">
        <p className="text-white mt-5">
          © {year} Prics Technologies Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// props validation
Footer.propTypes = {
  contactRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
