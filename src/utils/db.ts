import mongoose from 'mongoose'

const connectDB = async () => {
    if (mongoose.connections[0].readyState)
        return;
    await mongoose.connect("mongodb://localhost:27017/online-selling-app", {
        useNewUrlParser: true
    } as mongoose.ConnectOptions);
}


const disconnectDB = async () => {
    if (process.env.NODE_ENV === 'production') {
        await mongoose.connection.close();
    }
}

export { connectDB, disconnectDB };