const Student = require('../models/studentModel');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const studentRegistrationEmailTemplate = require('../template/studentRegistrationEmail');


// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS // Your email password or app password
    }   
});


exports.postRegisterStudents=async(req,res,next)=>{
    try {
        const { name, email, batch } = req.body;
        // Check if the student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ info: "Student already registered" });
        }
        const student = new Student({
            name,
            email,
            batch
        });
        await student.save();
        // Send a confirmation email
        const mailOptions = {
            from: `MCA BY COCAS ${process.env.EMAIL_USER}`,
            to: email,
            subject: 'Registration Confirmation',
            html: studentRegistrationEmailTemplate(name)
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: "Failed to send confirmation email" });
            } else {
                console.log('Email sent:', info.response);
            }
        });
        res.status(201).json({ message: "Student registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to register student" });
    }
}

exports.getRegisterStudents=(req,res,next)=>{
    res.send("Get all students");
}