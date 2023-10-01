const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yashkr2005:yash1234@cluster0.1qxv8dk.mongodb.net/');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;