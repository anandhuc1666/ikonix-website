import { Router } from "express";
import { createYoutube, getYoutube } from "../controller/youtube.js";

const YoutubeRoute = Router();

YoutubeRoute.post("/createYoutube", createYoutube);
YoutubeRoute.get("/getYoutube", getYoutube);

export default YoutubeRoute;
