import joi from "joi";

const newRental = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().min(1).required()
});

export default newRental;
