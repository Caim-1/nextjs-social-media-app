import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export const GET = async (request: Request, { params }: Params) => {
  try {
    await connectToDB();

    const user = await User.findById(params.id);

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch the user", { status: 500 });
  }
};
