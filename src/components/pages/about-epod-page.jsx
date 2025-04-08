// ---- props-validation ----
import PropTypes from "prop-types";

// ---- icons ----
import { Share2, CalendarDays, Images, MapPin } from "lucide-react";

// ---- array of features ----
const features = [
  {
    name: "WMS Integration",
    description:
      "Seamlessly syncs with the WMS to track and manage deliveries in real time. View assigned tracking numbers and delivery details for efficient order fulfillment.",
    icon: Share2,
  },
  {
    name: "Appointment Scheduling",
    description:
      "Enables administrators to assign delivery appointments to riders, while riders can view their schedules. This ensures efficient coordination and timely deliveries.",
    icon: CalendarDays,
  },
  {
    name: "Delivery Image Attachment",
    description:
      " Allows administrators to view images uploaded by delivery riders as proof of delivery.",
    icon: Images,
  },
  {
    name: "Optimized Drop-off Routing",
    description:
      " Automatically calculates the distance from the warehouse to the customer’s address to determine the nearest drop-off points. Helps optimize delivery routes for efficiency and reduced travel time.",
    icon: MapPin,
  },
];

export default function AboutEpodPageComponent({ epodRef }) {
  return (
    <div ref={epodRef} className="bg-white py-24 sm:py-32 ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Electronic Proof of Delivery
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
            Everything you need to know about PRICS ePOD
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-sm bg-indigo-600">
                    <feature.icon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

// props validation
AboutEpodPageComponent.propTypes = {
  epodRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
