const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participantIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    lastMessage: { type: String, trim: true },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

conversationSchema.index({ participantIds: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
