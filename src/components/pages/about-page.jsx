// props-validation
import PropTypes from "prop-types";

// components - card
import AboutCard from "../card/about-card";

export default function AboutPageComponent({ aboutRef }) {
  return (
    <div ref={aboutRef} className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-20">
          <p className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
            PRICS Technologies Inc.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <AboutCard
            style={"md:flex"}
            title={"PRICS TEAM"}
            description={`A group of young, proactive and highly experienced individuals, with
          different expertise in their respective fields, joined together and
          established PRICS Technologies with a common goal of sharing their
          vast knowledge and experiences in helping companies grow their
          business. PRICS Team who is composed of Supply Chain, Information
          Technology, Sales & Marketing and Finance Practitioners, thinks for
          out of the box solutions and offers the latest best practices, thus
          removing the limitations companies are getting from the traditional
          software offered in the market.`}
          />
          <AboutCard
            style={"my-10 md:flex"}
            title={"our mission"}
            description={`PRICS Team mission is to enable our clients to fully execute their
          business strategy through People, Process and Technology. Help them
          confidently address technology-related decisions and ensure their IT
          organizations and operating models are agile and effective,
          equipping them to cut through the noise of fleeting technology
          trends to create enduring results.`}
          />
          <AboutCard
            style={"my-10 md:flex"}
            title={"our vision"}
            description={`PRICS Team vision is for its solutions and services focuses on the
          strategic needs of our clients businesses to determine the
          technology capabilities needed to support their long-term goals and
          not constrain it.`}
          />
        </div>
      </div>
    </div>
  );
}

// props validation
AboutPageComponent.propTypes = {
  aboutRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
