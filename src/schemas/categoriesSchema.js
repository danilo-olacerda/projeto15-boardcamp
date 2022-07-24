import joi from "joi";

const newCategorie = joi.object({
    name: joi.string().required()
});

export default newCategorie;

