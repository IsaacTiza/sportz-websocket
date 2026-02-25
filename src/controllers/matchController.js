import Match from "../db/schema/matchSchema.js"
import APIFeatures from "../utils/apiFeatures.js";
import { AppError } from "./errorController.js";


export const createMatch = async (req, res) => {
    const { homeTeam, awayTeam, sport, startTime,endTime } = req.body;

    if (!homeTeam || !awayTeam || !sport || !startTime) {
        return new AppError('Missing required fields: homeTeam, awayTeam, sport, startTime', 400);
    }
    
    try {
        const newMatch = await Match.create({
            homeTeam,
            awayTeam,
            sport,
            startTime,
            endTime
        });
        if (res.app.locals.broadcastMatchCreated) {
            res.app.locals.broadcastMatchCreated(newMatch)
        }
        res.status(201).json({
            status: "success",
            data: newMatch
        });
    } catch (err) {
        return new AppError(err.message, 500);
    }
    
}

export const getMatches = async (req, res) => {
    console.log('Received query parameters:', req.query);
    const features = new APIFeatures(Match.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    try {
        const matches = await features.query;
        res.status(200).json({
            status: "success",
            results: matches.length,
            data: matches
        });
    } catch (err) {
        return new AppError(err.message, 500);
    }   
 }