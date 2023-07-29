import { connectToDB } from "@/utils/database";
import Comment from "@/models/comment";

export const GET = async (request: Request, { params }: any) => {
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

export const PATCH = async (request: Request, { params }: any) => {
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
