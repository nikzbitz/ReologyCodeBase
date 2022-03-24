const route = require("../routes/index");

const insertFSDetails = (req) => {
  return route.query(`INSERT INTO home_inspection.field_staff
( field_staff_salutation, field_staff_firstname, field_staff_middlename, field_staff_lastname, field_staff_ssn, field_staff_address_line1, field_staff_address_line2, field_staff_address_line3, field_staff_zipcode, field_staff_county, field_staff_city, field_staff_state, field_staff_phone_primary, field_staff_phone_alternate, field_staff_email_id_personal, field_staff_email_id_official, field_staff_office_address)
VALUES('${req.body.field_staff_salutation}', '${req.body.field_staff_firstname}', '${req.body.field_staff_middlename}', 
  '${req.body.field_staff_lastname}', '${req.body.field_staff_ssn}', '${req.body.field_staff_address_line1}', 
  '${req.body.field_staff_address_line2}', '${req.body.field_staff_address_line3}', 
  '${req.body.field_staff_zipcode}', '${req.body.field_staff_county}', '${req.body.field_staff_city}', 
  '${req.body.field_staff_state}', '${req.body.field_staff_phone_primary}', 
  '${req.body.field_staff_phone_alternate}', '${req.body.field_staff_email_id_personal}', 
  '${req.body.field_staff_email_id_official}', '${req.body.field_staff_office_address}')`);
};

const selectLatestID = () => {
  return route.query(`select last_insert_id() as lastInsertedId`);
};

const updateRes = (empId,field_staff_email_id_official,lastInsertedId) => {
  return route.query(`UPDATE home_inspection.field_staff SET 
    field_staff_empId='${empId}',field_staff_email_id_official=
    '${field_staff_email_id_official}'WHERE field_staff_id=${lastInsertedId}`);
};


const fetchAllFSDetails = () => {
    return route.query(`select * from home_inspection.field_staff`);
}

const fetchFSDetailsByID = (req) => {
  return route.query(
    `select * from home_inspection.field_staff where field_staff_empId = 
    '${req.body.field_staff_empId}'`
  );
};


module.exports.insertFSDetails = insertFSDetails;
module.exports.selectLatestID = selectLatestID;
module.exports.updateRes = updateRes;
module.exports.fetchAllFSDetails = fetchAllFSDetails;
module.exports.fetchFSDetailsByID = fetchFSDetailsByID;
