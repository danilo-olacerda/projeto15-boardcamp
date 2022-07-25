import client from "../db/db.js";
import rentalSchema from "../schemas/rentalSchema.js";
import dayjs from "dayjs";

export default async function validateGame(req, res, next){

    let newRental = req.body;

    const { error } = rentalSchema.validate(newRental);

    if (error){
        res.status(400).send(error);
        return;
    }

    const userExist = await client.query("SELECT * FROM customers WHERE $1 = id", [newRental.customerId]);
    const gameExist = await client.query("SELECT * FROM games WHERE $1 = id", [newRental.gameId]);
    const gameIsAvailable = await client.query('SELECT * FROM rentals WHERE "gameId" = $1', [newRental.gameId]);
    
    if (userExist.rowCount === 0 || gameExist.rowCount === 0 || gameIsAvailable.rowCount >= gameExist.rows[0].stockTotal){
        
        res.sendStatus(400);
        return;
    }


    newRental = {
        ...newRental,
        rentDate: dayjs().format('YYYY-MM-DD'),
        originalPrice: gameExist.rows[0].pricePerDay * newRental.daysRented,
        returnDate: null,
        delayFee: null
    }

    res.locals.newRental = newRental;

    next();

}