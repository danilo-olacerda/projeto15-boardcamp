import joi from "joi";

const newCustomers = joi.object({
    name: joi.string().required(),
    phone: joi.string().regex(/^\d+$/).min(10).max(11).required(),
    cpf: joi.string().regex(/^\d+$/).min(11).max(11).required(),
    birthday: joi.date().required()
});

export default newCustomers;
