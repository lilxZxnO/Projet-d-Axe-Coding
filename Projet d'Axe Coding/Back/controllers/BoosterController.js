import { prisma } from "../config/prisma.js";
import jwt from "jsonwebtoken";

class BoosterController {
  constructor() {
    this.openBooster = this.openBooster.bind(this);
    this.addRandomCards = this.addRandomCards.bind(this);
  }

  async openBooster(req, res) {
    try {
      const token = req.headers["x-access-token"];

      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      jwt.verify(token, process.env.TOKEN_SECRET, async (error, decoded) => {
        if (error) {
          return res.status(403).json({ error: "Forbidden" });
        }

        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          include: { cards: true },
        });

        const now = new Date();

        if (!user.isFirstBoosterOpened) {
          const newCards = await this.addRandomCards(user.id);

          await prisma.user.update({
            where: { id: user.id },
            data: {
              lastBoosterOpenedAt: now,
              isFirstBoosterOpened: true,
            },
          });

          return res.status(200).json(newCards);
        }

        const lastBoosterOpenedAt = new Date(user.lastBoosterOpenedAt);
        const timeDifference = now - lastBoosterOpenedAt;

        if (timeDifference < 24 * 60 * 60 * 1000) {
          return res.status(429).json({ error: "You can only open a booster once every 24 hours." });
        }

        const newCards = await this.addRandomCards(user.id);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastBoosterOpenedAt: now,
          },
        });

        res.status(200).json(newCards);
      });
    } catch (error) {
      console.error("Error opening booster:", error);
      res.status(500).json({ error: "An error occurred while opening the booster" });
    }
  }

  async addRandomCards(userId) {
    try {
      const response = await fetch('https://hp-api.lainocs.fr/characters');
      const characters = await response.json();

      const randomCharacters = this.shuffleArray(characters).slice(0, 5);

      const newCards = [];
      for (const character of randomCharacters) {
        const newCard = await prisma.cardUser.create({
          data: {
            user: {
              connect: { id: userId },
            },
            card: {
              connectOrCreate: {
                where: { slug: character.slug },
                create: {
                  name: character.name,
                  slug: character.slug,
                  house: character.house,
                  blood: character.blood,
                  role: character.role,
                  patronus: character.patronus,
                  gender: character.gender,
                  species: character.species,
                  wand: character.wand,
                  image: character.image,
                }
              }
            },
            cardSlug: character.slug,
          },
          include: {
            card: true,
          },
        });
        newCards.push(newCard.card);
      }

      // Renvoyer seulement les informations nécessaires pour l'affichage
      return newCards.map(card => ({
        name: card.name,
        slug: card.slug,
        house: card.house,
        blood: card.blood,
        role: card.role,
        patronus: card.patronus,
        gender: card.gender,
        species: card.species,
        wand: card.wand,
        image: card.image,
      }));
    } catch (error) {
      console.error('Error adding random cards:', error);
      throw error;
    }
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export default new BoosterController();
