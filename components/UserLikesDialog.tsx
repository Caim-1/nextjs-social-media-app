import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { AiOutlineClose } from "react-icons/ai";
import { User } from "@/common.types";

type Props = {
  isOpen: boolean;
  setIsOpen: Function;
  users: User[];
};

const UserLikesDialog = ({ isOpen, setIsOpen, users }: Props) => {
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
        <Dialog.Panel className="dialog_panel" style={{ minHeight: "500px" }}>
          <div className="flex-between">
            <Dialog.Title className="font-semibold text-lg">
              Liked by
            </Dialog.Title>
            <button type="button" onClick={() => setIsOpen(false)}>
              <AiOutlineClose size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {users.map((user) => (
              <div key={user._id} className="flex-center gap-3 mr-auto">
                <Image
                  src={user.image}
                  alt="user profile picture"
                  width={37}
                  height={37}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{user.username}</h3>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default UserLikesDialog;
