const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");
const baseNumberSchema = require("../../common/baseNumberSchema");

const createTeacherAddSchema = z
  .object({
    details: baseStringSchema("details"),
    minQualification: baseStringSchema("minQualification"),
    salaryPackage: baseNumberSchema("salaryPackage"),
    forClass: baseStringSchema("forClass"),
  })
  .strict();

module.exports = createTeacherAddSchema;
