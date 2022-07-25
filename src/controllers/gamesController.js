import client from "../db/db.js";

async function getGames (_, res){

    try {
        
        const categories = await client.query(`
        SELECT games.*, categories.name AS "categoryName" 
        FROM games 
        JOIN categories 
        ON categories.id=games."categoryId"`);

        res.send(categories.rows);
        
    } catch (error) {

        res.send(error);
        
    }

}

async function createGame(req, res){

    const newGame = res.locals.newGame;

    try {

        await client.query(`INSERT INTO "games" (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`, [newGame.name, newGame.image, newGame.stockTotal, newGame.categoryId, newGame.pricePerDay]);

        res.sendStatus(201);
        
    } catch (error) {

        res.status(400);

    }

}

export { getGames, createGame };