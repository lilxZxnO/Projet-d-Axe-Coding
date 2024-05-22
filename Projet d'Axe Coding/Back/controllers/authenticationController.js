import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

class AuthControllers {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      const isSamePassword = await bcrypt.compare(password, user.password);
      if (!isSamePassword) return res.status(401).json({ error: "Invalid password" });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.TOKEN_SECRET,
        { expiresIn: "2h" }
      );

      res.json({ token });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  async register(req, res) {
    try {
      const { email, username, password } = req.body;
      const encryptedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, username, password: encryptedPassword },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.TOKEN_SECRET,
        { expiresIn: "2h" }
      );

      res.json({ token });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  async logout(req, res) {
    try {
      res.json({ message: "User logged out successfully" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e.message });
    }
  }
}

export default new AuthControllers();
