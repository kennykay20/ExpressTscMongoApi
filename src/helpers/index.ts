import crypto from "crypto";

const SECRET = "EXPRESS-TSC-REST-API";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authenticationPassword = (salt: any, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};