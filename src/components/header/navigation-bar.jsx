// ---- react ----
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

// react-router-dom
import { Link } from "react-router";

// image
import prics_logo from "../../assets/nav_logo_bg_rm.png";

// ---- headless-ui ----
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// navigation bar items
const navigation = [
  { name: "Home" },
  { name: "About" },
  { name: "Contact" },
  { name: "Clients" },
];

export default function NavigationBar({ aboutRef, contactRef, clientRef }) {
  // state for navigation
  const [, setNav] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // close the sidebar if click outside ref
  const sidebarRef = useRef(null);

  // function to scroll to specific page
  const scrollToSection = (ref) => {
    setNav(false); // Close the sidebar
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // close the sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setNav(false); // Close the sidebar if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-50 ">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link tp="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Prics Technologies Inc.</span>
            <img
              alt="PRICS Technologies Inc. logo"
              src={prics_logo}
              className="w-[140px] h-[60px] object-cover"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => {
            if (item.name === "Home") {
              return (
                <button
                  key={item.name}
                  className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                >
                  {item.name}
                </button>
              );
            } else if (item.name === "About") {
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(aboutRef)}
                  className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                >
                  {item.name}
                </button>
              );
            } else if (item.name === "Contact") {
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(contactRef)}
                  className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                >
                  {item.name}
                </button>
              );
            } else if (item.name === "Clients") {
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(clientRef)}
                  className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                >
                  {item.name}
                </button>
              );
            }
          })}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            to={"/signin"}
            className="text-sm/6 font-semibold text-gray-900"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link tp="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Prics Technologies Inc.</span>
              <img
                alt="PRICS Technologies Inc. logo"
                src={prics_logo}
                className="w-[140px] h-[60px] object-cover"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => {
                  if (item.name === "Home") {
                    return (
                      <button
                        key={item.name}
                        onClick={() => setMobileMenuOpen(false)} // Close menu
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </button>
                    );
                  } else if (item.name === "About") {
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          scrollToSection(aboutRef);
                          setMobileMenuOpen(false); // Close menu after scrolling
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </button>
                    );
                  } else if (item.name === "Contact") {
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          scrollToSection(contactRef);
                          setMobileMenuOpen(false); // Close menu after scrolling
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </button>
                    );
                  } else if (item.name === "Clients") {
                    return (
                      <button
                        key={item.name}
                        onClick={() => scrollToSection(clientRef)}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </button>
                    );
                  }
                })}
              </div>
              <div className="py-6">
                <Link
                  to="/signin"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

// props validation
NavigationBar.propTypes = {
  aboutRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  contactRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  clientRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
