const {z} = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");


const addMemberSchema = z.object({
    memberId:baseStringSchema("memberId")
}).strict();

module.exports = addMemberSchema;