const route = require("../routes/index");

const insertAssignmentDetails = (req) => {
  return route.query(`INSERT INTO home_inspection.assignment ( field_staff_assigned_fk,
    assignment_date,assignment_time_slot,assignment_time, name, 
    phone,email,property_address, city, state, code,property_location,property_ownership,  property_type) 
    VALUES( '${req.body.field_staff_assigned_fk}','${
    req.body.assignment_date
  }','${req.body.assignment_time_slot}','${req.body.assignment_time}', '${
    req.body.name
  }', '${req.body.phone}','${req.body.email}', 
    '${req.body.property_address1}, ${req.body.property_address2}, ${
    req.body.property_address3
  }',
    '${req.body.city}', '${req.body.state}', '${
    req.body.code
  }','${req.body.property_location.split("'").join('"')}',
    ${req.body.property_ownership},'${req.body.property_type}')`);
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
    `select * from assignment where field_staff_assigned_fk = '${req.body.fs_id}'
     and 
(assignment_status = 'Pending' or assignment_status = 'Accepted' or assignment_status = 'Next Due'
or assignment_status = 'In Transit'
or assignment_status = 'In Progress')`
  );
};

const updateCurrentStatus = (req) => {
  return route.query(
    `update assignment set assignment_status = '${req.body.assignment_status}',
      status_code = ${req.body.status_code}
        where assignment_identifier = '${req.body.assignment_identifier}'`
  );
};

const getAssignmentsByTime = (req) => {
return route.query(`select assignment_id ,assignment_identifier ,assignment_status ,assignment_date ,assignment_time_slot ,assignment_time 
from assignment where field_staff_assigned_fk = '${req.body.field_staff_id}' and 
(assignment_status = 'Accepted' or assignment_status = 'Next Due') order by assignment_time`); 
}

const updateNextDueStatus = (assignment_identifier) => {
  return route.query(`UPDATE assignment
SET assignment_status='Next Due', status_code = 2
WHERE assignment_identifier = '${assignment_identifier}'`);
};

const updateAllAssignmentStatus = (whereClause) => {
  return route.query(`UPDATE assignment
SET assignment_status='Accepted', status_code = 1
WHERE ${whereClause}`);
};

module.exports.insertAssignmentDetails = insertAssignmentDetails;
module.exports.updateRes = updateRes;
module.exports.updateCurrentStatus = updateCurrentStatus;
module.exports.updateAllAssignmentStatus = updateAllAssignmentStatus;
module.exports.selectLatestID = selectLatestID;
module.exports.fetchAssignmentByFSID = fetchAssignmentByFSID;
module.exports.getAssignmentsByTime = getAssignmentsByTime;
module.exports.updateNextDueStatus = updateNextDueStatus;
