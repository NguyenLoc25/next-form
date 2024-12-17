import { question_type } from "@/models/utils";
import { z } from "zod";

const questionTypeEnum = z.enum(question_type); // Replace with your specific types

const questionSchema = z.object({
  question_header: z.string().nonempty("Question header is required"),
  question_type: questionTypeEnum,
  question_required: z.boolean().optional(),
  // question_answer: z.array(z.string()).optional(),
});

const schema = z.object({
  label: z.string().nonempty("Label is required"),
  questions: z.array(questionSchema),
});

export default schema;