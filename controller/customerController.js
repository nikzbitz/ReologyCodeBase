const route = require("../routes/index");
const customerModel = require("../model/customerModel");
const util = require("../util");
const keysMap = require("../keysMap");

const schedule = require('node-schedule');


const someDate = new Date();
//console.log(someDate);
schedule.scheduleJob('31 22 * * *', () => {
  declineAssignment('9-1');
});


schedule.scheduleJob('32 22 * * *', () => {
  declineAssignment('2-6');
});

/**
 *
 * @param {*} req
 * @param {*} res
 */
const saveAssignmentDetails = async (req, res) => {
  try {
    console.log(req);
    console.log('INITIAL DATE', new Date(req.assignmentDate).toString());
    req.assignmentDate = util.formatDate(new Date(req.assignmentDate).toString());
    req.assignmentTime = req.assignmentDate + ' ' + (new Date(req.assignmentTime).toString().split(" ")[4]);

    console.log(`ASSIGNMENT Date ==> ${req.assignmentDate}`);
    console.log(`ASSIGNMENT TIME ==> ${req.assignmentTime}`);

    const insertQueryRes = await customerModel.insertAssignmentDetails(req);
    console.log(insertQueryRes.affectedRows);
    if (insertQueryRes.affectedRows) {
      const [selectIDRes] = await customerModel.selectLatestID();
      console.log(`ID RESULT===> ${selectIDRes.lastInsertedId}`);
      let lastInsertedId = selectIDRes.lastInsertedId;
      let s = "000" + lastInsertedId;
      let assId = "A" + s.substr(s.length - 4);
      console.log(`assId`, assId);

      const updateRes = await customerModel.updateRes(assId, lastInsertedId);
      if (updateRes.affectedRows) {
        res.send({
          statusCode: 200,
          message: "Assignment added successfully",
        });
      }
    }
  } catch (error) {
    console.log(`the error is `, error);
  }
};

const getAssignmentByFSID = async (req, res) => {
  try {
    let resObj = {};
    let fieldStaffDetails = (await customerModel.fetchFSDetailsByID(req))[0];
    resObj.fieldStaffDetails = util.modifyKeys(keysMap.fieldStaffKeys, fieldStaffDetails);
    resObj.assignmentDetails = [];
    const assignmentDetails = await customerModel.fetchAssignmentByFSID(req);
    console.log('Assignment details ==>', JSON.stringify(assignmentDetails, null, 3));

    resObj.assignmentDetails = assignmentDetails.map((element) => {
      element.property_location = element.property_location ? JSON.parse(element.property_location) :
        { "latitude": "", "longitude": "" };
      element.service_id_fk = element.service_id_fk ? element.service_id_fk.split(",") :
        element.service_id_fk;
      element.assignment_time = new Date(`${element.assignment_time}`).getTime();
      element.assignment_date_MS = new Date(`${element.assignment_date}`).getTime();
      return util.modifyKeys(keysMap.assignmentKeys, element);
    })
    res.send(resObj);
  } catch (error) {
    console.log(`The error is ==> ${error}`);
  }
};

const updateAssignmentStatus = async (req, res) => {
  try {
    const arr = [];
    await customerModel.updateAssignmentStatus(req.assignment_status,
      req.status_code, req.assignment_identifier);

    if (req.assignment_status === "Accepted" || req.assignment_status === "Completed") {

      const getAssignmentsByTime = await customerModel.getAssignmentsByTime(req);
      if (getAssignmentsByTime.length > 0) {
        const updateNextDueStatus = await customerModel.updateAssignmentStatus('Next Due', 2,
          getAssignmentsByTime[0].assignment_identifier);

        if (updateNextDueStatus.affectedRows) {

          getAssignmentsByTime.forEach((value, index) => {
            if (index < 1) return;
            arr.push(`assignment_identifier = '${value.assignment_identifier}'`);
          });

          let whereClause = arr.join(" OR ");

          const updateAllAssignmentStatus =
            await customerModel.updateAllAssignmentStatus(whereClause);
          if (updateAllAssignmentStatus.affectedRows) {
            if (req.assignment_status === "Completed") {
              const ratingRes = customerModel.insertRating(req.assignment_identifier);
              if (ratingRes.affectedRows) {
                res.send(util.AssignStatusUpdateSuccessRes);
              }
            }
            res.send(util.AssignStatusUpdateSuccessRes);
          }
        }
      }
      else {
        if (req.assignment_status === "Completed") {
          const ratingRes = await customerModel.insertRating(req.assignment_identifier);
          console.log(ratingRes);
          if (ratingRes.affectedRows) {
            res.send(util.AssignStatusUpdateSuccessRes);
          }
        }
      }
    }
    else {
      res.send(util.AssignStatusUpdateSuccessRes);
    }
  } catch (error) {
    console.log(`updateAssignmentStatus error ==> ${error}`);
  }
};


const declineAssignment = async (time_slot) => {
  const res = await customerModel.updateDeclinedStatus(time_slot);
  console.log(`The assigment has been declined`);
}


const getAssignmentById = async (req, res) => {
  const assigmentDetails = await customerModel.fetchAssignmentById(req);
  res.send({
    "status": 200,
    "data": assigmentDetails
  });
}

const getFSDetailsByID = async (req, res) => {
  const FSDetails = await customerModel.fetchFSDetailsByID(req);
  res.send(FSDetails);
}

const getAvailableFS = async (req, res) => {
  const FSDetails = await customerModel.fetchAvailableFS(req);
  const FSDetailsRes = FSDetails.map((element) => {
    return util.modifyKeys(keysMap.fieldStaffKeys, element)
  });
  res.send(FSDetailsRes);
}

//const getFSDetailsByID
module.exports.saveAssignmentDetails = saveAssignmentDetails;
module.exports.getAssignmentByFSID = getAssignmentByFSID;
module.exports.updateAssignmentStatus = updateAssignmentStatus;
module.exports.getAssignmentById = getAssignmentById;
module.exports.getFSDetailsByID = getFSDetailsByID;
module.exports.getAvailableFS = getAvailableFS;

