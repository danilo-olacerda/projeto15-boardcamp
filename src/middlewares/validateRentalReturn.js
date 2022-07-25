import client from "../db/db.js";

export default async function validateRentalReturn(req, res, next){

    const { id } = req.params;
    const rentExists = await client.query("SELECT * FROM rentals WHERE $1 = id", [id]);

    if (rentExists.rowCount === 0){
        res.sendStatus(404);
        return;
    }
    if (rentExists.rows[0].returnDate){
        res.sendStatus(400);
        return;
    }

    res.locals.rentalId = id;
    res.locals.rentDate = rentExists.rows[0].rentDate;
    res.locals.daysRented = rentExists.rows[0].daysRented;
    res.locals.pricePerDay = await client.query('SELECT "pricePerDay" FROM games WHERE $1 = id', [rentExists.rows[0].gameId]);

    next();
}