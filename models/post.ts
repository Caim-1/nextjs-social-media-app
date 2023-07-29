import { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    timePosted: {
      type: Date,
    },
    likes: {
      type: [String], // Array of user ids, the number of likes is derived from the length of the array minus one (-1).
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    versionKey: false,
  }
);

const Post = models.Post || model("Post", PostSchema);

export default Post;
