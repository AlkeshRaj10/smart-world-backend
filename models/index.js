const BussinessDetail = require("./bussinessDetailModel");
const OTP = require("./otpModel");
const User = require("./userModel");
const Session = require("./sessionModel");
const Adds = require("./addsModel");
const AddsMedia = require("./addsMediaModel");
const Class = require("./classModel");
const HealthCareDoctors = require("./healthCareDoctorModel");
const HealthCareLaboratoryTests = require("./healthCareLaboratoryModel");
const LabTestResult = require("./labTestReport");
const ForgotPasswordOTP = require("./forgotPasswordOtpSchema");
const ChatModel = require("./ChatModel");
const ChatMessageModel = require("./ChatMessageModel");
const ChatParticipantsModel = require("./ChatParticipantsModel");
const RatingModel = require("./ratingModel");

module.exports = {
  Adds,
  AddsMedia,
  BussinessDetail,
  Class,
  ForgotPasswordOTP,
  HealthCareDoctors,
  HealthCareLaboratoryTests,
  LabTestResult,
  OTP,
  Session,
  User,
  ChatModel,
  ChatMessageModel,
  ChatParticipantsModel,
  RatingModel
};
