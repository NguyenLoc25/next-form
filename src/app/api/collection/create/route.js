import dbConnect from "@/lib/mongodb"; // Connect to mongodb
import { checkAuth } from "@/lib/utils_server"; // Cần xác minh hàm checkAuth
import Collection from "@/models/Collection"; // Mongoose model
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const userId = checkAuth(req); // Kiểm tra userId
    console.log("User ID:", userId); // Log userId để kiểm tra
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { label = "Untitled Collection" } = await req.json();
    console.log("Label:", label); // Log label nhận được từ frontend

    const newCollection = await Collection.create({
      label,
      user: userId,
    });

    return NextResponse.json({
      success: true,
      collection: {
        _id: newCollection._id,
        label: newCollection.label,
      },
    });
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
