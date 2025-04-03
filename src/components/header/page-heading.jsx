import PropTypes from "prop-types"; // import PropTypes

export default function Heading({ title, description }) {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-inter font-semibold capitalize">{title}</h1>
      <p className="text-[#6c757d] text-sm">{description}</p>
    </div>
  );
}

// propTypes validation
Heading.propTypes = {
  title: PropTypes.string.isRequired, // title should be a string and is required
  description: PropTypes.string.isRequired, // description should be a string and is required
};
