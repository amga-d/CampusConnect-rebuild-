import { requireProfile, authenticateJwt } from "../middlewares/homeMid.js";
import path from "path";
const renderHomePage = (req, res) => {
  console.log();
  const userProfile = path.join("uploads/users/profiles", req.user.profileUrl);

  res.render("home", { userProfile });
};

export const homeController = [authenticateJwt, requireProfile, renderHomePage];
