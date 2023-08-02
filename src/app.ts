import express, { Application, json, Request, Response } from "express";
import "dotenv/config"
import { insertQuery, readEspecificQuery, deleteEspecificQuery, readEspecificCategoryQuery, updateQuery } from "./logic"
import { startDataBase } from "./database";
import { ensureNoDuplicatesMiddleWare, ensureProductExistsMiddleWare } from "./middlewares";

const app: Application = express()
app.use(json())

app.post('/movies', ensureNoDuplicatesMiddleWare ,insertQuery)
app.get('/movies/:id', ensureProductExistsMiddleWare, readEspecificQuery)
app.get('/movies', readEspecificCategoryQuery)
app.delete('/movies/:id', ensureProductExistsMiddleWare, deleteEspecificQuery)
app.patch('/movies/:id', ensureProductExistsMiddleWare, ensureNoDuplicatesMiddleWare, updateQuery)

const PORT:string | undefined = process.env.PORT;
const runningMsg = `Server running on http://localhost:${PORT}`
app.listen(PORT, async () => {
    await startDataBase()
    console.log(runningMsg)
})
