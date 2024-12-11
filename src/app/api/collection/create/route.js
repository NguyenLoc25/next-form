import dbConnect from "@/lib/mongodb"; // Connect to mongodb
import { checkAuth } from "@/lib/utils_server";
import Collection from "@/models/Collection"; // Mongoose model
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  try {
    const userId = checkAuth(req);
    if (userId){
      const { label = "Untitled Collection" } = await req.json();

      const newCollection = await Collection.create({
        label,
        user: userId,
      });

      return NextResponse.json({
        success: true,
        collectionId: newCollection._id,
      });
    }else{
      return NextResponse.json(
        { success: false, message: "UserID is missing in headers" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}