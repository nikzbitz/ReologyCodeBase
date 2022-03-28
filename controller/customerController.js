const route = require("../routes/index");
const customerModel = require("../model/customerModel");
const util = require("../util");


/**
 *
 * @param {*} req
 * @param {*} res
 */
const saveAssignmentDetails = async (req, res) => {
  try {
    console.log(req.body);
    const insertQueryRes = await customerModel.insertAssignmentDetails(req);
    console.log(insertQueryRes.affectedRows);
    if (insertQueryRes.affectedRows) {
      const [selectIDRes] = await customerModel.selectLatestID();
      console.log(`ID RESULT===> ${selectIDRes.lastInsertedId}`);
      let lastInsertedId = selectIDRes.lastInsertedId;
      let s = "000" + lastInsertedId;
      let assId = "A" + s.substr(s.length - 4);
      console.log(`assId`, assId);

      const updateRes = await customerModel.updateRes(
        assId,
        lastInsertedId
      );
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
    const assignmentDetails = await customerModel.fetchAssignmentByFSID(req);
    
    res.send({
      status: 200,
      data: util.modifyResponse(assignmentDetails),
    });
  } catch (error) {
    console.log(`The error is ==> ${error}`);
  }
};


const updateAssignmentStatus = async (req,res) => {
    try {
        const arr = [];
        await customerModel.updateCurrentStatus(req);
        const getAssignmentsByTime = await customerModel.getAssignmentsByTime(req);
        const updateNextDueStatus = 
        await customerModel.updateNextDueStatus(getAssignmentsByTime[0].assignment_identifier);
        console.log(updateNextDueStatus);
        //return 0;
        if(updateNextDueStatus.affectedRows) {

        getAssignmentsByTime.forEach((value, index) => {
          if (index < 1) return;
          arr.push(`assignment_identifier = '${value.assignment_identifier}'`);
        });
        let whereClause = arr.join(" OR ");
        console.log('whereClause', whereClause);
        
        console.log(`UPDATE assignment
SET assignment_status='Accepted', status_code = 1
WHERE ${whereClause}`);
        const updateAllAssignmentStatus =
          await customerModel.updateAllAssignmentStatus(whereClause);
        if (updateAllAssignmentStatus.affectedRows) {
          res.send({
            status: 200,
            message: "Assignment status has been udpated successfully",
          });
        }
        }

    } catch (error) {
        console.log(`updateAssignmentStatus error ==> ${error}`);
    }
}

//const getFSDetailsByID
module.exports.saveAssignmentDetails = saveAssignmentDetails;
module.exports.getAssignmentByFSID = getAssignmentByFSID;
module.exports.updateAssignmentStatus = updateAssignmentStatus;
