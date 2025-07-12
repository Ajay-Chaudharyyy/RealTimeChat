const mongoose = require("mongoose");

const connectDb = async()=>{

        await mongoose.connect(process.env.DB_URL).then(()=>console.log("Database Connected Successfully")).catch((err)=>console.log("There is some error ",err.message));
}

module.exports = connectDb;