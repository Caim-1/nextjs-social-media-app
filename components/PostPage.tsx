"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { deleteCommentFromDB, deletePostFromDB } from "@/utils/utils";

import PostView from "./PostView";
import CommentCard from "./CommentCard";
import CreateComment from "./CreateComment";

import { Comment, Post } from "@/common.types";

type Props = {
  post: Post;
};

const PostPage = ({ post }: Props) => {
  const { data: session } = useSession();
  const [currentPost, setCurrentPost] = useState(post);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comment/${currentPost._id}`);
      const data = await response.json();

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
    <section className="feed">
      <PostView post={currentPost} handleDelete={handlePostDelete} />

      {session && (
        <CreateComment
          postId={currentPost._id}
          comments={currentPost.comments}
          fetchComments={fetchComments}
        />
      )}

      {comments.map((comment) => (
        <CommentCard
          key={comment._id}
          comment={comment}
          handleDelete={handleCommentDelete}
        />
      ))}
    </section>
  );
};

export default PostPage;
