import mongoose from "mongoose";
// Schema
const userSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String
});
const User = mongoose.model("User", userSchema);
// Retrieve
export async function retrieveData() {
  const users = await User.find();
  return { users };
}
// Add  
export async function addItem(newItem) {
  return await User.create(newItem);
}
// Search
export async function searchData(query) {
  return await User.find({
    $or: [
      { nome: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } }
    ]
  });
}
// Update
export async function updateItem(email, updates) {
  const result = await User.updateOne(
    { email },
    { $set: updates }
  );
  return result.matchedCount > 0;
}