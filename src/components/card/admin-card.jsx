// prop validation
import PropTypes from "prop-types";

export default function AdminCard({ title, description }) {
  return (
    <div className="card bg-[#D9D9D9] rounded-lg flex items-center justify-start min-w-[344px] min-h-[200px] shadow-lg max-w-[510px]">
      <div className="px-3">
        <h1 className="font-bebas tracking-widest text-3xl">{title}</h1>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}

// Define Prop Types
AdminCard.propTypes = {
  title: PropTypes.string.isRequired, // Required string
  description: PropTypes.string.isRequired, // Required string
};
