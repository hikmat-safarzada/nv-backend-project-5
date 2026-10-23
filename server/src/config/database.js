const mongoose = require("mongoose");
const {config} = require("./config");

const dbConnection = async () => {
    const connection = await mongoose.connect(config.mongo_url.replace("<db_password>", config.mongo_pass));
    if(!connection){
        console.log("Connection failed")
    }
    console.log("Db connected successfully")
}

module.exports = {dbConnection}