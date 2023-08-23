const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    player: {
      type: mongoose.Types.ObjectId,
      ref: "Player",
    },
    room: {
      type: mongoose.Types.ObjectId,
      ref: "Room",
    },
    message: {
      type: String,
      required: true,
      required: "Comment is required",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
