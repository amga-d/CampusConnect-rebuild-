import User from "../models/user.js"
import passport from "../config/passport.js"

export const signUp = async(req,res) => {
    const {body: {email,username,password}} = req;
    console.log(email,username)
    try {
        console.log("l")

        const user = new User({email,password,username})
        if(!user) throw new Error('error while Sign Up')
        await user.save()
        res.status(201).json({success: true})
    } catch (error) {
        res.status(400).json(error)   
    }
}