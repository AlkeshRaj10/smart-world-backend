const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");
const baseNumberSchema = require("../../common/baseNumberSchema");

const completeHostelBusinessDetailSchema = z
  .object({
    hostelName: baseStringSchema("hostelName"),
    totalRooms: baseNumberSchema("totalRooms"),
    genderType: z.string(z.enum(["Male", "Female", "Co Ed"])),
    roomTypes: z.array(z.string()),
    services: z.array(z.string()),
  })
  .strict();

module.exports = completeHostelBusinessDetailSchema;
