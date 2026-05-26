const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Room name is required"],
    trim: true,
    maxlength: [50, "Room name cannot exceed 50 characters"],
  },
  description: {
    type: String,
    default: "",
    maxlength: [200, "Description cannot exceed 200 characters"],
  },
  topic: {
    type: String,
    default: "general",
  },
  emoji: {
    type: String,
    default: "💬",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  inviteCode: {
    type: String,
    default: null,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Generate invite code for private rooms
roomSchema.pre("save", function (next) {
  if (this.isPrivate && !this.inviteCode) {
    this.inviteCode = uuidv4().split("-")[0].toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Room", roomSchema);
