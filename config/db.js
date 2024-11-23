import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connceted To MonogoDB ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error in MongoDb ${err}`);
  }
};

export default connectDB;
