import { Router } from "express";
import { createMatch, getMatches } from "../controllers/matchController.js";

export const matchesRouter = Router();  

matchesRouter.get("/", getMatches);
matchesRouter.post("/", createMatch)