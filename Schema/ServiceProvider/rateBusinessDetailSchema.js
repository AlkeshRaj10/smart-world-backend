const { z } = require("zod");
const baseStringSchema = require("../common/baseStringSchema");


const rateServiceProviderSchema = z.object({
    businessId: baseStringSchema("businessId"),
    review: baseStringSchema("review").nullable().optional(),
    rating: z.coerce.number().min(1).max(5)
}).strict();


module.exports = rateServiceProviderSchema;
