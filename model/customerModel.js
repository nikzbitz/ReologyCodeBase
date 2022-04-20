const route = require("../routes/index");

const insertAssignmentDetails = (req) => {
  return route.query(`INSERT INTO home_inspection.assignment ( field_staff_assigned_fk,
    assignment_date,assignment_time_slot,assignment_time, name, 
    phone,email,property_address, city, state, code,property_location,property_ownership,
    contact_address_location,service_id_fk,property_id_fk) 
    VALUES( '${req.fieldStaffAssigned}','${req.assignmentDate}','${req.assignmentTimeSlot}',
    '${req.assignmentTime}', '${req.name}', '${req.phone}','${req.email}','${req.propertyAddress1},
     ${req.propertyAddress2}, ${req.propertyAddress3}','${req.city}', 
    '${req.state}', '${req.code}','${req.propertyLocation.split("'").join('"')}',
    ${req.propertyOwnership},'${req.contactAddressLocation.split("'").join('"')}',
     '${req.serviceId.join(",")}','${req.propertyId}')`);
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
      status_code = '${statusCode}'
        where assignment_identifier = '${assId}'`
  );
};

const getAssignmentsByTime = (req) => {
	console.log(`select assignment_id ,assignment_identifier ,assignment_status ,assignment_date ,assignment_time_slot ,assignment_time
from assignment where field_staff_assigned_fk = '${req.field_staff_id}' and
(assignment_status = 'Accepted' or assignment_status = 'Next Due') order by assignment_time`);
  return route.query(`select assignment_id ,assignment_identifier ,assignment_status ,assignment_date ,assignment_time_slot ,assignment_time 
from assignment where field_staff_assigned_fk = '${req.field_staff_id}' and 
(assignment_status = 'Accepted' or assignment_status = 'Next Due') order by assignment_time`);
}

const updateAllAssignmentStatus = (whereClause) => {
	console.log(`UPDATE assignment
SET assignment_status='Accepted', status_code = 1
WHERE ${whereClause}`);
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


const fetchFSDetailsByID = (req) => {
  return route.query(
    `select * from home_inspection.field_staff where field_staff_empId = 
    '${req.fs_id}'`
  );
};

const fetchAvailableFS = (req) => {
  return route.query(
    `select *  from field_staff fs
where fs.field_staff_zipcode = ${req.zipCode}  and 
NOT EXISTS
(select field_staff_assigned_fk  from assignment a
where
a.field_staff_assigned_fk = fs.field_staff_empId and
a.assignment_date = '${req.assignmentDate}' and 
a.assignment_time_slot = '${req.assignmentTimeSlot}')`
  );
};

const insertRating = (assId) => {
  return route.query(`update assignment set rating_provided = 
  '${(Math.random() * (5.0 - 3.8) + 3.8).toFixed(2)}' 
  where assignment_identifier = '${assId}'`)
}

module.exports.insertAssignmentDetails = insertAssignmentDetails;
module.exports.updateRes = updateRes;
module.exports.updateAssignmentStatus = updateAssignmentStatus;
module.exports.updateAllAssignmentStatus = updateAllAssignmentStatus;
module.exports.selectLatestID = selectLatestID;
module.exports.fetchAssignmentByFSID = fetchAssignmentByFSID;
module.exports.getAssignmentsByTime = getAssignmentsByTime;
module.exports.updateDeclinedStatus = updateDeclinedStatus;
module.exports.fetchAssignmentById = fetchAssignmentById;
module.exports.fetchFSDetailsByID = fetchFSDetailsByID;
module.exports.fetchAvailableFS = fetchAvailableFS;
module.exports.insertRating = insertRating;
