import dbConnect from "@/lib/mongodb"; // Connect to mongodb
import Collection from "@/models/Collection"; // Mongoose model
import { NextResponse } from "next/server";


export async function GET(request) {
    await dbConnect();
    const collections = await Collection.find(); // Fetch all users
    return NextResponse.json(collections);
}

// get data with filter
export async function POST(request) {
    const body = await request.json();

}