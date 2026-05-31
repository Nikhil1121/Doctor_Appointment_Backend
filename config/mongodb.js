import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected ✅"))
        mongoose.connection.on('error', (err) => console.log("DB Error:", err))
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log("DB Connection Failed:", error.message)
        // Don't crash - just log
    }
}

export default connectDB