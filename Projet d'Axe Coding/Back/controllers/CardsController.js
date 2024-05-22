import { prisma } from "../config/prisma.js";
import jwt from "jsonwebtoken";

class CardsController {
    // Obtenir toutes les cartes
    async getAllCards(req, res) {
        try {
            const cards = await prisma.card.findMany();
            return res.status(200).json(cards);
        } catch (error) {
            console.error("Error getting all cards:", error);
            return res.status(500).json({ error: "An error occurred while getting all cards" });
        }
    }

    // Obtenir les cartes de l'utilisateur
    async getUserCards(req, res) {
        const token = req.headers["x-access-token"];

        if (!token) return res.status(401).json({ error: "No token provided" });

        jwt.verify(token, process.env.TOKEN_SECRET, async (error, decoded) => {
            if (error) return res.status(403).json({ error: "Forbidden" });

            try {
                const userCards = await prisma.cardUser.findMany({
                    where: { userId: decoded.id },
                    include: { card: true },
                });

                if (!userCards) return res.status(404).json({ error: "No cards found for this user" });

                const cards = userCards.map(cardUser => cardUser.card);
                return res.status(200).json(cards);
            } catch (e) {
                console.error("Error getting user cards:", e);
                return res.status(500).json({ error: "An error occurred while getting user cards" });
            }
        });
    }
}

export default new CardsController();
