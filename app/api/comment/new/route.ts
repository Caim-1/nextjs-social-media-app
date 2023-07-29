import { connectToDB } from "@/utils/database";
import Comment from "@/models/comment";

export const POST = async (request: Request) => {
  const { userId, postId, text, image, timePosted, likes } =
    await request.json();

  try {
    await connectToDB();

    const newComment = new Comment({
      creator: userId,
      postId,
      text,
      image,
      timePosted,
      likes,
    });

    await newComment.save();

    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    return new Response("Failed to publish a new comment", { status: 500 });
  }
};
