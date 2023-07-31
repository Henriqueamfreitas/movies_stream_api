import express, { Application, json, Request, Response } from "express";

const app: Application = express()

app.use(json())

const PORT:number = 3000
const runningMsg = `Server running on http://localhost:${PORT}`
app.listen(PORT, () => {
    console.log(runningMsg)
})