// ---- props-validation ----
import PropTypes from "prop-types";

// ---- animation ----
import { motion } from "framer-motion";

// ---- list of clients ----
const clients = [
  { name: "Prince Retail Group of Companies" },
  { name: "Jentec Storage Inc" },
  { name: "Virginia Food Inc" },
  { name: "Godspeed Megamerchants Co., Inc" },
  { name: "JS Unitrade Merchandise Inc" },
  { name: "Magsaysay Shipping & Logistics" },
  { name: "OneStop Warehousing Solutions" },
  { name: "Cold Link Asia Logistics Corporation" },
];

export default function ClientPageComponent({ clientRef }) {
  return (
    <div ref={clientRef} className="bg-white py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance lg:text-center ">
          Our Trusted Partners & Clients
        </h2>
        <div className="relative mt-10 flex w-full overflow-hidden">
          <motion.div
            className="flex space-x-16"
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {clients.map((client, index) => (
              <h1
                className="text-center text-2xl tracking-widest text-gray-900 whitespace-nowrap font-bebas "
                key={index}
              >
                {client.name}
              </h1>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// props validation
ClientPageComponent.propTypes = {
  clientRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
