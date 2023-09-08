import Image from "next/image";
import { Dialog } from "@headlessui/react";
import CreateComment from "./CreateComment";
import { AiOutlineClose } from "react-icons/ai";
import { User } from "@/common.types";

type Props = {
  isOpen: boolean;
  setIsOpen: Function;
  postId: string;
  postUser: User;
  postImage: string;
  postCommentsIds: string[];
  agoTime: string;
};

const CommentDialog = ({
  isOpen,
  setIsOpen,
  postId,
  postUser,
  postImage,
  postCommentsIds,
  agoTime,
}: Props) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex-center">
        <Dialog.Panel className="dialog_panel">
          <div className="flex-between">
            <Dialog.Title className="font-semibold text-lg">
              Post your comment
            </Dialog.Title>
            <button type="button" onClick={() => setIsOpen(false)}>
              <AiOutlineClose size={20} />
            </button>
          </div>

          <div className="flex gap-3">
            <div className="flex-center">
              <Image
                src={postUser.image}
                alt="user profile picture"
                width={37}
                height={37}
                className="rounded-full"
              />
            </div>

            <div className="flex-col">
              <h3 className="font-semibold">{postUser.username}</h3>
              <p className="text-sm">{postUser.email}</p>
            </div>

            <span className="text-sm" style={{ marginLeft: "auto" }}>
              {`${agoTime} ago`}
            </span>
          </div>

          <img src={postImage} className="object-contain image_styles" />

          <hr />

          <CreateComment
            postId={postId}
            comments={postCommentsIds}
            setIsOpen={setIsOpen}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CommentDialog;
