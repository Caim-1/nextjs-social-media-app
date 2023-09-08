import { useEffect } from "react";
import PostCard from "./PostCard";
import { Post } from "@/common.types";

type Props = {
  likedPosts: Post[];
  handleDelete?: Function;
  fetchLikedPosts: Function;
};

const LikedPosts = ({ likedPosts, handleDelete, fetchLikedPosts }: Props) => {
  useEffect(() => {
    if (likedPosts.length === 0) fetchLikedPosts();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {likedPosts.map((post) => (
        <PostCard key={post._id} post={post} handleDelete={handleDelete} />
      ))}
    </div>
  );
};

export default LikedPosts;
