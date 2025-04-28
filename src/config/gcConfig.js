import { GC_SERVICE_ACCOUNT, GC_BUCKET_NAME } from "./config.js";
import { Storage } from "@google-cloud/storage";

const credentials = JSON.parse(GC_SERVICE_ACCOUNT);
const storage = new Storage({
  credentials: credentials,
});

const bucketName = GC_BUCKET_NAME;
const ccResource = storage.bucket(bucketName);

export { ccResource };
