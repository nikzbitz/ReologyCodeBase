var express = require('express');
var router = express.Router();
const mysql = require('mysql')
const util = require('util');

const adminController = require('../controller/adminController.js');
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
router.post('/saveFSDetails', (req, res) => adminController.saveFSDetails(req.body, res));
router.get("/getAllFSDetails", (req, res) => adminController.getAllFSDetails(req, res));
router.post("/savePropertyDetails", (req, res) => adminController.savePropertyDetails(req.body, res));
router.post("/removeProperty", (req, res) => adminController.removeProperty(req.body, res));
router.get("/getAllProperties", (req, res) => adminController.getAllProperties(req, res));
router.post("/saveService", (req, res) => adminController.saveService(req.body, res));
router.get("/getAllServices", (req, res) => adminController.getAllServices(req, res));
router.post("/removeService", (req, res) => adminController.removeService(req.body, res));
router.post("/getServiceDetailsByID", (req, res) => adminController.getServiceDetailsByID(req.body, res));
router.post("/addServiceDetails", (req, res) => adminController.addServiceDetails(req.body, res));
router.post("/addServiceCost", (req, res) => adminController.addServiceCost(req.body, res));
router.post("/getServiceCostByID", (req, res) => adminController.getServiceCostByID(req.body, res));


//customer module routes
router.post("/saveAssignmentDetails", (req, res) => customerController.saveAssignmentDetails(req.body, res));
router.post("/getAssignmentByFSID", (req, res) => customerController.getAssignmentByFSID(req.body, res));
router.post("/updateAssignmentStatus", (req, res) => customerController.updateAssignmentStatus(req.body, res));
router.post("/getAssignmentByID", (req, res) => customerController.getAssignmentById(req.body, res));

module.exports.router = router;
module.exports.query = query;
module.exports.connection = connection;