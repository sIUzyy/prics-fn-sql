// prop validation
import PropTypes from "prop-types";

// this card will display in useralldelivery.jsx
export default function UserCard({ header, description }) {
  return (
    <div className="card bg-[#D9D9D9] rounded-lg flex items-center justify-start min-w-[344px] min-h-[200px] shadow-lg">
      <div className="px-3">
        <h1 className="font-bebas tracking-widest text-3xl">{header}</h1>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}

// Define Prop Types
UserCard.propTypes = {
  header: PropTypes.string.isRequired, // Required string
  description: PropTypes.string.isRequired, // Required string
};
