import prisma from "../config/prisma.js";
import { compare, hashPassword } from "../config/hasher.js";

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: { id: true, password: true },
  });
  if (user) {
    if (await compare(password, user.password)) {
      return { id: user.id };
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

const setUpProfile = async (id, profileImage, brithdate, gender, bio) => {
  const user = await prisma.user.update({
    where: { id: id },
    data: {
      profile: {
        create: {
          gender: gender,
          imageUrl: profileImage,
          brithDate: new Date(brithdate),
          bio: bio,
        },
      },
    },
  });
  return user;
};

const getUserProfile = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: { profile: { select: { imageUrl: true } } },
  });
  return user;
};

// this method to deserialized User from the database for passport middleware
const deserializeUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: { id: true, name: true, profile: { select: { userId: true } } },
  });
  user.profile = user.profile !== null;
  return user;
};

export {
  getUserProfile,
  createUser,
  loginUser,
  deserializeUserById,
  setUpProfile,
};
