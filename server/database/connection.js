import mongoose from "mongoose";

export default async() => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    return mongoose.connect(process.env.MONGO_URI, connectionParams);
}