// Import necessary modules
import dbConnect from "@/lib/mongodb"; // Kết nối MongoDB
import Question from "@/models/Question"; // Mongoose model cho Question
import SurveyResult from "@/models/Result"; // Mongoose model cho SurveyResult
import mongoose from "mongoose"; // Để kiểm tra tính hợp lệ của ObjectId
import { NextResponse } from "next/server";

// Xử lý phương thức POST
export async function POST(request) {
  const body = await request.json();
  const { collectionId, answers } = body;  // Sử dụng collectionId thay vì collectionId

  // Kiểm tra tính hợp lệ của dữ liệu đầu vào
  if (!collectionId || !answers || !Array.isArray(answers)) {
    return NextResponse.json({ error: "Dữ liệu không đầy đủ" }, { status: 400 });
  }

  try {
    await dbConnect();

    // Kiểm tra tính hợp lệ của collectionId
    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return NextResponse.json({ error: "Question ID không hợp lệ" }, { status: 400 });
    }

    // Kiểm tra xem question có tồn tại không
    const question = await Question.findById(collectionId);  // Tìm question dựa trên collectionId
    if (!question) {
      return NextResponse.json({ error: "Không tìm thấy question với ID này" }, { status: 404 });
    }

    // Lưu kết quả khảo sát
    const surveyResult = new SurveyResult({
      question: collectionId,  // Lưu collectionId thay vì collectionId
      answers: answers,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await surveyResult.save();

    return NextResponse.json(
      { message: "Dữ liệu đã được lưu thành công!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi lưu dữ liệu." },
      { status: 500 }
    );
  }
}

// Xử lý phương thức GET
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get("collectionId");  // Lấy collectionId từ query params

  try {
    await dbConnect();

    // Nếu có collectionId trong query, thực hiện kiểm tra
    if (collectionId) {
      if (!mongoose.Types.ObjectId.isValid(collectionId)) {
        return NextResponse.json({ error: "Question ID không hợp lệ" }, { status: 400 });
      }

      // Kiểm tra xem question có tồn tại không
      const question = await Question.findById(collectionId);  // Tìm question theo collectionId
      if (!question) {
        console.log("Không tìm thấy question với ID:", collectionId); // Log để kiểm tra
        return NextResponse.json({ error: "Không tìm thấy question với ID này" }, { status: 404 });
      }

      // Lấy kết quả khảo sát theo collectionId
      const surveyResults = await SurveyResult.find({ question: collectionId });  // Sử dụng collectionId thay vì collectionId

      return NextResponse.json({ surveyResults }, { status: 200 });
    } else {
      // Nếu không có collectionId, trả về tất cả kết quả khảo sát
      const surveyResults = await SurveyResult.find();

      return NextResponse.json({ surveyResults }, { status: 200 });
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi lấy dữ liệu." },
      { status: 500 }
    );
  }
}
