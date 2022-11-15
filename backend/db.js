const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://root:root@cluster0.usvr3ko.mongodb.net/test'


const connectToMongo = ()=>{
    mongoose.connect(mongoURI,() =>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo