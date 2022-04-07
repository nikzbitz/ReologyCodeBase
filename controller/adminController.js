const adminModel = require("../model/adminModel");
const keysMap = require("../keysMap");
const util = require("../util");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const saveFSDetails = async (req, res) => {
  try {
    const insertQueryRes = await adminModel.insertFSDetails(req);
    console.log(insertQueryRes.affectedRows);
    if (insertQueryRes.affectedRows) {
      const [selectIDRes] = await adminModel.selectLatestID();
      console.log(
        `ID RESULT===> ${selectIDRes.lastInsertedId}`
      );
      let lastInsertedId = selectIDRes.lastInsertedId;
      let s = "00" + lastInsertedId;
      let empId = "F" + s.substr(s.length - 3);
      console.log(`empId`, empId);
      let field_staff_email_id_official = `${req.field_staff_firstname}.${req.field_staff_lastname}${lastInsertedId}@homeinspection.com`;
      console.log('field_staff_email_id_official', field_staff_email_id_official);

      const updateFSRes = await adminModel.updateFSRes(empId, field_staff_email_id_official, lastInsertedId)
      if (updateFSRes.affectedRows) {
        res.send({
          statusCode: 200,
          message: "Field Staff added successfully",
        });
      }
    }
  } catch (error) {
    console.log(`the error is `, error);
  }
};



const getAllFSDetails = async (req, res) => {
  try {
    console.log(req.query.page);
    console.log(req.query.limit);
    let start = (req.query.page - 1) * req.query.limit;
    let end = req.query.page * req.query.limit;
    const FSDetails = await adminModel.fetchAllFSDetails();
    res.send({
      "status": 200,
      "data": FSDetails.slice(start, end),
      "total_records": FSDetails.length
    })

  }
  catch (error) {
    console.log(`The error is ==> ${error}`);
  }
}


const savePropertyDetails = async (req, res) => {
  try {
    const insertQueryRes = await adminModel.insertPropertyDetails(req);
    console.log(insertQueryRes.affectedRows);
    if (insertQueryRes.affectedRows) {
      const [selectIDRes] = await adminModel.selectLatestID();
      console.log(`ID RESULT===> ${selectIDRes.lastInsertedId}`);
      let lastInsertedId = selectIDRes.lastInsertedId;
      let s = "000" + lastInsertedId;
      let propId = "P" + s.substr(s.length - 4);
      console.log(`propId`, propId);

      const updatePropRes = await adminModel.updatePropRes(propId, lastInsertedId);
      if (updatePropRes.affectedRows) {
        res.send({
          statusCode: 200,
          message: "Property added successfully",
        });
      }
    }
  } catch (error) {
    console.log(`the error is `, error);
  }
};


const removeProperty = async (req, res) => {
  try {
    await adminModel.deletePropertyDetails(req);
    res.send({
      status: 200,
      message: 'The property has been removed',
    });
  } catch (error) {
    console.log(`The error is ==> ${error}`);
  }
}

const getAllProperties = async (req, res) => {
  try {
    const propertyDetails = await adminModel.fetchAllProperties();
    res.send(propertyDetails.map(element => {
      return util.modifyKeys(keysMap.propertyKeys, element)
    }));
  } catch (error) {
    console.log(`The error is ==> ${error}`);
  }
}


const saveService = async (req, res) => {
  try {
    const insertQueryRes = await adminModel.insertService(req);
    console.log(insertQueryRes.affectedRows);
    if (insertQueryRes.affectedRows) {
      const [selectIDRes] = await adminModel.selectLatestID();
      console.log(`ID RESULT===> ${selectIDRes.lastInsertedId}`);
      let lastInsertedId = selectIDRes.lastInsertedId;
      let s = "000" + lastInsertedId;
      let serviceId = "S" + s.substr(s.length - 4);
      console.log(`serviceId`, serviceId);

      const updateServiceRes = await adminModel.updateServiceRes(serviceId, lastInsertedId);
      if (updateServiceRes.affectedRows) {
        res.send({
          statusCode: 200,
          message: "Service added successfully",
        });
      }
    }
  } catch (error) {
    console.log(`the error is `, error);
  }
};


const getAllServices = async (req, res) => {
  try {
    const serviceDetails = await adminModel.fetchAllServices();
    res.send(serviceDetails.map(element => {
      return util.modifyKeys(keysMap.serviceKeys, element)
    }));
  } catch (error) {
    console.log(`The error is ==> ${error}`);
  }
}

const removeService = async (req, res) => {
  try {
    await adminModel.deleteService(req);
    res.send({
      status: 200,
      message: 'The service has been removed',
    });
  } catch (error) {
    console.log(`The error is ==> ${error}`);
  }
}

const getServiceDetailsByID = async (req, res) => {
  try {
    const serviceDetails = await adminModel.fetchServiceDetailsByID(req);
    res.send({
      status: 200,
      data: serviceDetails
    });
  } catch (error) {
    console.log(`The error is ==> ${error}`);
  }
}


const addServiceDetails = async (req, res) => {
  try {
    const addDetailsRes = await adminModel.insertServiceDetails(req);
    if (addDetailsRes.affectedRows) {
      res.send({
        status: 200,
        data: "Service details have been added successfully"
      });
    }
  } catch (error) {
    console.log(`The error is ==> ${error}`);
  }
}

const addServiceCost = async (req, res) => {
  try {
    const addCostRes = await adminModel.insertServiceCost(req);
    if (addCostRes.affectedRows) {
      res.send({
        status: 200,
        data: "Cost has been added successfully"
      });
    }
  } catch (error) {
    console.log(`The error is ==> ${error}`);
  }
}

const getServiceCostByID = async (req, res) => {
  try {
    const costDetails = await adminModel.fetchServiceCostByID(req);
    res.send({
      status: 200,
      data: costDetails
    });
  } catch (error) {
    console.log(`The error is ==> ${error}`);
  }
}


module.exports.saveFSDetails = saveFSDetails;
module.exports.getAllFSDetails = getAllFSDetails;
module.exports.savePropertyDetails = savePropertyDetails;
module.exports.removeProperty = removeProperty;
module.exports.getAllProperties = getAllProperties;
module.exports.saveService = saveService;
module.exports.getAllServices = getAllServices;
module.exports.removeService = removeService;
module.exports.getServiceDetailsByID = getServiceDetailsByID;
module.exports.addServiceDetails = addServiceDetails;
module.exports.addServiceCost = addServiceCost;
module.exports.getServiceCostByID = getServiceCostByID;
