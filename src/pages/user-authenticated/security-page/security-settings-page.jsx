// ---- react ----
import { useState } from "react";

// ---- context ----
import { useAuth } from "@/context/AuthContextProvider";

// ---- component ----
import LoadingSpinner from "@/components/loading/loading-spinner";
import Heading from "@/components/header/page-heading";

// ---- library ----
import { useNavigate } from "react-router"; // ---- react-router-dom

// ---- security settings page
export default function SecuritySettingsPage() {
  // ---- user-context
  const { user, signOut } = useAuth();

  // ---- get the username and name
  const username = user.username;
  const name = user.name;

  // ---- loading state
  const [isLoading, setIsLoading] = useState(false);

  // ---- react-router
  const navigate = useNavigate();

  // ---- sign out function
  const handleSignOut = () => {
    setIsLoading(true);

    signOut();

    setTimeout(() => {
      navigate("/signin"); // redirect after 1 second
      setIsLoading(false);
    }, 1000);
  };
  return (
    <div className="m-5 ">
      <div>
        <Heading
          title={"account settings"}
          description={`View your account details`}
        />

        <div className="min-w-[320px]">
          <div className="flex flex-col my-5  ">
            <label className="font-inter text-sm">Username</label>
            <input
              value={username}
              type="text"
              placeholder="username"
              className="border-none bg-gray-200 outline-none p-3 rounded-lg mt-2 cursor-not-allowed text-gray-500 "
              disabled
            />
          </div>

          <div className="flex flex-col my-5  ">
            <label className="font-inter text-sm">Name</label>
            <input
              value={name}
              type="text"
              placeholder="name"
              className="border-none bg-gray-200 outline-none p-3 rounded-lg mt-2 cursor-not-allowed text-gray-500 "
              disabled
            />
          </div>

          <button
            onClick={handleSignOut}
            className={
              isLoading
                ? "w-full p-3 rounded-md bg-[#1877F2] text-white font-inter font-bold hover:opacity-75 transition-opacity duration-300 2xl:p-4 cursor-not-allowed opacity-50"
                : "w-full p-3 rounded-md bg-[#1877F2] text-white font-inter font-bold hover:opacity-75 transition-opacity duration-300 2xl:p-4 cursor-pointer"
            }
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
