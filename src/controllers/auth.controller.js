import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { httpResponse } from "../utils/index.js";
import { env } from "../config/env.js";
import { generateReferralCode } from "../config/generateCode.js";
import { ErrorCodesMeta } from "../constants/index.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return httpResponse.CONFLICT(
        res,
        {},
        ErrorCodesMeta.USER_ALREADY_EXISTS.message
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate referral code
    const referralCode = generateReferralCode();

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      referralCode,
      status: "registered",
    });

    // Create token
    const token = jwt.sign({ id: user.id }, env.jwtSecret, {
      expiresIn: "30d",
    });

    // Return user data without password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      referralCode: user.referralCode,
      status: user.status,
      createdAt: user.createdAt,
    };

    return httpResponse.CREATED(
      res,
      { user: userData, token },
      "User registered successfully"
    );
  } catch (error) {
    console.error("Registration error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return httpResponse.NOT_FOUND(
        res,
        {},
        ErrorCodesMeta.USER_NOT_EXISTS_WITH_THIS_EMAIL.message
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return httpResponse.UNAUTHORIZED(
        res,
        {},
        ErrorCodesMeta.YOUR_PASSWORD_IS_INCORRECT.message
      );
    }

    // Create token
    const token = jwt.sign({ id: user.id }, env.jwtSecret, {
      expiresIn: "30d",
    });

    // Return user data without password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      referralCode: user.referralCode,
      status: user.status,
      createdAt: user.createdAt,
    };

    return httpResponse.SUCCESS(
      res,
      { user: userData, token },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    // Return user data without password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      referralCode: user.referralCode,
      status: user.status,
      createdAt: user.createdAt,
    };

    return httpResponse.SUCCESS(
      res,
      { user: userData },
      "User profile retrieved successfully"
    );
  } catch (error) {
    console.error("Get profile error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};
