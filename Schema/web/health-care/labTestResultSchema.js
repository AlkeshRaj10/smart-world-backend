const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");
const baseNumberSchema = require("../../common/baseNumberSchema");

const labTestResultSchema = z
  .object({
    testId: baseStringSchema("testId"),
    patientName: baseStringSchema("patientId"),
    phoneNumber: baseStringSchema("phoneNumber"),
    // testDate:z.coerce.date(),
    patientAge: baseNumberSchema("patientAge"),
    gender: z.enum(["Male", "Female", "Other"]),
    comments: baseStringSchema("comments"),
    reportIssuedDate: z.coerce.date(),
    testCost: baseNumberSchema("testCost"),
  })
  .strict();

module.exports = labTestResultSchema;
