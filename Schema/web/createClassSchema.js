const {z} = require("zod");
const baseStringSchema = require("../common/baseStringSchema");

const createClassSchema = z.object({
    classCode:baseStringSchema("classCode"),
    title:baseStringSchema("title"),
    description:baseStringSchema("description")
}).strict();


module.exports = createClassSchema;