import { connectToDB } from "@/utils/database";
import Post from "@/models/post";

export const POST = async (request: Request) => {
  const { userId, text, image, timePosted, likes } = await request.json();

  try {
    await connectToDB();

    const newPost = new Post({
      creator: userId,
      text,
      image,
      timePosted,
      likes,
    });

    await newPost.save();

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    return new Response("Failed to publish a new post", { status: 500 });
  }
};
