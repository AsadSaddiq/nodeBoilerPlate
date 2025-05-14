import bcrypt from "bcryptjs";
import { generateReferralCode } from "../config/generateCode.js";

export default {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    return queryInterface.bulkInsert("users", [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        referral_code: generateReferralCode(),
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        username: "user1",
        email: "user1@example.com",
        password: hashedPassword,
        role: "user",
        referral_code: generateReferralCode(),
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        username: "user2",
        email: "user2@example.com",
        password: hashedPassword,
        role: "user",
        referral_code: generateReferralCode(),
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
