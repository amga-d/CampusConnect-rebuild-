import { setUpProfile } from "../models/user.js";
import { matchedData, validationResult } from "express-validator";
import { ccResource } from "../config/gcConfig.js";
import { extname } from "path";

const saveProfileToGCS = async (file, id) => {
  return new Promise((resolve, reject) => {
    const blob = ccResource.file(
      `profiles/${id}/profile${extname(file.originalname)}`
    );
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
      predefinedAcl: "publicRead",
    });

    blobStream.on("error", (err) => {
      console.error("error uploading the image : " + err); // for development only
      reject(new Error("error uploading the image"));
    });

    blobStream.on("finish", () => {
      console.log("image uploaded successfully");
      const profileUrl =
        "https://storage.googleapis.com/" + ccResource.name + "/" + blob.name;
      resolve(profileUrl);
    });

    blobStream.end(file.buffer);
  });
};

// call this method after applying the upload middleware.
const setProfile = [
  // Then validate and process the request
  async (req, res, next) => {
    //
    if (!req.file) {
      return next(new Error("No file uploaded"));
    }

    try {
      const profileImage = await saveProfileToGCS(req.file, req.user.id);
      // Check validation results
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(result.array());
      }

      // Get validated data
      const data = matchedData(req, { includeOptionals: true });

      console.log(profileImage);
      // save the data to your database
      await setUpProfile(
        req.user.id,
        profileImage ? profileImage : null,
        data.birthdate,
        data.gender,
        data.bio
      );

      // For example:
      // await User.update({
      //   id: req.user.id,
      //   birthdate: data.birthdate,
      //   gender: data.gender,
      //   bio: data.bio,
      //   profileImage: profileImage ? path.basename(profileImage) : null
      // });

      return res.redirect("/");
    } catch (error) {
      return next(error);
    }
  },
];

export { setProfile };
