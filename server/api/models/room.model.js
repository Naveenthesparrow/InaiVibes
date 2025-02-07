import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  password: {
    type: String,
    required: function () {
      return this.type === "private"
    },
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["host", "co-host", "member"],
        default: "member",
      },
      status: {
        type: String,
        enum: ["watching", "paused", "left"],
        default: "watching",
      },
    },
  ],
  currentVideo: {
    url: String,
    title: String,
    duration: Number,
    currentTime: {
      type: Number,
      default: 0,
    },
    isPlaying: {
      type: Boolean,
      default: false,
    },
  },
  playlist: [
    {
      url: String,
      title: String,
      duration: Number,
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Room", roomSchema)

