const route = require("../routes/index");

const insertAssignmentDetails = (req) => {
  return route.query(`INSERT INTO home_inspection.assignment ( field_staff_assigned_fk,
    assignment_date,assignment_time_slot,assignment_time, name, 
    phone,email,property_address, city, state, code,property_location,property_ownership,  property_type) 
    VALUES( '${req.field_staff_assigned_fk}','${req.assignment_date
    }','${req.assignment_time_slot}','${req.assignment_time}', '${req.name}', '${req.phone}',
    '${req.email}','${req.property_address1}, ${req.property_address2}, ${req.property_address3}','${req.city}', 
    '${req.state}', '${req.code}','${req.property_location.split("'").join('"')}',
    ${req.property_ownership},'${req.property_type}')`);
};

const selectLatestID = () => {
  return route.query(`select last_insert_id() as lastInsertedId`);
};

const updateRes = (assId, lastInsertedId) => {
  return route.query(`UPDATE home_inspection.assignment SET 
    assignment_identifier='${assId}' WHERE assignment_id=${lastInsertedId}`);
};

const fetchAssignmentByFSID = (req) => {
  return route.query(
    `select * from assignment where field_staff_assigned_fk = '${req.fs_id}'
    and (assignment_status = 'Pending' or assignment_status = 'Accepted' 
    or assignment_status = 'Next Due' or assignment_status = 'In Transit'
    or assignment_status = 'In Progress')`
  );
};

const updateAssignmentStatus = (status, statusCode, assId) => {
  return route.query(
    `update assignment set assignment_status = '${status}',
      status_code = ${statusCode}
        where assignment_identifier = '${assId}'`
  );
};

const getAssignmentsByTime = (req) => {
  return route.query(`select assignment_id ,assignment_identifier ,assignment_status ,assignment_date ,assignment_time_slot ,assignment_time 
from assignment where field_staff_assigned_fk = '${req.field_staff_id}' and 
(assignment_status = 'Accepted' or assignment_status = 'Next Due') order by assignment_time`);
}

const updateAllAssignmentStatus = (whereClause) => {
  return route.query(`UPDATE assignment
SET assignment_status='Accepted', status_code = 1
WHERE ${whereClause}`);
};

const updateDeclinedStatus = (time_slot) => {
  console.log(`UPDATE assignment
SET assignment_status='Declined', status_code = 2
WHERE assignment_date = '${new Date().toISOString().split('T')[0]}'
and assignment_time_slot = '${time_slot}'
and assignment_status = 'Pending'`);
  return route.query(`UPDATE assignment
SET assignment_status='Declined', status_code = 2
WHERE assignment_date = '${new Date().toISOString().split('T')[0]}'
and assignment_time_slot = '${time_slot}'
and assignment_status = 'Pending'`);
};


const fetchAssignmentById = (req) => {
  return route.query(`select * from assignment where assignment_identifier  = '${req.assignment_identifier}'`);
};


module.exports.insertAssignmentDetails = insertAssignmentDetails;
module.exports.updateRes = updateRes;
module.exports.updateAssignmentStatus = updateAssignmentStatus;
module.exports.updateAllAssignmentStatus = updateAllAssignmentStatus;
module.exports.selectLatestID = selectLatestID;
module.exports.fetchAssignmentByFSID = fetchAssignmentByFSID;
module.exports.getAssignmentsByTime = getAssignmentsByTime;
module.exports.updateDeclinedStatus = updateDeclinedStatus;
module.exports.fetchAssignmentById = fetchAssignmentById;