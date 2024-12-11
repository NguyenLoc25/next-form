import Collection from "../models/Collection";

const createCollection = async (label, userId, questionIds = []) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      throw new Error("At least one question ID is required");
    }

    const newCollection = new Collection({
      label: label || "Untitled Collection",
      user: userId,
      questions: questionIds,
    });

    await newCollection.save();

    return newCollection;
  } catch (error) {
    console.error("Error creating collection:", error.message);
    throw new Error("Failed to create collection");
  }
};

export default createCollection;
