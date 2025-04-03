// ---- library ----

import { MdKeyboardArrowLeft } from "react-icons/md"; // ---- react-icons
import { Link, Outlet, NavLink } from "react-router"; // ---- react-router-dom

// ---- assets ----
import auth_image from "../assets/auth_image.webp"; // ---- image

// ---- authentication page (sign-in)
export default function AuthenticationPage() {
  return (
    <div className="main_container p-5  lg:flex border-1 lg:h-screen">
      <div className="image hidden  lg:block lg:w-3/5 lg:my-auto xl:w-3/5 ">
        <img
          src={auth_image}
          alt="auth-image "
          className="lg:w-full "
          loading="lazy"
        />
      </div>

      <div className="lg:ml-5 lg:w-2/5 xl:w-2/5  ">
        {/*icon */}
        <div className="navigate_home flex justify-between items-center lg:hidden">
          <Link to={"/"}>
            <MdKeyboardArrowLeft size={30} />
          </Link>

          <div className="flex gap-4">
            <NavLink
              to="/signin/driver"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 font-bold "
                  : "text-[#979090] hover:text-blue-500"
              }
            >
              Driver
            </NavLink>
            /
            <NavLink
              to="/signin/security"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 font-bold "
                  : "text-[#979090] hover:text-blue-500"
              }
            >
              Security
            </NavLink>
            /
            <NavLink
              to="/signin/admin"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 font-bold "
                  : "text-[#979090] hover:text-blue-500"
              }
            >
              Admin
            </NavLink>
          </div>
        </div>

        {/*auth-section */}
        <div className="auth_section h-screen flex flex-col justify-center items-center lg:h-full   ">
          <div className="md:max-w-md">
            <div className="navigate_home hidden lg:flex justify-between items-center mb-10  ">
              <Link to={"/"}>
                <MdKeyboardArrowLeft size={45} />
              </Link>

              <div className="flex gap-4">
                <NavLink
                  to="/signin/driver"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold "
                      : "text-[#979090] hover:text-blue-500"
                  }
                >
                  Driver
                </NavLink>
                /
                <NavLink
                  to="/signin/security"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold "
                      : "text-[#979090] hover:text-blue-500"
                  }
                >
                  Security
                </NavLink>
                /
                <NavLink
                  to="/signin/admin"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold "
                      : "text-[#979090] hover:text-blue-500"
                  }
                >
                  Admin
                </NavLink>
              </div>
            </div>
            <h1 className="font-inter text-lg text-center mb-5 xl:text-2xl ">
              Sign in to{" "}
              <span className="font-bebas tracking-widest text-indigo-500">
                E-POD
              </span>
            </h1>

            <p className="text-center text-sm text-gray-500 xl:text-base 2xl:text-lg">
              Welcome to E-POD by PRICS Technologies Inc. Please enter your
              login details below to use the app.
            </p>

            {/*credentials-details */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
