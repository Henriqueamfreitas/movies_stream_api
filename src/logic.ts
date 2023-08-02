import { QueryConfig } from "pg"
import { Movie, MovieCreate, MovieResult } from "./interfaces"
import { client } from "./database"
import { Request, Response } from "express"
import format from "pg-format"

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

const readEspecificQuery = async (req: Request, res: Response): Promise<Response> => {    
    const { body, params } = req

    const queryString: string = `
        SELECT * FROM movies
        WHERE id = $1;    
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [params.id]
    } 

    const queryResult: MovieResult = await client.query(queryConfig)
    const selectedMovie: Movie = queryResult.rows[0]

    return res.status(200).json(selectedMovie)
}

const deleteEspecificQuery = async (req: Request, res: Response): Promise<Response> => {    
    const { body, params } = req

    const queryString: string = `
        DELETE FROM movies
        WHERE id = $1;    
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [params.id]
    } 

    await client.query(queryConfig)

    return res.status(204).send()
}

const readEspecificCategoryQuery = async (req: Request, res: Response): Promise<Response> => {    
    const { query } = req

    if(!query.category){
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

    const queryString: string = `
        SELECT * FROM movies
        WHERE category = $1;    
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [query.category]
    } 

    const result: MovieResult = await client.query(queryConfig);
    const selectedMovies = result.rows;

    if(selectedMovies.length === 0){
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

    return res.status(200).json(selectedMovies);
}

const updateQuery = async (req: Request, res: Response): Promise<Response> => {
    const { body, params } = req

    const updateColumns:string[] = Object.keys(body)
    const updateValues:string[] = Object.values(body)

    const queryTemplate: string = `
        UPDATE "movies"
        SET (%I) = ROW (%L)
        WHERE id = $1
        RETURNING *;
    `

    const queryFormat: string = format(
        queryTemplate,
        updateColumns,
        updateValues
    )

    const queryConfig: QueryConfig = {
        text: queryFormat,
        values: [params.id]
    }
    
    const queryResult: MovieResult = await client.query(queryConfig)
    const updatedMovie: Movie = queryResult.rows[0]
    return res.status(200).json(updatedMovie)
}    


export { insertQuery, readEspecificQuery, deleteEspecificQuery, readEspecificCategoryQuery, updateQuery }
