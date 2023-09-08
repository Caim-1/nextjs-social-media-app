import Loading from "./Loading";
import PostCard from "./PostCard";
import LikedPosts from "./LikedPosts";
import ProfileBanner from "./ProfileBanner";
import { Tab } from "@headlessui/react";
import { Post, User } from "@/common.types";

type Props = {
  description: string;
  handleEdit?: Function;
  handleDelete?: Function;
  user?: User;
  posts: Array<Post>;
  likedPosts: Post[];
  fetchLikedPosts: Function;
};

const Profile = ({
  description,
  handleEdit,
  handleDelete,
  user,
  posts,
  likedPosts,
  fetchLikedPosts,
}: Props) => {
  return (
    <section className="profile">
      <ProfileBanner description={description} user={user} />

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            key="User Posts"
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 p-3 ${
                selected
                  ? "bg-white shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              }`
            }
          >
            User Posts
          </Tab>
          <Tab
            key="Liked Posts"
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 p-3 ${
                selected
                  ? "bg-white shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              }`
            }
          >
            Liked Posts
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <LikedPosts
              likedPosts={likedPosts}
              handleDelete={handleDelete}
              fetchLikedPosts={fetchLikedPosts}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  );
};

export default Profile;
