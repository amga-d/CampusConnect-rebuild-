import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filepath = path.join(__dirname, "..", "..", ".env");

dotenv.config({ path: filepath });

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || "development";
const mongUrl = process.env.MONG_URL;
const jwtSecret = process.env.JWT_SECRET;
const GC_SERVICE_ACCOUNT = process.env.GC_SERVICE_ACCOUNT;
const GC_BUCKET_NAME = process.env.GC_BUCKET_NAME;

export {
  port,
  nodeEnv,
  mongUrl,
  jwtSecret,
  GC_SERVICE_ACCOUNT,
  GC_BUCKET_NAME,
};
