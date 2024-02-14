import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const saltRounds = process.env.SALT_ROUNDS;
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

console.log(await hashPassword("123456"));
