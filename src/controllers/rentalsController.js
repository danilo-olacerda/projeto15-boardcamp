import dayjs from "dayjs";
import client from "../db/db.js";

async function getRentals(req, res) {

    const { customerId } = req.query;
    const { gameId } = req.query;

    try {

        if (customerId) {

            let rentals = await client.query('SELECT * FROM rentals WHERE "customerId" = $1', [customerId]);
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
            return;

        } else if (gameId){

            let rentals = await client.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId]);
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
            return;

        }
        else {

            let rentals = await client.query("SELECT * FROM rentals");
            for (let rental of rentals.rows) {

                const { rows: customer } = await client.query("SELECT * FROM customers WHERE id = $1", [rental.customerId]);
                const { rows: game } = await client.query('SELECT * FROM games WHERE id = $1', [rental.gameId]);
                const categoryID = await game[0].categoryId;
                const { rows: category } = await client.query("SELECT * FROM categories WHERE id = $1", [categoryID]);

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
        }

    } catch (error) {

        res.status(409).send(error);

    }

}

async function createRental(req, res) {

    const newRental = res.locals.newRental;

    try {

        await client.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "originalPrice", "returnDate", "delayFee", "daysRented") VALUES ($1, $2, $3, $4, $5, $6, $7)`, [newRental.customerId, newRental.gameId, newRental.rentDate, newRental.originalPrice, newRental.returnDate, newRental.delayFee, newRental.daysRented]);
        res.sendStatus(201);

    } catch (error) {

        res.send(error);

    }
}

async function returnRental(req, res) {

    const rentalId = res.locals.rentalId;
    const returnDate = dayjs().format('YYYY-MM-DD');
    const rentDate = res.locals.rentDate;
    const daysRented = res.locals.daysRented;
    const pricePerDay = res.locals.pricePerDay.rows[0].pricePerDay;

    const days = dayjs(returnDate).valueOf() - dayjs(rentDate).valueOf();
    const delayFee = Math.round(days / 86400000) * pricePerDay;

    try {

        if (days > daysRented) {

            await client.query('UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3', [returnDate, delayFee, rentalId]);
            res.sendStatus(200);
            return;

        } else {

            await client.query('UPDATE rentals SET "returnDate" = $1 WHERE id = $2', [returnDate, rentalId]);
            res.sendStatus(200);
            return;

        }

    } catch (error) {

        res.send(error);

    }

}

async function deleteRental(req, res) {

    const rentId = req.params.id;
    const rentExists = await client.query('SELECT * FROM rentals WHERE id = $1', [rentId]);

    if (rentExists.rowCount === 0) {
        res.sendStatus(404);
        return;
    }

    if (!rentExists.rows[0].returnDate) {
        res.sendStatus(400);
        return;
    }

    try {

        await client.query('DELETE FROM rentals WHERE id = $1', [rentId]);
        res.sendStatus(200);
        return;

    } catch (error) {

        res.send(error);

    }
}


export { getRentals, createRental, returnRental, deleteRental };