var express = require('express');
var router = express.Router();
const mysql = require('mysql')
const util = require('util');


const APController = require('../controller/adminPanelController.js');
const customerController = require("../controller/customerController");
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'himvp@22',
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