var userManagement = require("../project/service/management/service/userServices");
var middleware = require("../../helpers/middleware");

; module.exports = function (app) {

  var userPath = "/user";
  var adminPath = "/admin"
  var staffPath = "/staff";
  // // user
  app.get("/", function (req, response) {
    response.status(200).json(new Date());
  })

  // use to create admin for use only may be delete when add already
  app.post("/createAdmin", userManagement.createUserService);

  //========== all user can use ==========\\
  app.post("/login", userManagement.loginUserServices); //all user can login
  app.post("/register", userManagement.createUserService); //default role of register is "user", but if admin add staff must add role to "staff"

  //========== login user can use ==========\\
  app.patch(userPath + "/updatePatch", middleware.verifyTokenAndRole("user"), userManagement.updateUserServices); //user update data itself use Patch
  
  //========== staff can use ==========\\

  //========== admin use only ==========\\
  app.get(adminPath + "/getsUser", middleware.verifyTokenAndRole("admin"), userManagement.getsUserServices); //admin get all user data
  app.get(adminPath + "/getUser/:id", middleware.verifyTokenAndRole("admin"), userManagement.getUserServices); //admin get detail of each user
  app.delete(adminPath + '/deleteUser/:id', middleware.verifyTokenAndRole("admin"), userManagement.deleteStaffServices);// admin delete staff
  app.patch(adminPath + "/updatePatch/:id", middleware.verifyTokenAndRole("admin"), userManagement.updateStaffServices);// admin update staff use Patch
  



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
};




