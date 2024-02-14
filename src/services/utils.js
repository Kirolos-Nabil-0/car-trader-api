import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePasswords = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};

export { hashPassword, comparePasswords };
