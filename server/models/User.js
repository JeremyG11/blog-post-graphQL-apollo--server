import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    role: {
      type: String,
      enum: ["reader", "admin", "author"],
      default: "reader",
    },
  },

  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
