var userManagement = require("../project/service/management/service/userServices");
var newsManagement = require("../project/service/management/service/newsServices");
var mesManagement = require("../project/service/management/service/messageServices");
var researchManagement = require("../project/service/management/service/researchServices");
var counterManagement = require("../project/service/management/service/counterServices");
var ipManagement = require("../project/service/management/service/ipServices");
var servicesManagement = require("../project/service/management/service/servicesServices");
var ragulationManagement = require("../project/service/management/service/regulationServices");
var docsManagement = require("../project/service/management/service/docsServices");
var middleware = require("../../helpers/middleware");

; module.exports = function (app) {

  var userPath = "/user";
  var adminPath = "/admin"
  var staffPath = "/staff";
  var api = "/api"

  app.get(api + "/", async function (req, response) {
    response.status(200).json(new Date());
  })

  
  app.get(api + '/getStatAll', counterManagement.getStatServices);
  app.get(api + '/getStatProduct', counterManagement.getProductServices);

  // use to create admin for use only may be delete when add already
  // app.post(api + "/createAdmin", userManagement.createUserService);


  //verify role for frontend
  app.get(api + "/verify", middleware.verify);


  //============== all role can use ==============\\
  //message
  //new
  app.get(api + "/getsNews", newsManagement.getsNewsServices);// get all news
  //research
  app.get(api + "/getsResearch/:indust/:prop/:tech/:descript", researchManagement.getsResearchServices); //get all research
  app.get(api + "/getResearch", researchManagement.getResearchServices); //get specific research
  //user
  app.post(api + "/login", userManagement.loginUserServices); //all user can login
  app.post(api + "/register", userManagement.createUserService); //default role of register is "user", but if admin add staff must add role to "staff"
  //all role must login fitst
  app.get(api + "/getUser", middleware.verifyTokenAndRole(["user", "staff", "admin"]), userManagement.getUserServices); //get detail of each user
  //================================================\\


  //============== login user can use ==============\\
  //message
  app.post(api + userPath + "/mesRequest", middleware.verifyTokenAndRole("user"), mesManagement.createRequestService); //user make request to staff
  //news
  //research
  //user
  app.patch(api + userPath + "/updatePatch", middleware.verifyTokenAndRole("user"), userManagement.updateUserServices); //user update data itself use Patch
  //================================================\\


  //================ staff can use (admin can use also) =================\\
  //message
  //news
  app.post(api + staffPath + "/addNews", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.upload.any(), newsManagement.addNewsServices);// add news and image
  app.get(api + staffPath + "/getNews/:id", middleware.verifyTokenAndRole(["staff", "admin"]), newsManagement.getNewsByIdService);// get specific news via id
  app.delete(api + staffPath + "/deleteNews/:model/:id", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.deleteFileDynamic, newsManagement.deleteNewsServices);// delete specific news and delete image
  //research
  app.post(api + staffPath + "/addResearch", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.upload.any(), researchManagement.addResearchServices);// add research and image
  app.delete(api + staffPath + "/deleteResearch/:model/:id", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.deleteFileDynamic, researchManagement.deleteResearchServices);// delete specific research and delete image
  app.patch(api + staffPath + "/deleteFileResearch/:model/:id", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.deleteFileSome, researchManagement.deleteFileResearchServices);
  app.patch(api + staffPath + "/addFileResearch/:id", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.upload.any(), researchManagement.addFileResearchServices);
  app.patch(api + staffPath + "/updateResearchData/:id", middleware.verifyTokenAndRole(["staff", "admin"]), researchManagement.updateDataResearchServices);
  //user
  //================================================\\


  //================ admin use only ================\\
  //message
  //news
  //research
  //user
  app.get(api + adminPath + "/getsUser", middleware.verifyTokenAndRole("admin"), userManagement.getsUserServices); //admin get all or some user data [specific role]
  app.delete(api + adminPath + '/deleteUser/:id', middleware.verifyTokenAndRole("admin"), userManagement.deleteStaffServices);// admin delete staff
  app.patch(api + adminPath + "/updatePatch/:id", middleware.verifyTokenAndRole("admin"), userManagement.updateStaffServices);// admin update staff use Patch
  //================================================\\


  //========== login all role can use ==========\\
  //message
  app.get(api + "/mesGetData", middleware.verifyTokenAndRole(["user", "staff", "admin"]), mesManagement.getRequestService);
  app.get(api + "/mesDetail/:id", middleware.verifyTokenAndRole(["user", "staff", "admin"]), mesManagement.getMessageReplyService);
  app.patch(api + '/mesReplyUpdate/:id', middleware.verifyTokenAndRole(["user", "staff", "admin"]), mesManagement.updateMessageReplyService);
  app.patch(api + "/mesUpdate/:id", middleware.verifyTokenAndRole(["user", "staff", "admin"]), mesManagement.updateRequestService);
  app.delete(api + "/mesDelete/:id", middleware.verifyTokenAndRole(["user", "staff", "admin"]), mesManagement.deleteRequestService);
  //news
  //research
  //user
  //================================================\\
  
  // csv download 
  app.get(api + '/download', middleware.verifyTokenAndRole("admin"),middleware.downloadCsv);

  //Phase 2 
  //============= all role can use =============\\
  //research 
  app.get(api + "/countResearch",researchManagement.countResearchServices);
  //ip
  app.get(api + "/countIP",ipManagement.countIPServices);
  app.get(api + "/getsIP/:ipType/:industType/:descript", ipManagement.getsIPServices); //get all ip
  app.get(api + "/getIP", ipManagement.getIPServices); //get specific ip
  // services
  app.get(api + "/getsServices/:servicesType/:servicesSubType", servicesManagement.getsServicesServices) // get all services
  app.get(api + "/getServices", servicesManagement.getServicesServices) //get specific services
  //regulation
  app.get(api + "/getRegulation", ragulationManagement.getRegulationServices) // get specific regulation
  app.get(api + "/getsRegulation", ragulationManagement.getsRegulationServices) // get all regulation
  //================================================\\

  //================ staff can use (admin can use also) =================\\
  // ip
  app.post(api + staffPath + "/addIP", middleware.verifyTokenAndRole(["staff", "admin"]), ipManagement.addIPServices);
  app.delete(api + staffPath + "/deleteIP/:id", middleware.verifyTokenAndRole(["staff", "admin"]), ipManagement.deleteIPServices);
  app.patch(api + staffPath + "/updateIPData/:id", middleware.verifyTokenAndRole(["staff", "admin"]), ipManagement.updateDataIPServices);
  // services
  app.post(api + staffPath + "/addServices", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.upload.any(), servicesManagement.addServicesServices) // add services
  app.delete(api + staffPath + "/deleteServices/:model/:id", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.deleteFileDynamic, servicesManagement.deleteServicesServices) //delete services
  app.patch(api + staffPath + "/deleteFileServices/:model/:id", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.deleteFileDynamic, servicesManagement.deleteFileServicesServices) //delete image file of services
  app.patch(api + staffPath + "/addFileServices/:model/:id", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.upload.any(), servicesManagement.addFileServicesServices) //add image file of services
  app.patch(api + staffPath + "/updateServicesData/:id", middleware.verifyTokenAndRole(["staff", "admin"]), servicesManagement.updateDataServicesServices) //update data of services
  //regulation
  app.post(api + staffPath + "/addRegulation", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.upload.any(), ragulationManagement.addRegulationServices) // add regulation
  app.delete(api + staffPath + "/deleteRegulation/:model/:id", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.deleteFileDynamic, ragulationManagement.deleteRegulationServices) //delete regulation
  app.patch(api + staffPath + "/deleteFileRegulation/:model/:id", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.deleteFileDynamic, ragulationManagement.deleteFileRegulationServices) //delete image file of regulation
  app.patch(api + staffPath + "/addFileRegulation/:model/:id", middleware.verifyTokenAndRole(["staff", "admin"]), middleware.upload.any(), ragulationManagement.addFileRegulationServices) //add image file of regulation
  app.patch(api + staffPath + "/updateRegulationData/:id", middleware.verifyTokenAndRole(["staff", "admin"]), ragulationManagement.updateDataRegulationServices) //update data of regulation
  //================================================\\

  app.post(api + "/addDocs", docsManagement.addDocsServices);// add doc
  app.get(api + "/getDocsAll", docsManagement.getsDocsServices);// get all docs
  app.get(api + "/getDocs/:id", docsManagement.getDocsByIdService);// get specific docs via id
  app.delete(api  + "/deleteDocs/:id", docsManagement.deleteDocsServices);// delete specific docs
  app.patch(api  + "/updateDocs/:id", docsManagement.updateDocsServices) //update data docs

  app.get(api + "/getIPFirstPage", ipManagement.firstPageIPServices);// get ip firstpage
};