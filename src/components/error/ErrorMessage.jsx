import PropTypes from "prop-types";

export default function ErrorMessage({ message }) {
  return <p className="text-center font-inter mt-2 text-red-500">{message}</p>;
}

// PropTypes validation
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired, // message must be a string and is required
};
