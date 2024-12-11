import User from "@/models/User";

export const findOrCreateUser = async ({ email, name }) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return existingUser;

    const newUser = new User({ email, name });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Lỗi khi tìm hoặc tạo người dùng:", error);
    throw new Error("Lỗi khi xử lý người dùng.");
  }
};
