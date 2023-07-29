"use client";

import { useEffect, useState } from "react";
import { Post } from "@/common.types";
import PostPage from "@/components/PostPage";
import RightSidebar from "@/components/RightSidebar";
import LeftSidebar from "@/components/LeftSidebar";

const page = ({ params }: any) => {
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/post/${params?.id}`);
      const data = await response.json();
      setPost(data);
    };

    if (params?.id) fetchPost();
  }, [params.id]);

  if (!post) return <div>Cannot find post of such ID.</div>; // To be changed.

  return (
    <section className="home_grid my-10 mx-6">
      <LeftSidebar />
      <PostPage post={post} />
      <RightSidebar />
    </section>
  );
};

export default page;
