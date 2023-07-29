import Post from "@/models/post";
import { connectToDB } from "@/utils/database";
import { NextApiRequest } from "next";

export const GET = async (request: Request, { params }: any) => {
  try {
    await connectToDB();

    const post = await Post.findById(params.id).populate("creator");

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch the post", { status: 500 });
  }
};

export const PATCH = async (request: Request, { params }: any) => {
  const { likes } = await request.json();

  try {
    await connectToDB();

    // Find the post by ID and update it
    await Post.findByIdAndUpdate(params.id, { likes: likes });

    return new Response("Post updated successfully", { status: 200 });
  } catch (error) {
    return new Response("Error updating post", { status: 500 });
  }
};

export const DELETE = async (request: Request, { params }: any) => {
  try {
    await connectToDB();

    // Find the post by ID and remove it
    await Post.findByIdAndRemove(params.id);

    return new Response("Post deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting post", { status: 500 });
  }
};
