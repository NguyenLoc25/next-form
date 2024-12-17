import { NextResponse } from "next/server";
import Collection from "@/models/Collection";
import Question from "@/models/Question";
import dbConnect from "@/lib/mongodb";
import { checkAuth } from "@/lib/utils_server";

export async function GET(req, { params }) {
  try {
    const { id } = await params; // Awaiting the result of params
    console.log("Fetching collection with ID:", id); // Log ID
    
    await dbConnect();
    console.log("Database connected successfully");

    const collection = await Collection.findById(id)
      .populate("user")
      .populate("questions");
    console.log("Fetched collection:", collection); // Log collection data
    console.log("Questions:", collection.questions);

    return NextResponse.json({ success: true, collection });
  } catch (error) {
    console.error("Error fetching collection:", error.message); // Log error
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}



export async function PUT(req, { params }) {
  try {
  const { id } = params;
  console.log("Updating collection with ID:", id);

  await dbConnect();
  console.log("Database connected successfully");

    const userId = checkAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is missing" },
        { status: 400 }
      );
    }

    const { label, questions } = await req.json();
    console.log("Received data:", { label, questions });

    const collection = await Collection.findById(id);
    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 }
      );
    }

    if (collection.user.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: "Permission denied" },
        { status: 403 }
      );
    }

    // Cập nhật label
    collection.label = label || collection.label;

    // Xử lý câu hỏi (questions)
    const validQuestions = [];
    if (Array.isArray(questions)) {
      for (const question of questions) {
        if (question._id && mongoose.Types.ObjectId.isValid(question._id)) {
          // Cập nhật câu hỏi đã tồn tại
          const existingQuestion = await Question.findByIdAndUpdate(
            question._id,
            { ...question, collection_id: id },
            { new: true, upsert: true } // Tự động tạo mới nếu không tìm thấy
          );
          validQuestions.push(existingQuestion._id);
        } else {
          // Tạo câu hỏi mới
          const newQuestion = await Question.create({
            ...question,
            collection_id: id,
          });
          validQuestions.push(newQuestion._id);
        }
      }
    }
    

    // Gán danh sách câu hỏi mới
    collection.questions = validQuestions;

    // Lưu Collection
    await collection.save();
    console.log("Collection updated successfully:", collection);

    return NextResponse.json({ success: true, collection });
  } catch (error) {
    console.error("Error updating collection:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}