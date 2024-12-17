// import mongoose, { Schema } from "mongoose";
// import { question_type } from "./utils";

// const AnswerSchema = new mongoose.Schema({
//     collection_id:{
//         type: Schema.Types.ObjectId,
//         ref: "Collection",
//         required: true,
//     },
//     answer_value: [{
//         question_id:{
//             type: Schema.Types.ObjectId,
//             ref: "Question",
//         },
//         value: {
//             type: String,
//         }
//     }],
// });

// export default mongoose.models.Answer || mongoose.model("Answer", AnswerSchema);