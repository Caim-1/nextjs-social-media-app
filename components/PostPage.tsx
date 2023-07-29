"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import CreateComment from "./CreateComment";
import CommentCard from "./CommentCard";
import { Comment, Post } from "@/common.types";
import { deleteCommentFromDB, deletePostFromDB } from "@/utils/utils";

type Props = {
  post: Post;
};

const PostPage = ({ post }: Props) => {
  const [currentPost, setCurrentPost] = useState(post);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comment/${currentPost._id}`);
      const data = await response.json();
      console.log(data);
      setComments(data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostDelete = async (postToDelete: Post) => {
    const isConfirmed = confirm("Are you sure you want to delete this post?");

    if (isConfirmed) {
      await deletePostFromDB(postToDelete);
    }
  };

  const handleCommentDelete = async (commentToDelete: Comment) => {
    const isConfirmed = confirm(
      "Are you sure you want to delete this comment?"
    );

    if (isConfirmed) {
      const deleted = await deleteCommentFromDB(commentToDelete);

      if (deleted) {
        const filteredComments = comments?.filter(
          (comment) => comment._id !== commentToDelete._id
        );

        setComments(filteredComments);
      }
    }
  };

  return (
    <div className="feed">
      <PostCard post={currentPost} handleDelete={handlePostDelete} />
      <CreateComment postId={currentPost._id} fetchComments={fetchComments} />
      {comments.map((comment) => (
        <CommentCard
          key={comment._id}
          comment={comment}
          handleDelete={handleCommentDelete}
        />
      ))}
    </div>
  );
};

export default PostPage;
