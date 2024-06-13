var userManagement = require("../project/service/management/service/userServices");
var newsManagement = require("../project/service/management/service/newsServices");
var mesManagement = require("../project/service/management/service/messageServices");
var middleware = require("../../helpers/middleware");

; module.exports = function (app) {

  var userPath = "/user";
  var adminPath = "/admin"
  var staffPath = "/staff";
  
  app.get("/", function (req, response) {
    response.status(200).json(new Date());
  })

  // app.get(path + "/setting/message", Setting_Message.onQuery);
  // app.post(path + "/setting/message", Setting_Message.onCreate);
  // app.put(path + "/setting/message", Setting_Message.onUpdate);
  // app.delete(path + "/setting/message", Setting_Message.onDelete); 

  // use to create admin for use only may be delete when add already
  app.post("/createAdmin", userManagement.createUserService);

  //verify role for frontend
  app.get("/verify", middleware.verify);

  // //========== all user can use ==========\\
  app.post("/login", userManagement.loginUserServices); //all user can login
  app.post("/register", userManagement.createUserService); //default role of register is "user", but if admin add staff must add role to "staff"
  app.get("/getUser/:id", userManagement.getUserServices); //get detail of each user

  // //========== login user can use ==========\\
  app.patch(userPath + "/updatePatch", middleware.verifyTokenAndRole("user"), userManagement.updateUserServices); //user update data itself use Patch

  // //========== staff can use ==========\\

  // //========== admin use only ==========\\
  app.get(adminPath + "/getsUser", middleware.verifyTokenAndRole("admin"), userManagement.getsUserServices); //admin get all or some user data [specific role]
  app.delete(adminPath + '/deleteUser/:id', middleware.verifyTokenAndRole("admin"), userManagement.deleteStaffServices);// admin delete staff
  app.patch(adminPath + "/updatePatch/:id", middleware.verifyTokenAndRole("admin"), userManagement.updateStaffServices);// admin update staff use Patch



  //message path post
  app.post("/mesRequest", mesManagement.createRequestService);
  //message path get
  app.get("/mesGetData", mesManagement.getRequestService);
  app.get("/mesGetReply/:id", mesManagement.getMessageReplyService);
  //message path patch
  app.patch('/mesReplyUpdate/:id', mesManagement.updateMessageReplyService);
  app.patch("/mesUpdate/:id", mesManagement.updateRequestService);
  //message path del
  app.delete("/mesDelete/:id", mesManagement.deleteRequestService);





  //
  //
  //   // end Package Marketplace
  //
  //   /*----- Catch 404 Error -----*/
  //   app.use(function (req, res) {
  //     res.status(404).json(resMsg.getMsg(40400));
  //   });
  //
  //   /*----- Catch 500 Error -----*/
  //   app.use(function (err, req, res) {
  //     res.status(501).json(resMsg.getMsg(50001));
  //   });

  // //New api dev
  // app.post("/addNews", middleware.upload.any(), newsManagement.addNewsServices);// add news and image
  // app.get("/getsNews", newsManagement.getsNewsServices);// get all news
  // app.get("/getNews/:id", newsManagement.getNewsServices);// get specific news via id
  // app.delete("/deleteNews/:id", middleware.deleteFile, newsManagement.deleteNewsServices);// delete specific news and delete image
};




