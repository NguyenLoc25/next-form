const mongoose = require('mongoose'); // Import mongoose
const { Schema } = mongoose; // Destructure Schema from mongoose
const { question_type } = require("./utils");

const QuestionSchema = new mongoose.Schema({
    collection_id: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    question_header: {
      type: String,
      required: true,
    },
    question_type: {
      type: String,
      required: true,
      enum: question_type,
    },
    question_required: {
      type: Boolean,
      default: false, // Set default value
    },
    // question_answer: [{
    //   type: String,
    //   unique: true, // Ensure unique answers
    // }],
  });
  
  export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
  