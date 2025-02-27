import passport from "passport";
import { Strategy } from "passport-local";
import User from "../models/user.js"


passport.use(new Strategy( {usernameField: 'email'}, async (email, password ,done)=>{
    try {
        const user = User.findOne((u) => u.email === email);
        if (!user) throw new Error ("User not found")
        if(user.password !== password) throw new Error ("Bad Credentials")
        done(null,user)
    }catch{(error)
        done(error, null)
    }
}))

passport.serializeUser((user,done)=> done(null,user.id))

passport.deserializeUser(async(id,done)=>{

        User.findById(id,(error,user)=>{
            if(error){
                return done(error)
            }
            return done(null,user)
        })
})

export default passport

