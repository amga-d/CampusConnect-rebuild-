import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filepath = path.join(__dirname, "..", "..", ".env");

dotenv.config({ path: filepath });

export const port = process.env.PORT || 3000;
export const nodeEnv = process.env.NODE_ENV || "development";
export const mongUrl = process.env.MONG_URL;
export const jwtSecret = process.env.JWT_SECRET;
export default {
  port,
  nodeEnv,
  mongUrl,
  jwtSecret,
};
