const APModel = require("../model/adminPanelModel");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const saveFSDetails = async (req, res) => {
  try {
    console.log("iside here");
    console.log(req.body);
    const insertQueryRes = await APModel.insertFSDetails(req); 
    console.log(insertQueryRes.affectedRows);
    if (insertQueryRes.affectedRows) {
      const [selectIDRes] = await APModel.selectLatestID();
      console.log(
        `ID RESULT===> ${selectIDRes.lastInsertedId}`
      );
      let lastInsertedId = selectIDRes.lastInsertedId;
      let s = "00" + lastInsertedId;
      let empId = "F" + s.substr(s.length - 3);
      console.log(`empId`, empId);
      let field_staff_email_id_official = `${req.body.field_staff_firstname}.${req.body.field_staff_lastname}${lastInsertedId}@homeinspection.com`;
      console.log('field_staff_email_id_official', field_staff_email_id_official);
      
      const updateRes = await APModel.updateRes(empId,field_staff_email_id_official,lastInsertedId)
      if (updateRes.affectedRows) {
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



const getAllFSDetails = async (req,res) => {
  try {
    console.log(req.query.page);
        console.log(req.query.limit);
    let start = (req.query.page-1)*req.query.limit;
    let end = req.query.page * req.query.limit;
    const FSDetails = await APModel.fetchAllFSDetails();
	  console.log('Results Size', FSDetails.slice(start, end).length);  
    res.send({
      "status": 200,
      "data": FSDetails.slice(start,end),
      "total_records" : FSDetails.length
    })
  }
  catch (error) {
    console.log(`The error is ==> ${error}`);
  }
}


const getFSDetailsByID = async (req,res) => {
    try {
      const FSDetails = await APModel.fetchFSDetailsByID(req);
      res.send({
        status: 200,
        data: FSDetails,
      });
    } catch (error) {
      console.log(`The error is ==> ${error}`);
    }
}

//const getFSDetailsByID
module.exports.saveFSDetails = saveFSDetails;
module.exports.getAllFSDetails = getAllFSDetails;
module.exports.getFSDetailsByID = getFSDetailsByID;
