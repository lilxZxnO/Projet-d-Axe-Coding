import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

class ProfileController {
  async getProfile(req, res) {
    const token = req.headers["x-access-token"];

    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, process.env.TOKEN_SECRET, async (error, decoded) => {
      if (error) return res.status(403).json({ error: "Forbidden" });

      try {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          include: { cards: { include: { card: true } } },
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });
  }
}

export default new ProfileController();
