import { NextFunction, Request, Response, request } from "express"
import { QueryConfig } from "pg"
import { Movie, MovieResult } from "./interfaces"
import { client } from "./database"

const ensureNoDuplicatesMiddleWare = async (request: Request, response: Response, next: NextFunction) => {
    const queryString: string = `
        SELECT * FROM movies;
    `
    
    const queryConfig: QueryConfig = {
        text: queryString,
    }
    
    const queryResult: MovieResult = await client.query(queryConfig)
    const movies: Movie[] = queryResult.rows

    const movieWithSameName: Movie|undefined = movies.find(element => element.name === request.body.name)
    if(movieWithSameName !== undefined){
        return response.status(409).json({
            message: "Movie already registered."
        })
    }

    response.locals.movies = movies

    return next()
}

const ensureProductExistsMiddleWare = async(request: Request, response: Response, next: NextFunction) => {
    const id: string = request.params.id
    const queryString: string = `
        SELECT * FROM movies;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
    }

    const queryResult: MovieResult = await client.query(queryConfig)
    const movies: Movie[] = queryResult.rows

    const findIndexProduct: number = movies.findIndex(element => element.id === Number(id))

    if(findIndexProduct === -1) {
        return response.status(404).json({
            message: "Movie not found!"
        })
    }

    return next()
}  

export { ensureNoDuplicatesMiddleWare, ensureProductExistsMiddleWare }