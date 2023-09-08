"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { convertToBase64 } from "@/utils/utils";

import Link from "next/link";
import Image from "next/image";
import { RiCloseCircleFill } from "react-icons/ri";
import { BsFillFileEarmarkImageFill } from "react-icons/bs";

type Props = {
  postId: string;
  comments: string[];
  fetchComments?: Function;
  setIsOpen?: Function;
};

const CreateComment = ({
  postId,
  comments,
  fetchComments,
  setIsOpen,
}: Props) => {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [image, setImage] = useState<any>("");
  const [submitting, setIsSubmitting] = useState(false);

  const createComment = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (text === "" && image === "") {
      alert("Cannot publish an empty comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comment/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
          postId: postId,
          text: text,
          image: image,
          timePosted: new Date(),
          likes: [],
        }),
      });

      const commentData = await response.json();
      const updatedComments = [commentData._id, ...comments];

      await fetch(`/api/post/${postId}`, {
        method: "PATCH",
        body: JSON.stringify({
          comments: updatedComments,
        }),
      });

      if (fetchComments) {
        clearForm();
        fetchComments();
      } else if (setIsOpen) {
        setIsOpen(false);
      }

      alert("Comment submitted successfully.");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setText("");
    setImage("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const base64 = await convertToBase64(file);

    setImage(base64);
  };

  return (
    <div className="create_post rounded-2xl p-4 w-full">
      <div className="flex gap-3 w-full">
        <Link href="/profile">
          <Image
            src={session?.user.image}
            width={37}
            height={37}
            className="rounded-full"
            alt="profile picture"
          />
        </Link>
        <textarea
          className="form_field-input"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
      </div>

      {/* Image preview */}
      {image && (
        <div className="flex relative my-3">
          <button
            type="button"
            className="absolute right-0 p-1"
            onClick={() => setImage("")}
          >
            <RiCloseCircleFill size={30} />
          </button>

          <Image
            src={image}
            width={200}
            height={200}
            className="object-contain image_styles"
            alt="preview upload image"
          />
        </div>
      )}

      <hr className="my-3 w-full" />

      <div className="flex-between w-full">
        <div>
          <label htmlFor="commentImageId" className="hover:cursor-pointer">
            <input
              name=""
              type="file"
              id="commentImageId"
              accept="image/*"
              hidden
              onChange={(e) => handleFileUpload(e)}
            />
            <BsFillFileEarmarkImageFill size={20} />
          </label>
        </div>
        <button
          type="button"
          className="black_btn"
          onClick={createComment}
          disabled={submitting}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default CreateComment;
