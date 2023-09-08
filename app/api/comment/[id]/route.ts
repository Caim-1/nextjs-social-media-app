import { connectToDB } from "@/utils/database";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Comment from "@/models/comment";

export const GET = async (request: Request, { params }: Params) => {
  try {
    await connectToDB();

    const comments = await Comment.find({ postId: params.id }).populate(
      "creator"
    );

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all comments", { status: 500 });
  }
};

export const PATCH = async (request: Request, { params }: Params) => {
  const { likes } = await request.json();

  try {
    await connectToDB();

    // Find the post by ID and update it
    await Comment.findByIdAndUpdate(params.id, { likes: likes });

    return new Response("Comment updated successfully", { status: 200 });
  } catch (error) {
    return new Response("Error updating comment", { status: 500 });
  }
};

export const DELETE = async (request: Request, { params }: Params) => {
  try {
    await connectToDB();

    // Find the comment by ID and remove it
    await Comment.findByIdAndRemove(params.id);

    return new Response("Comment deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting comment", { status: 500 });
  }
};
