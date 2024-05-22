// hash password
import bcrypt from "bcrypt";

const saltRounds = 10;

const hashPassword = (password) => {
  return bcrypt.hash(password, saltRounds);
};

const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export { hashPassword, comparePassword };