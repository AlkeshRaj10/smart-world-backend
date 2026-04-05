const { User, Class } = require("../../models");
const { BadRequestError } = require("../../utils/customErrors");
const { okResponse, handleError } = require("../../utils/responseHandlers");

const addMembers = async (req, res, next) => {
  try {
    const { _id, members } = req.user;
    const { memberId } = req.body;
    if (members.includes(memberId)) {
      handleError(res, 400, null, "This member is already added");
    }
    await User.findByIdAndUpdate(
      _id,
      { $addToSet: { members: memberId } },
      { new: true }
    );
    okResponse(res, 200, null, "Member Added Successfully");
  } catch (error) {
    console.error("Error in adding member:", error);
    next(error);
  }
};

const getMembersToAdd = async (req, res, next) => {
  try {
    const { members } = req.user;
    const data = await User.find({
      role: "USER",
      isProfileCompleted: true,
      _id: { $nin: members },
    });

    okResponse(res, 200, data, "Members to be added fetched successfully");
  } catch (error) {
    console.error("Error in getting members:", error);
    next(error);
  }
};

const viewMyMembers = async (req, res, next) => {
  try {
    const { members } = req.user;
    const data = await User.find({
      _id: { $in: members },
    }).select("firstName lastName email _id profilePicture");
    okResponse(res, 200, data, "Members fetched successfully");
  } catch (error) {
    console.error("Error in viewing my members:", error);
    next(error);
  }
};

const createClass = async (req, res, next) => {
  try {
    const {_id} = req.user;
    const newClass = await Class.create({
      user:_id,
      ...req.body
    })
    okResponse(res,200,newClass,"Class Added Successfully");
  } catch (error) {
    console.log("error in creating class", error);
    next(error);
  }
};

const getMyClasses = async(req,res,next)=>{
  try{
    const {_id} = req.user;
    const classes = await Class.find({user:_id});
    return okResponse(res,200,classes,"Classes Fetched Successfully");
  }
  catch(error){
    console.log("Error in getting my clasess",error);
    next(error);
  }
}

const addMemberToClass = async (req, res, next) => {
  try {
    const { _id } = req.user; // Logged-in user's ID
    const { classId, memberId } = req.body; // classId and memberId from the request body
    
    // Find the class where the user is the owner
    const myClass = await Class.findOne({ user: _id, _id: classId });
    
    if (!myClass) {
      throw new BadRequestError("Class Not Found or You are not the owner of the class");
    }

    // Check if the member is already added to the class
    if (myClass.members.includes(memberId)) {
      throw new BadRequestError("This user is already a member of the class");
    }

    // Add the memberId to the members array
    myClass.members.push(memberId);

    // Save the updated class document
    await myClass.save();

    // Send a success response
    okResponse(res, 200, myClass, "Member added to class successfully");

  } catch (error) {
    console.log("Error in adding members to class", error);
    next(error);
  }
};


module.exports = {
  getMembersToAdd,
  addMembers,
  viewMyMembers,
  createClass,
  getMyClasses,
  addMemberToClass
};
