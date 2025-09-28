// const mongoose = require('mongoose');

// let isConnected = false;



// const connectDB = async()=>{
//     try {
//         await mongoose.connect(process.env.MONGO_URL,{})
//         isConnected = true;
//         console.log("MongoDB connected successfully");
//     } catch (error) {
//         console.log(`Error in DB connection ${error}`);
//         // If there is an error in connecting to the database, exit the process with failure
//         process.exit(1);
//     }
// }

// module.exports = connectDB;