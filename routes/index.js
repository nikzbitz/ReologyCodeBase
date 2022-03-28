var express = require('express');
var router = express.Router();
const mysql = require('mysql')
const util = require('util');
const  cors = require('cors')

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

const APController = require('../controller/adminPanelController.js');
const customerController = require("../controller/customerController");
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Himvp@22',
  port:3306,
  database: 'home_inspection'
})

connection.connect()


const query = util.promisify(connection.query).bind(connection);




//admin panel routes
router.post('/saveFSDetails', (req, res) => APController.saveFSDetails(req,res));
router.get("/getAllFSDetails", (req, res) =>APController.getAllFSDetails(req, res));
router.post("/getFSDetailsByID", (req, res) =>APController.getFSDetailsByID(req, res));

//customer module routes
router.post("/saveAssignmentDetails", (req,res) => customerController.saveAssignmentDetails(req,res));
router.post("/getAssignmentByFSID", (req,res) => customerController.getAssignmentByFSID(req,res));
router.post("/updateAssignmentStatus", (req,res) => customerController.updateAssignmentStatus(req,res));

module.exports.router = router;
module.exports.query = query;
module.exports.connection = connection;
