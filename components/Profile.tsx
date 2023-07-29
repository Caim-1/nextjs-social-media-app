"use client";

import PostCard from "./PostCard";
import { Post } from "@/common.types";

type Props = {
  name: String | null;
  desc: String;
  handleEdit?: Function;
  handleDelete?: Function;
  posts: Array<Post>;
};

const Profile = ({ name, desc, handleEdit, handleDelete, posts }: Props) => {
  return (
    <section className="profile w-full my-10">
      <h1 className="text-left font-semibold">{name} Posts</h1>
      <p>{desc}</p>
      {posts &&
        posts.map((post) =>
          handleEdit && handleDelete ? (
            <PostCard key={post._id} post={post} handleDelete={handleDelete} />
          ) : (
            <PostCard key={post._id} post={post} />
          )
        )}
    </section>
  );
};

export default Profile;
