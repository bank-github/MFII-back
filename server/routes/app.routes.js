var UserServices = require("../project/service/User/service/UserService");
var PlantServices = require("../project/service/Plant/service/PlantService");
var PictureServices = require("../project/service/Picture/service/PictureService");
var upload = require('../../config/upload');



; module.exports = function (app) {

  var pathUser = "/user";
  var pathAdmin = "/admin";

  // test start server
  app.get("/", function (req, response) {
    response.status(200).json(new Date());
  })

  // ================================================================
  // login for admin \\
  app.post("/login", UserServices.loginService);
  // create user admin \\
  app.post("/create-admin", UserServices.createAdminService);
  // ================================================================

  // ========================= User path ============================
  app.get(pathUser + "/get-plants", PlantServices.getPlantsService);
  app.get(pathUser + "/detail/:_id", PlantServices.getDetailService);
  // app.post(path + "/setting/message", UserServices.onCreate);
  // app.put(path + "/setting/message", UserServices.onUpdate);
  // app.delete(path + "/setting/message", UserServices.onDelete);
  // ================================================================

  // ========================= Admin path ===========================
  app.post(pathAdmin + "/add-plant", upload.any(), PlantServices.addPlantService);
  app.post(pathAdmin + "/get-plants", PlantServices.getPlantsService);
  // ================================================================




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




