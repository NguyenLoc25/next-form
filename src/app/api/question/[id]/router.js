// Import necessary modules
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";
import mongoose from "mongoose";
import Collection from "@/models/Collection";
import { NextResponse } from "next/server";

// GET /api/question/:id
// GET /api/question/:id
export async function GET(request, { params }) {
  const { id } = params;  // Không cần phải await

  console.log("Received ID: ", id);  // For debugging

  try {
    await dbConnect();

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Question ID" }, { status: 400 });
    }

    // Fetch the question by its ID, populate the collection reference
    const question = await Question.findById(id).populate("collection_id");

    // If the question isn't found, return a 404 response
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Return the found question as a JSON response
    return NextResponse.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// POST /api/question
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Tạo một câu hỏi mới từ dữ liệu request
    const newQuestion = await Question.create(body);

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}