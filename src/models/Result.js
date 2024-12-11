import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  collection_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
    required: true,
  },
  answers: {
    type: [String],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const SurveyResult = mongoose.models.SurveyResult || mongoose.model("SurveyResult", ResultSchema);

export default SurveyResult;
