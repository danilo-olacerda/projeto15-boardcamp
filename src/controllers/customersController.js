import client from "../db/db.js";

async function getCustomers(req, res){

    const { cpf } = req.query;
    const { id } = req.params;

    try {
        
        if (cpf){

            const customers = await client.query('SELECT * FROM customers WHERE cpf=left($1, $2)', [cpf, cpf.lenght]);
            res.send(customers.rows);

        } else if (id){

            const customers = await client.query('SELECT * FROM customers WHERE id=$1', [id]);
            if (customers.rows[0]){
                res.send(customers.rows);
                return;
            }
            res.sendStatus(404);
            return;

        } else {

            const customers = await client.query('SELECT * FROM customers');
            res.send(customers.rows);

        }
        
    } catch (error) {

        res.send(error);
        
    }

}

async function createCustomer(req, res){

    const newCustomer = res.locals.newCustomer;

    try {

        await client.query(`INSERT INTO "customers" (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [newCustomer.name, newCustomer.phone, newCustomer.cpf, newCustomer.birthday]);
        res.sendStatus(201);

    } catch (error) {

        res.sendStatus(400);

    }
}

async function updateCustomer(req, res){
    res.send("Update")
}

export { getCustomers, createCustomer, updateCustomer };