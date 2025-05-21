const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    email:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    batch:{type:String, required:true},
})

const student = mongoose.model('Student', studentSchema);
module.exports = student;