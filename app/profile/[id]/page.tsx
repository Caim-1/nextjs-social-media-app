"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@/components/Profile";
import Loading from "@/components/Loading";
import { Post, User } from "@/common.types";

const UserProfile = ({ params }: any) => {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${params?.id}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        fetchPosts();
      } else {
        router.push("/error");
      }
    };

    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params?.id}/posts`);
      const data = await response.json();

      setUserPosts(data);
    };

    if (params?.id) fetchUser();
  }, [params.id]);

  const fetchLikedPosts = async () => {
    const response = await fetch(`/api/post/`);
    const data = await response.json();

    if (user && data) {
      const filteredPosts = data.filter((post: Post) => {
        if (post.likes.includes(user._id)) {
          return post;
        }
      });

      setLikedPosts(filteredPosts.reverse());
    }
  };

  return (
    <>
      {user ? (
        <Profile
          description={`This is the profile of ${user?.username}`}
          posts={userPosts}
          user={user}
          likedPosts={likedPosts}
          fetchLikedPosts={fetchLikedPosts}
        />
      ) : (
        <Loading />
      )}
    </>
  );
};

export default UserProfile;
