// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://taimour448_db_user:taimour448@cluster0.ueyzhsi.mongodb.net/", {
           
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }
};

module.exports = connectDB;
