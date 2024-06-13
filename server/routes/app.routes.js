var userManagement = require("../project/service/management/service/userServices");
var newsManagement = require("../project/service/management/service/newsServices");
var mesManagement = require("../project/service/management/service/messageServices");
var researchManagement = require("../project/service/management/service/researchServices")
var middleware = require("../../helpers/middleware");

; module.exports = function (app) {

  var userPath = "/user";
  var adminPath = "/admin"
  var staffPath = "/staff";

  app.get("/", function (req, response) {
    response.status(200).json(new Date());
  })

  // use to create admin for use only may be delete when add already
  app.post("/createAdmin", userManagement.createUserService);

  //verify role for frontend
  app.get("/verify", middleware.verify);

  // //========== all user can use ==========\\
  app.post("/login", userManagement.loginUserServices); //all user can login
  app.post("/register", userManagement.createUserService); //default role of register is "user", but if admin add staff must add role to "staff"
  app.get("/getUser/:id", userManagement.getUserServices); //get detail of each user
  app.get("/getsResearch", researchManagement.getsResearchServices); //get all research
  app.get("/getResearch/:id", researchManagement.getResearchServices); //get specific research

  app.post("/mesRequest", mesManagement.createRequestService);
  
  // //========== login user can use ==========\\
  app.patch(userPath + "/updatePatch", middleware.verifyTokenAndRole("user"), userManagement.updateUserServices); //user update data itself use Patch
  app.post(userPath + "/mesRequest", middleware.verifyTokenAndRole("user"), mesManagement.createRequestService); //user make request to staff

  // //========== staff can use ==========\\
  app.post(staffPath + "/addResearch", middleware.verifyTokenAndRole("staff"), middleware.upload.any(), researchManagement.addResearchServices);// add research and image
  app.delete(staffPath + "/deleteResearch/:model/:id", middleware.verifyTokenAndRole("staff"), middleware.deleteFileDynamic, researchManagement.deleteResearchServices);// delete specific research and delete image
  app.patch(staffPath + "/deleteFileResearch/:model/:id", middleware.verifyTokenAndRole("staff"), middleware.deleteFileSome, researchManagement.deleteFileResearchServices);
  app.patch(staffPath + "/addFileResearch/:id", middleware.verifyTokenAndRole("staff"), middleware.upload.any(), researchManagement.addFileResearchServices);
  app.patch(staffPath + "/updateResearchData/:id", middleware.verifyTokenAndRole("staff"), researchManagement.updateDataResearchServices);

  // //========== admin use only ==========\\
  app.get(adminPath + "/getsUser", middleware.verifyTokenAndRole("admin"), userManagement.getsUserServices); //admin get all or some user data [specific role]
  app.delete(adminPath + '/deleteUser/:id', middleware.verifyTokenAndRole("admin"), userManagement.deleteStaffServices);// admin delete staff
  app.patch(adminPath + "/updatePatch/:id", middleware.verifyTokenAndRole("admin"), userManagement.updateStaffServices);// admin update staff use Patch

  
  //message path get
  app.get("/mesGetData", mesManagement.getRequestService);
  app.get("/mesGetReply/:id", mesManagement.getMessageReplyService);
  //message path patch
  app.patch('/mesReplyUpdate/:id', mesManagement.updateMessageReplyService);
  app.patch("/mesUpdate/:id", mesManagement.updateRequestService);
  app.delete("/mesDelete/:id", mesManagement.deleteRequestService);

  // //New api dev
  // app.post("/addNews", middleware.upload.any(), newsManagement.addNewsServices);// add news and image
  // app.get("/getsNews", newsManagement.getsNewsServices);// get all news
  // app.get("/getNews/:id", newsManagement.getNewsServices);// get specific news via id
  // app.delete("/deleteNews/:id", middleware.deleteFile, newsManagement.deleteNewsServices);// delete specific news and delete image
};




