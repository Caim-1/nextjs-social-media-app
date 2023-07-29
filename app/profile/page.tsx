"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Profile from "@/components/Profile";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

const MyProfile = () => {
  const { data: session } = useSession();
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setMyPosts(data.reverse());
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = () => {};

  const handleDelete = () => {};

  return (
    <section className="home_grid my-10 mx-6">
      <LeftSidebar />
      <Profile
        name="My"
        desc="This is your profile"
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        posts={myPosts}
      />
      <RightSidebar />
    </section>
  );
};

export default MyProfile;
