import mongoose from "mongoose";
import { hashPassword } from "../config/hasher.js";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowerCase: [true, "Please enter a valid Email"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Minimum Password length is 8 characters"],
  },
  username: {
    type: String,
    required: true,
  },
});

// userSchema.pre('save',async function(next){
//     this.password = hashPassword(this.password)
//     next()
// })

const User = mongoose.model("User", userSchema);
export default User;
