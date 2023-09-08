"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { deletePostFromDB } from "@/utils/utils";

import Profile from "@/components/Profile";
import Loading from "@/components/Loading";
import { Post } from "@/common.types";

const MyProfile = () => {
  const { data: session } = useSession();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
      setMyPosts(data.reverse());
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const fetchLikedPosts = async () => {
    const response = await fetch(`/api/post/`);
    const data = await response.json();

    if (data) {
      const filteredPosts = data.filter((post: Post) => {
        if (post.likes.includes(session?.user.id)) {
          return post;
        }
      });

      setLikedPosts(filteredPosts.reverse());
    }
  };

  // Only used to edit personal information.
  const handleEdit = () => {
    alert("handleEdit");
  };

  // Used to delete posts.
  const handleDelete = async (postToDelete: Post) => {
    alert("handleDelete");
    const isConfirmed = confirm("Are you sure you want to delete this post?");

    if (isConfirmed) {
      const deleted = await deletePostFromDB(postToDelete);

      if (deleted) {
        const filteredPosts = myPosts?.filter(
          (post) => post._id !== postToDelete._id
        );

        setMyPosts(filteredPosts);
      }
    }
  };

  return (
    <>
      {session?.user ? (
        <Profile
          description="This is your profile"
          posts={myPosts}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          likedPosts={likedPosts}
          fetchLikedPosts={fetchLikedPosts}
        />
      ) : (
        <Loading />
      )}
    </>
  );
};

export default MyProfile;
