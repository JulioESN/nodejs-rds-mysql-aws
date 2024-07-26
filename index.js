const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const router = express();
const mysql = require("mysql");
// const port = 8080;
var data;

const db = mysql.createConnection ({
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
});

db.connect(function(err) {
    if (err) throw err;
     console.log("Conectado a RDS")
    db.query("SELECT * FROM time_zone_name", function (err, result, fields) {
      if (err) throw err;
      data = result;
      // console.log(result);
    });
    db.end();
  });

  router.get("/", function(req, res, next) {
      res.send(JSON.stringify(data));
    });
  module.exports = router;

  router.listen(8080, () => {
    console.log("Listening to requests on Port 8080")
})