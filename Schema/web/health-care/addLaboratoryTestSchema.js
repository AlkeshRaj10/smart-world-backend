const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");
const baseNumberSchema = require("../../common/baseNumberSchema");

const addLaboratoryTestSchema = z
  .object({
    testName: baseStringSchema("testName"),
    testFees: baseNumberSchema("testFees"),
    sampleRequired: z.enum([
      "Blood",
      "Urine",
      "Saliva",
      "Stool",
      "Sputum",
      "Swab",
      "Skin Scraping",
      "Tissue",
      "Cerebrospinal Fluid",
      "Amniotic Fluid",
      "Hair",
      "Nail Clipping",
      "Sweat",
      "Breath",
      "Semen",
    ]),
    description: baseStringSchema("description"),
  })
  .strict();

module.exports = addLaboratoryTestSchema;
