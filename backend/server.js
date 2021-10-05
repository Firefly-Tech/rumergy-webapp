import express from "express";
import cors from "cors";
import mysql2 from "mysql2";
import { Sequelize } from "sequelize";
import rumergy from "./api/routes/rumergy.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rumergy", rumergy);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
