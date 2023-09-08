"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";

const LeftSidebar = () => {
  const { data: session } = useSession();

  return (
    <aside className="sidebar sbleft">
      <Link href="/" className="sidebar_item">
        <IoMdHome size={25} />
        <span>Home</span>
      </Link>
      {session && (
        <Link href="/profile" className="sidebar_item">
          <FaUser size={25} />
          <span>Profile</span>
        </Link>
      )}
    </aside>
  );
};

export default LeftSidebar;
