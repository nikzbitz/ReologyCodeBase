const route = require("../routes/index");
const customerModel = require("../model/customerModel");
const util = require("../util");
const keysMap = require("../keysMap");

const schedule = require('node-schedule');


const someDate = new Date();
//console.log(someDate);
schedule.scheduleJob('59 07 * * *', () => {
  declineAssignment('9-1', 'Pending');
});


schedule.scheduleJob('59 12 * * *', () => {
  declineAssignment('2-6', 'Pending');
});

schedule.scheduleJob('30 12 * * *', () => {
  declineAssignment('9-1', 'Accepted');
});

schedule.scheduleJob('30 17 * * *', () => {
  declineAssignment('2-6', 'Accepted');
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
        const increaseAssignmentNumber =
          await customerModel.increaseAssignmentNumber(req.fieldStaffAssigned, 'field_staff_assignment_pending');
        if (increaseAssignmentNumber.affectedRows) {
          res.send({
            status: 200,
            message: "Assignment added successfully",
          });
        }
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
      if (getAssignmentsByTime.length > 0) { //only if FS has multiple assignments then update others statuses 
        const updateNextDueStatus = await customerModel.updateAssignmentStatus('Next Due', 2,
          getAssignmentsByTime[0].assignment_identifier);

        if (updateNextDueStatus.affectedRows) {
          console.log('getAssignmentsByTime', getAssignmentsByTime);
          getAssignmentsByTime.forEach((value, index) => {
            if (index < 1) return;
            arr.push(`assignment_identifier = '${value.assignment_identifier}'`);
          });

          let whereClause = arr.join(" OR ");
          console.log('whereClause', whereClause);
          if (whereClause) {
            const updateAllAssignmentStatus =
              await customerModel.updateAllAssignmentStatus(whereClause);
          }

          if (req.assignment_status === "Completed") {
            await customerModel.reduceAssignmentNumber(req.field_staff_id,
              'field_staff_assignment_inprogress');
            const increaseAssignmentNumber =
              await customerModel.increaseAssignmentNumber(req.field_staff_id, 'field_staff_assignment_completed');
            if (increaseAssignmentNumber.affectedRows) {
              const ratingRes = await customerModel.insertRating(req.field_staff_id);
              if (ratingRes.affectedRows) {
                res.send(util.AssignStatusUpdateSuccessRes);
              }
            }
          } else {
            const reduceAssignmentNumber = await customerModel.reduceAssignmentNumber(req.field_staff_id,
              'field_staff_assignment_pending');
            if (reduceAssignmentNumber.affectedRows) {
              res.send(util.AssignStatusUpdateSuccessRes);
            }
          }
          res.send(util.AssignStatusUpdateSuccessRes);
        }
      }
      else {
        if (req.assignment_status === "Completed") {
          await customerModel.reduceAssignmentNumber(req.field_staff_id,
            'field_staff_assignment_inprogress');
          const increaseAssignmentNumber =
            await customerModel.increaseAssignmentNumber(req.field_staff_id, 'field_staff_assignment_completed');
          if (increaseAssignmentNumber.affectedRows) {
            const ratingRes = await customerModel.insertRating(req.field_staff_id);
            if (ratingRes.affectedRows) {
              res.send(util.AssignStatusUpdateSuccessRes);
            }
          }
        } else {
          const reduceAssignmentNumber = await customerModel.reduceAssignmentNumber(req.field_staff_id,
            'field_staff_assignment_pending');
          if (reduceAssignmentNumber.affectedRows) {
            res.send(util.AssignStatusUpdateSuccessRes);
          }
        }
      }
    }
    else {
      if (req.assignment_status === "In Progress") {
        const increaseAssignmentNumber =
          await customerModel.increaseAssignmentNumber(req.field_staff_id, 'field_staff_assignment_inprogress');
        if (increaseAssignmentNumber.affectedRows) {
          res.send(util.AssignStatusUpdateSuccessRes);
        }
      } else {
        res.send(util.AssignStatusUpdateSuccessRes);
      }
    }
  } catch (error) {
    console.log(`updateAssignmentStatus error ==> ${error}`);
  }
};


const declineAssignment = async (time_slot, status) => {
  const res = await customerModel.updateDeclinedStatus(time_slot, status);
  console.log(`The assigment has been declined`);
}


const getAssignmentById = async (req, res) => {
  const assigmentDetails = await customerModel.fetchAssignmentById(req);
  const assigmentDetailsRes = assigmentDetails.map((element) => {
    return util.modifyKeys(keysMap.assignmentKeys, element)
  });
  res.send(assigmentDetailsRes);
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

const saveFSPassword = async (req, res) => {
  try {
    const [isPasswordSet] = await customerModel.checkPasswordSet(req);
    console.log('isPasswordSet', isPasswordSet.is_password_set);
    if (!isPasswordSet.is_password_set) {
      const updateQueryRes = await customerModel.updateFSPassword(req);
      console.log(updateQueryRes.affectedRows);
      if (updateQueryRes.affectedRows) {
        res.send({
          status: 200,
          message: "Password saved successfully",
        });
      } else {
        res.send({
          status: 200,
          message: "The employee ID or email you entered is incorrect",
        });
      }
    } else {
      res.send({
        status: 200,
        message: "The password has already been set",
      });
    }
  } catch (error) {
    console.log(`save password error is `, error);
  }
};

const saveCustomerDetails = async (req, res) => {
  try {
    const isEmailPhoneExist = await customerModel.checkEmailPhoneExists(req);
    console.log('isEmailPhoneExist', isEmailPhoneExist.length);
    if (isEmailPhoneExist.length == 0) {
      const insertQueryRes = await customerModel.insertCustomerDetails(req);
      console.log(insertQueryRes.affectedRows);
      if (insertQueryRes.affectedRows) {
        const [selectIDRes] = await customerModel.selectLatestID();
        console.log(`ID RESULT===> ${selectIDRes.lastInsertedId}`);
        let lastInsertedId = selectIDRes.lastInsertedId;
        let s = "000" + lastInsertedId;
        let custId = "C" + s.substr(s.length - 4);
        console.log(`custId`, custId);

        const updateRes = await customerModel.updateCustomerRes(custId, lastInsertedId);
        if (updateRes.affectedRows) {
          res.send({
            status: 200,
            message: "Customer added successfully",
          });
        }
      }
    } else {
      res.send({
        status: 200,
        message: "The email or phone number already exists. Please try again with new email or phone number.",
      });
    }

  } catch (error) {
    console.log(`the error is `, error);
  }
};


const customerLogin = async (req, res) => {
  const authenticatedUserDetails = await customerModel.checkAuthenticatedCustomer(req);
  console.log(authenticatedUserDetails);
  if (authenticatedUserDetails.length) {
    res.send({
      "status": 200,
      "message": "Customer logged in successfully",
      "data": util.modifyKeys(keysMap.customerKeys, authenticatedUserDetails[0])
    })
  } else {
    res.send({
      "status": 200,
      "message": "The phone number or password you entered is incorrect"
    })
  }
}

const fieldStaffLogin = async (req, res) => {
  const authenticatedUserDetails = await customerModel.checkAuthenticatedFS(req);
  console.log(authenticatedUserDetails);
  if (authenticatedUserDetails.length) {
    res.send({
      "status": 200,
      "message": "Field Staff logged in successfully",
      "data": util.modifyKeys(keysMap.fieldStaffKeys, authenticatedUserDetails[0])
    })
  } else {
    res.send({
      "status": 200,
      "message": "The employee ID or password you entered is incorrect"
    })
  }

}

//const getFSDetailsByID
module.exports.saveAssignmentDetails = saveAssignmentDetails;
module.exports.getAssignmentByFSID = getAssignmentByFSID;
module.exports.updateAssignmentStatus = updateAssignmentStatus;
module.exports.getAssignmentById = getAssignmentById;
module.exports.getFSDetailsByID = getFSDetailsByID;
module.exports.getAvailableFS = getAvailableFS;
module.exports.saveCustomerDetails = saveCustomerDetails;
module.exports.customerLogin = customerLogin;
module.exports.saveFSPassword = saveFSPassword;
module.exports.fieldStaffLogin = fieldStaffLogin;