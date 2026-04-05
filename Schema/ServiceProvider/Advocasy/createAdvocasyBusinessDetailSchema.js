const { z } = require("zod");
const baseNumberSchema = require("../../common/baseNumberSchema");
const baseStringSchema = require("../../common/baseStringSchema");

const createAdvocasyBusinessDetailSchema = z
  .object({
    consultationFee: baseNumberSchema("consultationFee"),
    experienceYears: baseNumberSchema("experienceYears"),
    barCouncil: baseStringSchema("barCouncil"),
    categories: z.array(
      z.enum([
        "Criminal Law",
        "Family Law",
        "Corporate Law",
        "Civil Law",
        "Tax Law",
        "Immigration Law",
        "Labour & Employment Law",
        "Property & Real Estate",
        "Constitutional Law",
        "Intellectual Property Law",
        "Consumer Protection Law",
        "Banking & Finance Law",
        "Cyber Law",
        "Environmental Law",
        "Insurance Law",
        "Contract Law",
        "Human Rights Law",
        "Education Law",
        "Medical Malpractice",
      ])
    ),
  })
  

module.exports = createAdvocasyBusinessDetailSchema;
