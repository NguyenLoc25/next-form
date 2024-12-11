import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Collection from "@/models/Collection";

// GET: Fetch a specific collection by ID
export async function GET(req, { params }) {
  const { id } = params;
  await dbConnect();

  try {
    const collection = await Collection.findById(id).populate("user");
    return NextResponse.json({ success: true, collection });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// PUT: Update a collection by ID
export async function PUT(req, { params }) {
  const { id } = params;
  await dbConnect();

  try {
    const userId = checkAuth(req);
    if (userId){
      const { label } = await req.json();
      const collection = await Collection.findById(id);

      if (!collection) {
        return NextResponse.json(
          { success: false, message: "Collection not found" },
          { status: 404 }
        );
      }
      if (collection.user.toString() !== userId) {
        return NextResponse.json(
          {
            success: false,
            message: "You do not have permission to update this collection",
          },
          { status: 403 }
        );
      }
      // Update the collection
      collection.label = label;
      await collection.save();

      return NextResponse.json({ success: true, collection: collection });
    }else{
      return NextResponse.json(
        { success: false, message: "UserID is missing in headers" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}