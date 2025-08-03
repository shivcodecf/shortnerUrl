import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const Signup = async(req,res)=>{
    try {

      const {name,email,password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }  

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });


        await newUser.save();

        res.status(201).json({message: "User created successfully"});
        
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}


export const Login = async(req,res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message: "User not found"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);


        if(!isPasswordValid) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.cookie('token', token, {httpOnly: true, secure: true});

        res.status(200).json({message: "Login successful", user});
        
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}





