"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { BsFillFileEarmarkImageFill } from "react-icons/bs";
import { RiCloseCircleFill } from "react-icons/ri";

type Props = {
  postId: string;
  fetchComments: Function;
};

const CreateComment = ({ postId, fetchComments }: Props) => {
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
      await fetch("/api/comment/new", {
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

      clearForm();
      fetchComments();
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

  const convertToBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
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

      {image && (
        <div className="flex relative my-3">
          <button
            type="button"
            className="absolute right-0 p-1"
            onClick={() => setImage("")}
          >
            <RiCloseCircleFill size={30} />
          </button>

          <img src={image} className="object-contain image_styles" />
        </div>
      )}

      <hr className="my-3 w-full" />

      <div className="flex-between w-full">
        <div>
          <label htmlFor="formId" className="hover:cursor-pointer">
            <input
              name=""
              type="file"
              id="formId"
              accept=".jpeg, .png, .jpg"
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

// const commentedPost = {
//   ...post,
//   comments: [
//     {
//       creator: session?.user.id,
//       text: text,
//       image: image,
//       timePosted: new Date(),
//       likes: [],
//     },
//     ...post.comments,
//   ],
// };

// await fetch(`/api/post/${post._id}`, {
//   method: "PATCH",
//   body: JSON.stringify({
//     comments: commentedPost.comments,
//     type: "comment",
//   }),
// });
