const dotenv = require("dotenv").config()
const express = require("express");
const app = require("./src/routes/app");
const { dbConnection } = require("./src/config/database");
const { config } = require("./src/config/config");

dbConnection();

app.listen(config.port, ()=>{
    console.log(`System works on ${config.port}`)
})