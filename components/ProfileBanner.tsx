import { User } from "@/common.types";
import { useSession } from "next-auth/react";
import Image from "next/image";

type Props = {
  user?: User;
  description: string;
};

const ProfileBanner = ({ user, description }: Props) => {
  const { data: session } = useSession();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="post_card">
      <div className="flex gap-3">
        <div
          className="flex-center hover:cursor-pointer"
          onClick={handleProfileClick}
        >
          {(user || session) && (
            <Image
              src={user ? user.image : session?.user.image}
              width={74}
              height={74}
              className="rounded-full"
              alt="user profile picture"
            />
          )}
        </div>

        <div className="flex-col">
          <div className="hover:cursor-pointer" onClick={handleProfileClick}>
            <h3 className="font-semibold">
              {user ? user.username : session?.user.name}
            </h3>
          </div>
          <div>Profile description here</div>
        </div>
      </div>
      <hr className="my-3 w-full" />
    </div>
  );
};

export default ProfileBanner;
