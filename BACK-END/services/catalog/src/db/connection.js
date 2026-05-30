import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI não definida no .env");
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("[catalog] Mongo conectado");
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
