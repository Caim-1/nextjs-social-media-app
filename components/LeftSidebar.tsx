"use client";

import { IoMdHome } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

const LeftSidebar = () => {
  const router = useRouter();

  const handleRedirect = (destination: string) => {
    if (destination === "home") {
      router.push("/");
    } else if (destination === "profile") {
      router.push("/profile");
    }
  };

  return (
    <div className="sidebar sbleft rounded-2xl">
      <button
        className="sidebar_item rounded-2xl"
        onClick={() => handleRedirect("home")}
      >
        <IoMdHome size={25} />
        <span className="font-semibold">Home</span>
      </button>
      <button
        className="sidebar_item rounded-2xl"
        onClick={() => handleRedirect("profile")}
      >
        <FaUser size={25} />
        <span className="font-semibold">Profile</span>
      </button>
    </div>
  );
};

export default LeftSidebar;
