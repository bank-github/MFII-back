var userManagement = require("../project/service/management/service/userServices");
var middleware = require("../../helpers/middleware");

;module.exports = function (app) {

  var userPath = "/user";
  var adminPath = "/admin"
  // // user
  app.get("/",function (req,response){
    response.status(200).json(new Date());
  })

  // app.get(path + "/setting/message", Setting_Message.onQuery);
  // app.post(path + "/setting/message", Setting_Message.onCreate);
  // app.put(path + "/setting/message", Setting_Message.onUpdate);
  // app.delete(path + "/setting/message", Setting_Message.onDelete); 

  // use to create admin for use only may be delete when add already
  app.post("/createAdmin", userManagement.createUserService); 

  // all user can use
  app.post("/login", userManagement.longinUserServices);
  app.post("/register", userManagement.createUserService); //default role of register is "user"
  
  // admin only
  app.get(adminPath + "/getsUser", middleware.verifyTokenAndRole("admin"), userManagement.getUserServices);
  app.delete(adminPath + '/deleteUser/:id', middleware.verifyTokenAndRole("admin"), userManagement.deleteUserServices);
  app.patch(adminPath + "/updatePatch", middleware.verifyTokenAndRole("admin"), userManagement.updateUserPatchServices);
  app.put(adminPath + "/updatePut", middleware.verifyTokenAndRole("admin"), userManagement.updateUserPutServices);


  app.post('/upload',middleware.upload.array('files'), (req, res) => {
    res.send('Files uploaded successfully');
});

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




