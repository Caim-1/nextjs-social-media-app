import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { format, parseISO, formatDistance } from "date-fns";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { AiOutlineSetting, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Comment } from "@/common.types";
import "react-tooltip/dist/react-tooltip.css";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

type Props = {
  comment: Comment;
  handleDelete: Function;
};

const CommentCard = ({ comment, handleDelete }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentComment, setCurrentComment] = useState(comment);
  const [agoTime, setAgoTime] = useState("");
  const [postTime, setPostTime] = useState("");
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    determineComment();
  }, []);

  const determineComment = () => {
    // Determine if the post is already liked by the user.
    if (currentComment.likes.includes(session?.user.id)) setLiked(true);

    setTotalLikes(currentComment.likes.length);

    // Format the time of when the post was created.
    const stringParsedToDate = parseISO(currentComment.timePosted);
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
      const likedComment = {
        ...currentComment,
        likes: [session.user.id, ...currentComment.likes],
      };

      await fetch(`/api/comment/${currentComment._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          likes: likedComment.likes,
        }),
      });

      setLiked(true);
      setTotalLikes((prev) => prev + 1);
      setCurrentComment(likedComment);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDislike = async () => {
    setIsSubmitting(true);

    try {
      const dislikedComment = {
        ...currentComment,
        likes: currentComment.likes.filter(
          (element) => element !== session?.user.id
        ),
      };

      await fetch(`/api/comment/${currentComment._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          likes: dislikedComment.likes,
        }),
      });

      setLiked(false);
      setTotalLikes((prev) => prev - 1);
      setCurrentComment(dislikedComment);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (currentComment.creator._id === session?.user.id) {
      return router.push("/profile");
    }

    router.push(
      `/profile/${currentComment.creator._id}?name=${currentComment.creator.username}`
    );
  };

  return (
    <div className="post_card">
      <div className="flex gap-3">
        <div
          className="flex flex-center hover:cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image
            src={currentComment.creator.image}
            alt="user profile picture"
            width={37}
            height={37}
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col">
          <div className="hover:cursor-pointer" onClick={handleProfileClick}>
            <h3 className="font-semibold">{currentComment.creator.username}</h3>
          </div>
          <p className="text-sm">{currentComment.creator.email}</p>
        </div>

        <p
          data-tooltip-id={currentComment._id}
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
            {currentComment.creator._id === session?.user.id &&
              handleDelete && (
                <MenuItem onClick={() => handleDelete(currentComment)}>
                  Delete
                </MenuItem>
              )}
          </Menu>
        </div>
      </div>

      <div className="text-sm">{currentComment.text}</div>

      <img src={currentComment.image} className="object-contain image_styles" />

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
      </div>

      <Tooltip id={currentComment._id} place="bottom" content={postTime} />
    </div>
  );
};

export default CommentCard;
