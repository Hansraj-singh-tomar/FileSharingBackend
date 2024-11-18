require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = async () => {
    // Database connection
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Listen to mongoose connection events
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to database");
});

mongoose.connection.on("error", (err) => {
    console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
});

// Gracefully close the Mongoose connection on process termination
const gracefulExit = () => {
    mongoose.connection.close(() => {
        console.log("Mongoose connection is disconnected due to app termination");
        process.exit(0);
    });
};

// Capture process termination or restart signals
process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

module.exports = connectDB;