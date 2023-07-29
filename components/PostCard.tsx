import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { format, parseISO, formatDistance } from "date-fns";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import {
  AiOutlineComment,
  AiOutlineSetting,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { Post } from "@/common.types";
import "react-tooltip/dist/react-tooltip.css";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

type Props = {
  post: Post;
  handleDelete?: Function;
};

const PostCard = ({ post, handleDelete }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPost, setCurrentPost] = useState(post);
  const [agoTime, setAgoTime] = useState("");
  const [postTime, setPostTime] = useState("");
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    determinePost();
  }, []);

  const determinePost = () => {
    if (currentPost.likes.includes(session?.user.id)) setLiked(true); // Determine if the post is already liked by the user.

    setTotalLikes(currentPost.likes.length);

    // Format the time of when the post was created.
    const stringParsedToDate = parseISO(currentPost.timePosted);
    const dateOfCreation = format(stringParsedToDate, "h:mm aaa - d LLL y");
    const distanceFromCreation = formatDistance(
      new Date(),
      stringParsedToDate,
      {
        includeSeconds: true,
      }
    );

    setPostTime(dateOfCreation); // Hour and date of when the post was created.
    setAgoTime(distanceFromCreation); // Specifices how long ago the post was published.
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session) {
      alert("You must be logged in to like posts.");
      return;
    }

    if (liked) {
      handleDislike();
      return;
    }

    setIsSubmitting(true);

    try {
      const likedPost = {
        ...currentPost,
        likes: [session.user.id, ...currentPost.likes],
      };

      await fetch(`/api/post/${currentPost._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          likes: likedPost.likes,
        }),
      });

      setLiked(true);
      setCurrentPost(likedPost);
      setTotalLikes((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDislike = async () => {
    setIsSubmitting(true);

    try {
      const dislikedPost = {
        ...currentPost,
        likes: currentPost.likes.filter(
          (element) => element !== session?.user.id
        ),
      };

      await fetch(`/api/post/${currentPost._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          likes: dislikedPost.likes,
        }),
      });

      setLiked(false);
      setCurrentPost(dislikedPost);
      setTotalLikes((prev) => prev - 1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostClick = () => {
    router.push(`/post/${post._id}`);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (currentPost.creator._id === session?.user.id) {
      return router.push("/profile");
    }

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  return (
    <div
      className="flex flex-col gap-3 post p-4 rounded-2xl w-full hover:cursor-pointer"
      onClick={handlePostClick}
    >
      <div className="flex gap-3">
        <div
          className="flex flex-center hover:cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image
            src={currentPost.creator.image}
            alt="user profile picture"
            width={37}
            height={37}
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col">
          <div className="hover:cursor-pointer" onClick={handleProfileClick}>
            <h3 className="font-semibold">{currentPost.creator.username}</h3>
          </div>
          <p className="text-sm">{currentPost.creator.email}</p>
        </div>

        <p
          data-tooltip-id={currentPost._id}
          className="text-sm"
          style={{ marginLeft: "auto" }}
        >
          {`${agoTime} ago`}
        </p>

        <div
          style={{ marginLeft: "auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Menu
            transition
            typeof="button"
            menuButton={
              <MenuButton className="btn-settings">
                <AiOutlineSetting size={20} />
              </MenuButton>
            }
          >
            <MenuItem onClick={() => console.log("Temp")}>Temporary</MenuItem>
            {currentPost.creator._id === session?.user.id && handleDelete && (
              <MenuItem onClick={() => handleDelete(currentPost)}>
                Delete
              </MenuItem>
            )}
          </Menu>
        </div>
      </div>

      <div className="text-sm">{currentPost.text}</div>

      <img src={currentPost.image} className="object-contain image_styles" />

      <hr />

      <div className="flex gap-3">
        <div className="flex-center gap-2">
          <button
            type="button"
            className="btn-like"
            onClick={handleLike}
            disabled={isSubmitting}
          >
            {liked ? (
              <AiFillHeart size={20} color="rgb(249 24 128)" />
            ) : (
              <AiOutlineHeart size={20} />
            )}
          </button>
          <div className="likes">{totalLikes}</div>
        </div>

        <div className="flex-center gap-2">
          <button
            type="button"
            className="btn-comment"
            onClick={handlePostClick}
            disabled={isSubmitting}
          >
            <AiOutlineComment size={20} />
          </button>
          <div className="comments">0</div>
        </div>
      </div>

      <Tooltip id={currentPost._id} place="bottom" content={postTime} />
    </div>
  );
};

export default PostCard;
