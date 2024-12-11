import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      default: "Untitled Collection",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Collection ||
  mongoose.model("Collection", CollectionSchema);
