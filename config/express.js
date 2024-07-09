/**
 * Created by atthapok on 24/06/2559.
 */
var cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require('uuid'); // สำหรับสร้าง session ID
var express = require("express");
var bodyParser = require("body-parser");
var nocache = require("nocache");
var nosniff = require("dont-sniff-mimetype");
var frameguard = require("frameguard");
var xssFilter = require("x-xss-protection");
// var csp = require("helmet-csp");
var ienoopen = require("ienoopen");
// var validator = require("express-validator");
var serveStatic = require("serve-static");
var compression = require("compression");
var morgan = require("morgan");
var sass = require("node-sass-middleware");
var path = require("path");
// const expressValidator = require('express-validator');

var initialize = require("../helpers/initialize");
const appRoutes = require('../server/routes/app.routes');
const homeroute = require("../server/routes/app.routes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var counterModel = require("../server/project/service/management/models/counterModel");
// var logger = require('../helpers/logger');

module.exports = function () {
  var app = express();

  initialize.init(function (status) {
    if (status) {
      app.use(bodyParser.json());
      app.use(bodyParser.json({ limit: "500mb", }));
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(compression());
      app.use(morgan("dev"));
      // app.use(expressValidator());
      app.disable("x-powered-by");
      app.use(ienoopen());
      app.use(nocache());
      app.use(nosniff());
      app.use(cookieParser());
      app.use(xssFilter());
      // app.use(validator());
      // app.use(csp({
      //     // Specify directives as normal.
      //     directives: {
      //       defaultSrc: ["'self'", "default.com"],
      //       scriptSrc: ["'self'", "'unsafe-inline'"],
      //       styleSrc: ["style.com"],
      //       imgSrc: ["img.com", "data:"],
      //       sandbox: ["allow-forms", "allow-scripts"],
      //       reportUri: "/report-violation",

      //       objectSrc: [], // An empty array allows nothing through
      //     },

      //     // Set to true if you only want browsers to report errors, not block them
      //     reportOnly: false,

      //     // Set to true if you want to blindly set all headers: Content-Security-Policy,
      //     // X-WebKit-CSP, and X-Content-Security-Policy.
      //     setAllHeaders: true,

      //     // Set to true if you want to disable CSP on Android where it can be buggy.
      //     disableAndroid: false,

      //     // Set to false if you want to completely disable any user-agent sniffing.
      //     // This may make the headers less compatible but it will be much faster.
      //     // This defaults to `true`.
      //     browserSniff: true,
      //   }));

      app.use('/api/uploads', express.static('uploads'));
      app.use(sass({ src: "./sass", dest: "./public/css", debug: true, outputStyle: "compressed", }));
      app.use(express.static(path.join(__dirname, "./public")));
      app.use(express.static(path.join(__dirname, "../node_modules/bootstrap/dist")));
      app.use(serveStatic("public", { index: ["index.html", "index.htm"] }));

      app.use(function (req, res, next) {
        //   app.use(function(req, res, next) {
        //     const origin = req.headers.origin;
        //     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers, X-Access-Token, X-Sid, X-Zid, company, projectid, projectkey, mobile, xid, version, platform, Api-Version");
        //     res.header("Access-Control-Allow-Credentials", true);
        //     if (req.method === "OPTIONS") {
        //         res.sendStatus(200);
        //     } else {
        //         next();
        //     }
        // });

        const allowedOrigins = ['http://localhost:8080'];
        const origin = req.headers.origin;

        if (allowedOrigins.includes(origin)) {
          res.header("Access-Control-Allow-Origin", origin);
        }
        console.log('Incoming request from origin:', origin);
        if (req.method === "OPTIONS") {
          var headers = {};
          // IE8 does not allow domains to be specified, just the *
          // // headers["Access-Control-Allow-Origin"] = req.headers.origin;
          // headers["Access-Control-Allow-Origin"] = "http://localhost8080";
          headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, PATCH, OPTIONS";
          headers["Access-Control-Allow-Credentials"] = true;
          headers["Access-Control-Max-Age"] = "86400"; // 24 hours
          headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization,Access-Control-Allow-Headers, X-Access-Token,X-Sid, X-Zid, company, projectid, projectkey, mobile, xid, version, platform, Api-Version";
          res.writeHead(200, headers);
          res.end();
        } else {
          // res.header["X-Frame-Options"] = "ALLOW-FROM http://localhost";
          // res.header("Access-Control-Allow-Origin", "http://localhost8080");
          res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, PATCH, OPTIONS");
          res.header("Access-Control-Allow-Credentials", true);
          res.header("Access-Control-Max-Age", "86400");
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization,Access-Control-Allow-Headers, X-Access-Token,X-Sid, X-Zid,, company, projectid, projectkey,mobile, xid, version, platform, Api-Version"
          );
          next();
        }
      });

      // counter visitor
      app.use(async function (request, response, next) {
        try {

          const sessionId = request.cookies.sessionId;
          const currentTime = new Date();
          let visit = await counterModel.findOne();

          if (!visit) {
            visit = new counterModel();
          }

          // ถ้าไม่มี sessionId ในคุกกี้ แสดงว่านี่เป็นการเข้าชมครั้งแรกในเซสชันนี้
          if (!sessionId) {
            // สร้าง sessionId ใหม่และตั้งค่าในคุกกี้
            const newSessionId = uuidv4();
            console.log(newSessionId);
            response.cookie('sessionId', newSessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // คุกกี้มีอายุ 1 วัน

            // เพิ่มจำนวนการเข้าชมทั้งหมด
            visit.totalAccess += 1;

            // อัปเดตการเข้าชมรายปี
            const currentYear = new Date().toISOString().slice(0, 4); // รูปแบบ YYYY
            visit.yearlyAccess.set(currentYear, (visit.yearlyAccess.get(currentYear) || 0) + 1);

            // อัปเดตการเข้าชมรายเดือน
            const currentMonth = new Date().toISOString().slice(0, 7); // รูปแบบ YYYY-MM
            visit.monthlyAccess.set(currentMonth, (visit.monthlyAccess.get(currentMonth) || 0) + 1);

            // อัปเดตการเข้าชมรายวัน
            const currentDay = new Date().toISOString().slice(0, 10); // รูปแบบ YYYY-MM-DD
            visit.dailyAccess.set(currentDay, (visit.dailyAccess.get(currentDay) || 0) + 1);

          }

          if (!visit.productSessionIds) {
            visit.productSessionIds = new Map();
          }

          // อัปเดตการเข้าชมของผลิตภัณฑ์ (สมมุติว่ามีการส่ง productId มาด้วย)
          const productId = request.query.researchId;
          if (productId) {
            const sessionIds = visit.productSessionIds.get(productId) || [];
            console.log("session ID => " + sessionIds);
            const sessionExits = sessionIds.some(entry => entry.sessionId == sessionId);
            console.log("session Exit => " + sessionExits);
            if(!sessionExits){
              visit.productAccess.set(productId, (visit.productAccess.get(productId) || 0) + 1);
              sessionIds.push({sessionId: sessionId, createdAt: currentTime});
              visit.productSessionIds.set(productId, sessionId);
            }
          }

          await visit.save();
          next();
        } catch (error) {
          console.error('Error tracking visit:', error);
          next(error);
        }
      });

      appRoutes(app);


    } else {
      // console.log(Error)
      // logger.error('----- Initialized database Status[Error] -----');
    }
  });


  return app;
};
