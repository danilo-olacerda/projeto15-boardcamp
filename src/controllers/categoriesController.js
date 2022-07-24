import client from "../db/db.js";

async function getCategories(req, res){

    try {
        
        const categories = await client.query('SELECT * FROM categories;');

        res.send(categories.rows);
        
    } catch (error) {

        res.send(error);
        
    }

}

async function createCategories (req, res) {

    const categorieName = res.locals.categorieName;

    try {
        
        await client.query(`INSERT INTO categories (name) VALUES ($1);`, [categorieName]);

        res.sendStatus(201);

    } catch (error) {
        res.send(error)
    }
}
export { getCategories , createCategories };