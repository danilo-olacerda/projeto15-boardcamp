import client from "../db/db.js";

async function getRentals (_, res){

    try {

        let rentals = await client.query("SELECT * FROM rentals");
        for (let rental of rentals.rows) {

            const { rows: customer } = await client.query("SELECT * FROM customers WHERE id = $1", [rental.customerId]);
            const { rows: game } = await client.query('SELECT * FROM games WHERE id = $1', [rental.gameId]);
            const categoryID = await game[0].categoryId;
            const { rows: category } = await client.query("SELECT * FROM categories WHERE id = $1", [categoryID]);
            

            console.log("customer", customer[0]);
            console.log("game", game);

            rental.customer = {
                id: customer[0].id,
                name: customer[0].name
            }

            rental.game = {
                id: game[0].id,
                name: game[0].name,
                categoryId: game[0].categoryId,
                categoryName: category[0].name
            }
            
        }
        res.send(rentals.rows);
        
    } catch (error) {

        res.status(409).send(error);
        
    }

}

async function createRental(req, res){

    const newRental = res.locals.newRental;

    try {
        
        await client.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "originalPrice", "returnDate", "delayFee", "daysRented") VALUES ($1, $2, $3, $4, $5, $6, $7)`, [newRental.customerId, newRental.gameId, newRental.rentDate, newRental.originalPrice, newRental.returnDate, newRental.delayFee, newRental.daysRented]);
        res.sendStatus(201);

    } catch (error) {
        
        res.send(error);
        
    }
}


export { getRentals, createRental };