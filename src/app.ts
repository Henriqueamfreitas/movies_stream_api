import express, { Application, json, Request, Response } from "express";
import "dotenv/config"
import { insertQuery, readAllQuery } from "./logic"
import { startDataBase } from "./database";
import { ensureNoDuplicatesMiddleWare } from "./middlewares";

const app: Application = express()
app.use(json())

app.post('/movies', ensureNoDuplicatesMiddleWare ,insertQuery)
app.get('/movies', readAllQuery)

const PORT:string | undefined = process.env.PORT;
const runningMsg = `Server running on http://localhost:${PORT}`
app.listen(PORT, async () => {
    await startDataBase()
    console.log(runningMsg)
})
