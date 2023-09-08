import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format, parseISO, formatDistance } from "date-fns";

import Image from "next/image";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import {
  AiOutlineComment,
  AiOutlineSetting,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";

import { Post, User } from "@/common.types";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import UserLikesDialog from "./UserLikesDialog";

type Props = {
  post: Post;
  handleDelete?: Function;
};

const PostView = ({ post, handleDelete }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPost, setCurrentPost] = useState(post);
  const [postTime, setPostTime] = useState("");
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usersWhoLiked, setUsersWhoLiked] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    determinePost();
  }, []);

  const determinePost = () => {
    if (currentPost.likes.includes(session?.user.id)) setLiked(true); // Determine if the post is already liked by the user.

    setTotalLikes(currentPost.likes.length);

    // Format the time of when the post was created.
    const stringParsedToDate = parseISO(currentPost.timePosted);
    const dateOfCreation = format(stringParsedToDate, "h:mm aaa - d LLL y");

    setPostTime(dateOfCreation); // Hour and date of when the post was created.
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

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (currentPost.creator._id === session?.user.id) {
      return router.push("/profile");
    }

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleLikesClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (usersWhoLiked.length > 0) {
      return;
    }

    try {
      currentPost.likes.forEach(async (user) => {
        const response = await fetch(`/api/users/${user}`);
        const data = await response.json();
        setUsersWhoLiked((prev) => [data, ...prev]);
      });

      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="post_card">
      <div className="flex gap-3">
        <div
          className="flex-center hover:cursor-pointer"
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

        <div className="flex-col">
          <div className="hover:cursor-pointer" onClick={handleProfileClick}>
            <h3 className="font-semibold">{currentPost.creator.username}</h3>
          </div>
          <p className="text-sm">{currentPost.creator.email}</p>
        </div>

        {/* Post setting menu, signified by the cog icon */}
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

      <span className="text-sm">{postTime}</span>

      <hr />

      {/* General information about the post */}
      <div className="flex gap-5">
        <button type="button" onClick={handleLikesClick}>
          <span className="font-extrabold">{totalLikes}</span> Likes
        </button>
        <div>
          <span className="font-extrabold">{post.comments.length}</span>{" "}
          Comments
        </div>
      </div>

      <hr />

      <div className="flex-center gap-8">
        <button
          type="button"
          className="btn-like"
          onClick={handleLike}
          disabled={isSubmitting}
        >
          {liked ? (
            <AiFillHeart size={25} color="rgb(249 24 128)" />
          ) : (
            <AiOutlineHeart size={25} />
          )}
        </button>

        <button type="button" className="btn-comment">
          <AiOutlineComment size={25} />
        </button>
      </div>

      <UserLikesDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        users={usersWhoLiked}
      />
    </div>
  );
};

export default PostView;
