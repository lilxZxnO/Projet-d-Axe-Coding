import express from "express";
import AuthControllers from "../controllers/authenticationController.js";
import UsersController from "../controllers/UsersController.js";
import ProfileController from "../controllers/ProfileControllers.js";
import BoosterController from "../controllers/BoosterController.js";
import CardsController from "../controllers/CardsController.js"; // Nouveau contrôleur

const router = express.Router();

// API for users
router.post("/sign-up", AuthControllers.register);
router.post("/sign-in", AuthControllers.login);
router.post("/sign-out", AuthControllers.logout);

// get the user profile
router.get("/getProfile", ProfileController.getProfile);

// booster route
router.post("/open-booster", BoosterController.openBooster);

// cards routes
router.get("/all-cards", CardsController.getAllCards); // Nouvelle route pour obtenir toutes les cartes
router.get("/user-cards", CardsController.getUserCards); // Nouvelle route pour obtenir les cartes de l'utilisateur

export default router;
