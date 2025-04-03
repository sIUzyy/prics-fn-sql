import PropTypes from "prop-types";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative max-w-xs">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        className="py-2 px-3 ps-9 block w-full border ring-gray-300 rounded-lg text-sm outline-none focus:border-black "
        placeholder="Search for details"
      />
      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
        <svg
          className="size-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
    </div>
  );
}

// prop validation
SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};
