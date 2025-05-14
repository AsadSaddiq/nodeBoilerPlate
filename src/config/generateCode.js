import crypto from "crypto";

export const generateReferralCode = () => {
  return crypto.randomBytes(8).toString("hex").toUpperCase().slice(0, 8);
};
