import User from "@/models/User";
import dbConnect from "./mongodb";

export async function findOrCreateUser({ email, name }) {
  // Ensure a database connection
  await dbConnect();

  // Check if the user already exists in the database
  let user = await User.findOne({ email });

  if (!user) {
    // Create a new user if not found
    user = new User({ email, name });
    await user.save();
  }

  // Return the user object
  return user;
}
