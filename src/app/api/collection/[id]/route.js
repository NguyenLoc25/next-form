import { NextResponse } from "next/server";
import Collection from "@/models/Collection";
import Question from "@/models/Question";
import dbConnect from "@/lib/mongodb";
import { checkAuth } from "@/lib/utils_server";

// GET: Fetch a specific collection by ID
export async function GET(req, { params }) {
  const { id } = await params;
  console.log("Fetching collection with ID:", id); // Log ID
  
  await dbConnect();
  console.log("Database connected successfully");

  try {
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

// PUT: Update a collection by ID
export async function PUT(req, { params }) {
  const { id } = await params;
  console.log("Updating collection with ID:", id); // Log ID
  
  await dbConnect();
  console.log("Database connected successfully");

  try {
    const userId = checkAuth(req);
    console.log("Authenticated user ID:", userId); // Log user ID

    if (userId) {
      const { label } = await req.json();
      console.log("Received new label:", label); // Log new label

      const collection = await Collection.findById(id);
      console.log("Fetched collection for update:", collection); // Log collection data

      if (!collection) {
        console.log("Collection not found for ID:", id);
        return NextResponse.json(
          { success: false, message: "Collection not found" },
          { status: 404 }
        );
      }
      if (collection.user.toString() !== userId) {
        console.log("Permission denied for user ID:", userId);
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
      console.log("Collection updated successfully:", collection); // Log updated collection
      console.log("Questions:", collection.questions);
      console.log("Questions IDs:", collection.questions.map(q => q._id));
      return NextResponse.json({ success: true, collection: collection });
    } else {
      console.log("Missing user ID in headers");
      return NextResponse.json(
        { success: false, message: "UserID is missing in headers" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating collection:", error.message); // Log error
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
