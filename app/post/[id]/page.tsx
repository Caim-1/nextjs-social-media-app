"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import PostPage from "@/components/PostPage";
import { Post } from "@/common.types";

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

  if (!post) return <Loading />; // To be changed.

  return <PostPage post={post} />;
};

export default page;
