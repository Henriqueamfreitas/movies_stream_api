import { QueryConfig } from "pg"
import { Movie, MovieCreate, MovieResult } from "./interfaces"
import { client } from "./database"
import { Request, Response } from "express"

const insertQuery = async (req: Request, res: Response): Promise<Response> => {
    const payload:MovieCreate = req.body
    
    const queryString: string = `
        INSERT INTO "movies" ("name", "category", "duration", "price")
        VALUES($1, $2, $3, $4)
        RETURNING *;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: Object.values(payload),
    }

    const queryResult: MovieResult = await client.query(queryConfig)
    const product: Movie = queryResult.rows[0]

    return res.status(201).json(product)
}

const readAllQuery = async (req: Request, res: Response): Promise<Response> => {    
    const queryString: string = `
        SELECT * FROM movies;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
    }

    const queryResult: MovieResult = await client.query(queryConfig)
    const movies: Movie[] = queryResult.rows

    return res.status(200).json(movies)
}

export { insertQuery, readAllQuery }
