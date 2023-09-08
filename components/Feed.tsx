"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import { deletePostFromDB } from "@/utils/utils";
import { Post } from "@/common.types";

const Feed = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("/api/post");
    const data = await response.json();

    setAllPosts(data.reverse()); // Reverse the posts so that the most recent one is at the beginning.
  };

  const handleDelete = async (postToDelete: Post) => {
    const isConfirmed = confirm("Are you sure you want to delete this post?");

    if (isConfirmed) {
      const deleted = await deletePostFromDB(postToDelete);

      if (deleted) {
        const filteredPosts = allPosts?.filter(
          (post) => post._id !== postToDelete._id
        );

        setAllPosts(filteredPosts);
      }
    }
  };

  return (
    <section className="feed">
      <CreatePost fetchPosts={fetchPosts} />
      {allPosts.map((post) => (
        <PostCard key={post._id} post={post} handleDelete={handleDelete} />
      ))}
    </section>
  );
};

export default Feed;
