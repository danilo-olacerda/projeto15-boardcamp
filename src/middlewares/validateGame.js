import client from "../db/db.js";
import gamesSchema from "../schemas/gamesSchema.js";

export default async function validateGame(req, res, next){

    const newGame = req.body;

    const { error } = gamesSchema.validate(newGame);
    const categorieExists = await client.query('SELECT * FROM categories WHERE id = $1', [newGame.categoryId]);
    const gamesExists = await client.query('SELECT * FROM games WHERE name = $1', [newGame.name]);

    if (categorieExists.rowCount===0 || error){
        res.status(400).send(error || "ID de categoria invalido!")
        return;
    }

    if (gamesExists.rows[0]){
        res.status(409).send("Nome de jogo indisponivel");
        return;
    }

    res.locals.newGame = newGame;

    next();

}