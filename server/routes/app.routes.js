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


  //============== all role can use ==============\\
  //message
  //new
  app.get("/getsNews", newsManagement.getsNewsServices);// get all news
  //research
  app.get("/getsResearch/:indust/:prop/:tech", researchManagement.getsResearchServices); //get all research
  app.get("/getResearch/:id", researchManagement.getResearchServices); //get specific research
  //user
  app.post("/login", userManagement.loginUserServices); //all user can login
  app.post("/register", userManagement.createUserService); //default role of register is "user", but if admin add staff must add role to "staff"
  //all role must login fitst
  app.get("/getUser", middleware.verifyTokenAndRole(["user", "staff", "admin"]), userManagement.getUserServices); //get detail of each user
  //================================================\\


  //============== login user can use ==============\\
  //message
  app.post(userPath + "/mesRequest", middleware.verifyTokenAndRole("user"), mesManagement.createRequestService); //user make request to staff
  //news
  //research
  //user
  app.patch(userPath + "/updatePatch", middleware.verifyTokenAndRole("user"), userManagement.updateUserServices); //user update data itself use Patch
  //================================================\\


  //================ staff can use =================\\
  //message
  //news
  app.post(staffPath + "/addNews", middleware.verifyTokenAndRole("staff"), middleware.upload.any(), newsManagement.addNewsServices);// add news and image
  app.get(staffPath + "/getNews/:id", middleware.verifyTokenAndRole("staff"), newsManagement.getNewsByIdService);// get specific news via id
  app.delete(staffPath + "/deleteNews/:model/:id", middleware.verifyTokenAndRole("staff"), middleware.deleteFileDynamic, newsManagement.deleteNewsServices);// delete specific news and delete image
  //research
  app.post(staffPath + "/addResearch", middleware.verifyTokenAndRole("staff"), middleware.upload.any(), researchManagement.addResearchServices);// add research and image
  app.delete(staffPath + "/deleteResearch/:model/:id", middleware.verifyTokenAndRole("staff"), middleware.deleteFileDynamic, researchManagement.deleteResearchServices);// delete specific research and delete image
  app.patch(staffPath + "/deleteFileResearch/:model/:id", middleware.verifyTokenAndRole("staff"), middleware.deleteFileSome, researchManagement.deleteFileResearchServices);
  app.patch(staffPath + "/addFileResearch/:id", middleware.verifyTokenAndRole("staff"), middleware.upload.any(), researchManagement.addFileResearchServices);
  app.patch(staffPath + "/updateResearchData/:id", middleware.verifyTokenAndRole("staff"), researchManagement.updateDataResearchServices);
  //user
  //================================================\\


  //================ admin use only ================\\
  //message
  //news
  //research
  //user
  app.get(adminPath + "/getsUser", middleware.verifyTokenAndRole("admin"), userManagement.getsUserServices); //admin get all or some user data [specific role]
  app.delete(adminPath + '/deleteUser/:id', middleware.verifyTokenAndRole("admin"), userManagement.deleteStaffServices);// admin delete staff
  app.patch(adminPath + "/updatePatch/:id", middleware.verifyTokenAndRole("admin"), userManagement.updateStaffServices);// admin update staff use Patch
  //================================================\\

  
  //========== login user and staff can use ==========\\
  //message
  app.get("/mesGetData", middleware.verifyTokenAndRole(["user", "staff"]), mesManagement.getRequestService);
  app.get("/mesDetail/:id", middleware.verifyTokenAndRole(["user", "staff"]), mesManagement.getMessageReplyService);
  app.patch('/mesReplyUpdate/:id', middleware.verifyTokenAndRole(["user", "staff"]), mesManagement.updateMessageReplyService);
  app.patch("/mesUpdate/:id", middleware.verifyTokenAndRole(["user", "staff"]), mesManagement.updateRequestService);
  app.delete("/mesDelete/:id", middleware.verifyTokenAndRole(["user", "staff"]), mesManagement.deleteRequestService);
  //news
  //research
  //user
  //================================================\\

  app.patch('/no', researchManagement.image)
};




