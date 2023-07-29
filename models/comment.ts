import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
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
      type: [String],
    },
  },
  {
    versionKey: false,
  }
);

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
