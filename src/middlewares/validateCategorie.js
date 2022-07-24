import client from "../db/db.js";
import categoriesSchema from "../schemas/categoriesSchema.js";

export default async function validateCategorie(req, res, next){

    const { name } = req.body;
    const { error } = categoriesSchema.validate(req.body);
    const categorieExists = await client.query('SELECT * FROM categories WHERE name = $1', [name]);

    if (error){
        res.status(400).send(error);
        return;
    }
    if (categorieExists.rows[0]){
        res.status(409).send("Categoria já existente!");
        return;
    }

    res.locals.categorieName = name;

    next();

}