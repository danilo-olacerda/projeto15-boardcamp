import client from "../db/db.js";
import customersSchema from "../schemas/customersSchema.js"

export default async function validateCustomer(req, res, next){

    const newCustomer = req.body;

    const { error } = customersSchema.validate(newCustomer);
    const customerExists = await client.query('SELECT * FROM customers WHERE cpf = $1', [newCustomer.cpf]);


    if (customerExists.rows.length!==0 || error){

        res.status(400).send(error || "CPF já está sendo utilizado");
        return;
        
    }

    res.locals.newCustomer = newCustomer;

    next();

}