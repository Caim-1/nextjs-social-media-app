"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { convertToBase64 } from "@/utils/utils";

import Link from "next/link";
import Image from "next/image";
import { RiCloseCircleFill } from "react-icons/ri";
import { BsFillFileEarmarkImageFill } from "react-icons/bs";

type Props = {
  fetchPosts: Function;
};

const CreatePost = ({ fetchPosts }: Props) => {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [image, setImage] = useState<any>("");
  const [submitting, setIsSubmitting] = useState(false);

  const createPost = async (e: React.MouseEvent) => {
    if (text === "" && image === "") {
      alert("Cannot publish an empty post");
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch("/api/post/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
          text: text,
          image: image,
          timePosted: new Date(),
          likes: [],
        }),
      });

      clearForm();
      fetchPosts();
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

  if (!session) {
    return <div></div>;
  }

  return (
    <div className="create_post rounded-2xl p-4">
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
        <label htmlFor="formId" className="hover:cursor-pointer">
          <input
            name=""
            type="file"
            id="formId"
            accept="image/*"
            hidden
            onChange={(e) => handleFileUpload(e)}
          />
          <BsFillFileEarmarkImageFill size={20} />
        </label>

        <button
          type="button"
          className="black_btn"
          onClick={createPost}
          disabled={submitting}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
