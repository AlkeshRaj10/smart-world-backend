const {
  HealthCareDoctors,
  HealthCareLaboratoryTests,
  LabTestResult,
} = require("../../models");
const { BadRequestError } = require("../../utils/customErrors");
const { okResponse } = require("../../utils/responseHandlers");
const gpc = require("generate-pincode");

const addDoctor = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { doctorName, clinicTimings, category, days, fees } = req.body;
    const doctors = await HealthCareDoctors.create({
      userId: _id,
      doctorName,
      clinicTimings,
      category: category.toLowerCase(),
      days,
      fees: Number(fees),
    });
    return okResponse(res, 200, null, "Doctor Added Successfully");
  } catch (error) {
    console.log("Error in adding doctor");
    next(error);
  }
};

const getAllDoctors = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const doctors = await HealthCareDoctors.find({ userId: _id });
    return okResponse(res, 200, doctors, "Doctors Fetched Successfully");
  } catch (error) {
    console.log("Error in fetching error");
    next(error);
  }
};

const createLaboratoryTest = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { testFees, testName, sampleRequired, description } = req.body;
    const pin = gpc(4);
    await HealthCareLaboratoryTests.create({
      userId: _id,
      testFees: Number(testFees),
      testName,
      testCode: `LT-${pin}`,
      sampleRequired,
      description,
    });
    return okResponse(res, 200, null, "Laboratory Test Created Sucessfully");
  } catch (error) {
    console.log("Error in creating laboratory test");
    next(error);
  }
};

const getAllLaboratoryTest = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const data = await HealthCareLaboratoryTests.find({ userId: _id });
    return okResponse(
      res,
      200,
      data,
      "Successfully Fetched All Laboratory test"
    );
  } catch (error) {
    console.log("Error in getting laboratory test");
    next(error);
  }
};

const submitTestReport = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const {
      testId,
      patientName,
      phoneNumber,
      patientAge,
      gender,
      comments,
      reportIssuedDate,
      testCost,
    } = req.body;

    // Find the lab test based on testId and userId
    const labTest = await HealthCareLaboratoryTests.findOne({
      _id: testId,
      userId: _id,
    });

    if (!labTest) {
      throw new BadRequestError("Lab Test Not Found, Please Try Again");
    }

    // Create the LabTestResult record
    const report = await LabTestResult.create({
      patientName,
      patientAge: Number(patientAge),
      phoneNumber,
      gender,
      comments,
      reportIssuedDate: new Date(reportIssuedDate),
      testCost: Number(testCost),
    });

    labTest.tests.push(report._id);
    await labTest.save();

    return okResponse(res, 200, null, "Report Submitted Successfully");
  } catch (error) {
    console.log("Error in submitting test report", error);
    next(error);
  }
};

const getLabReports = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const reports = await HealthCareLaboratoryTests.find({
      userId: _id,
    })
      .select("testName")
      .populate({
        path: "tests",
        model: "LabTestResult",
        select:
          "patientName patientAge gender testCost comments resultImage reportIssuedDate",
      });

    let results = [];
    if (reports.length > 0) {
      for (const report of reports) {
        if (report.tests.length > 0) {
          for (const test of report.tests) {
            let data = {
              testName: report.testName,
              patientName: test.patientName,
              patientAge: test.patientAge,
              gender: test.gender,
              testCost: test.testCost,
              comments: test.comments,
              resultImage: test.resultImage,
              reportIssuedDate: test.reportIssuedDate,
            };
            results.push(data);
          }
        }
      }
      return okResponse(res, 200, results, "Lab Reports Fetched Successfully");
    } else {
      return okResponse(res, 200, [], "No Lab Reports Found");
    }
  } catch (error) {
    console.log("Error in getting lab reports", error);
    next(error);
  }
};

module.exports = {
  getLabReports,
  submitTestReport,
  addDoctor,
  getAllDoctors,
  createLaboratoryTest,
  getAllLaboratoryTest,
};
