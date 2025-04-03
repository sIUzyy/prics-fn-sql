// props validation
import PropTypes from "prop-types";

export default function AboutCard({ title, description, style }) {
  return (
    <div className={`${style}`}>
      <div className=" md:w-1/2">
        <h1 className="font-bebas text-4xl tracking-widest text-gray-900">
          {title}
        </h1>
      </div>

      <div className=" text-justify md:w-1/2 text-base/7 text-gray-600">
        <p>{description}</p>
      </div>
    </div>
  );
}

// Prop validation
AboutCard.propTypes = {
  title: PropTypes.string.isRequired, // Ensures title is a string
  description: PropTypes.string.isRequired, // Ensures description is a string
  style: {},
};
