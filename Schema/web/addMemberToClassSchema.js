const { z } = require("zod");
const baseStringSchema = require("../common/baseStringSchema");

const addMemberToClassSchema = z
  .object({
    classId: baseStringSchema("classId"),
    memberId: baseStringSchema("memberId"),
  })
  .strict();

module.exports = addMemberToClassSchema;
