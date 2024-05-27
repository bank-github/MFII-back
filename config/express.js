/**
 * Created by atthapok on 24/06/2559.
 */
var cookieParser = require("cookie-parser");
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
const homeroute = require("../server/routes/app.routes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
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

      app.use(sass({src: "./sass", dest: "./public/css", debug: true, outputStyle: "compressed",}));
      app.use(express.static(path.join(__dirname, "./public")));
      app.use(express.static(path.join(__dirname, "../node_modules/bootstrap/dist")));
      app.use(serveStatic("public", { index: ["index.html", "index.htm"] }));
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

      app.use(function (req, res, next) {
        if (req.method === "OPTIONS") {
          var headers = {};
          // IE8 does not allow domains to be specified, just the *
          // headers["Access-Control-Allow-Origin"] = req.headers.origin;
          headers["Access-Control-Allow-Origin"] = "*";
          headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
          headers["Access-Control-Allow-Credentials"] = false;
          headers["Access-Control-Max-Age"] = "86400"; // 24 hours
          headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization,Access-Control-Allow-Headers, X-Access-Token,X-Sid, X-Zid, company, projectid, projectkey, mobile, xid, version, platform, Api-Version";
          res.writeHead(200, headers);
          res.end();
        } else {
          // res.header["X-Frame-Options"] = "ALLOW-FROM http://localhost";
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization,Access-Control-Allow-Headers, X-Access-Token,X-Sid, X-Zid,, company, projectid, projectkey,mobile, xid, version, platform, Api-Version"
          );
          next();
        }
      });

      require("../server/routes/app.routes")(app);


    } else {
      // console.log(Error)
      // logger.error('----- Initialized database Status[Error] -----');
    }
  });


  return app;
};
