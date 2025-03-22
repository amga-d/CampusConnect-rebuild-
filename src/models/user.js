import mongoose from "mongoose";
import { compare, hashPassword } from "../config/hasher.js";
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

userSchema.pre("save", async function (next) {
  console.log(this.password);
  this.password = await hashPassword(this.password);
  console.log(this.password);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    console.log(password, user.password);
    const auth = await compare(password, user.password);
    if (auth) {
      return user;
    }
  }
  throw Error("Incorrect credentials");
};

const User = mongoose.model("User", userSchema);
export default User;
