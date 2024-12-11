import mongoose, { Schema } from "mongoose";

const CollectionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    questions: [
        {
          type: Schema.Types.ObjectId,
          ref: "Question", // Reference the Question model
        },
      ],
});

export default mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);