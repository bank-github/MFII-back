var userManagement = require("../project/service/management/service/userServices");
var mesManagement = require("../project/service/management/service/messageServices")

;module.exports = function (app) {

  var userPath = "/user";
  // var mesPath = "/message";
  // // user
  app.get("/",function (req,response){
    response.status(200).json(new Date());
  })

  // app.get(path + "/setting/message", Setting_Message.onQuery);
  // app.post(path + "/setting/message", Setting_Message.onCreate);
  // app.put(path + "/setting/message", Setting_Message.onUpdate);
  // app.delete(path + "/setting/message", Setting_Message.onDelete); 

  app.post(userPath + "/create", userManagement.createUserService);
  app.post(userPath + "/login", userManagement.longinUserServices);
  app.get(userPath + "/gets", userManagement.getUserServices);

  //message path
  app.post("/mesRequest", mesManagement.createRequestService);
  app.get("/mesGetData", mesManagement.getRequestService);
  app.get("/mesReply/:id", mesManagement.getMesService);
  app.patch("/mesUpdate/:id", mesManagement.updateRequestService);
  app.patch("/mesReplyUpdate/:id", mesManagement.updateMesService);
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
};




