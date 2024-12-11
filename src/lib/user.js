import User from "@/models/User";
import dbConnect from "./mongodb";


export async function findOrCreateUser({ email, name }) {
  // Check if the user already exists in the database
  await dbConnect();
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    // Create a new user if not found
    const newUser = new User({ email, name });
    await newUser.save();
  }

  return;
}