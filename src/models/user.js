// import mongoose from "mongoose";
// import { compare, hashPassword } from "../config/hasher.js";
// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowerCase: [true, "Please enter a valid Email"],
//   },
//   password: {
//     type: String,
//     required: true,
//     minLength: [8, "Minimum Password length is 8 characters"],
//   },
//   username: {
//     type: String,
//     required: true,
//   },
// });

// userSchema.pre("save", async function (next) {
//   console.log(this.password);
//   this.password = await hashPassword(this.password);
//   console.log(this.password);
//   next();
// });

// userSchema.statics.login = async function (email, password) {
//   const user = await this.findOne({ email });
//   if (user) {
//     console.log(password, user.password);
//     const auth = await compare(password, user.password);
//     if (auth) {
//       return user;
//     }
//   }
//   throw Error("Incorrect credentials");
// };

// const User = mongoose.model("User", userSchema);
// export default User;

import prisma from "../config/prisma.js";
import { compare, hashPassword } from "../config/hasher.js";

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: { id: true, password: true },
  });
  if (user) {
    if (await compare(password, user.password)) {
      return user.id;
    }
  }
  throw Error("Incorrect Credentials");
};

const createUser = async (name, email, password) => {
  const { id } = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: await hashPassword(password),
    },
    select: {
      id: true, // ✅ Return only the ID
    },
  });
  return id;
};

const findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  return user;
};

export { createUser, loginUser, findUserById };

// signUp("amgad2@gmail.com", "1234").catch((error) => {
//   if (error.code === "P2002") {
//     console.log("Email is already used");
//   }
// });
