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

const updateDeclinedStatus = (time_slot,status) => {
  return route.query(`UPDATE assignment
SET assignment_status='Declined', status_code = 2
WHERE assignment_date = '${new Date().toISOString().split('T')[0]}'
and assignment_time_slot = '${time_slot}'
and assignment_status = '${status}'`);
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
    `select field_staff_id, field_staff_empId, field_staff_salutation, 
    field_staff_firstname, field_staff_middlename, field_staff_lastname, field_staff_ssn, 
    field_staff_address_line1, field_staff_address_line2, field_staff_address_line3, 
    field_staff_zipcode, field_staff_county, field_staff_city, field_staff_state, 
    field_staff_phone_primary, field_staff_phone_alternate, field_staff_email_id_personal, 
    field_staff_email_id_official, field_staff_office_address, field_staff_time_slot, 
    field_staff_location, field_staff_avg_rating, field_staff_assignment_inprogress, 
    field_staff_assignment_declined, field_staff_assignment_pending, 
    field_staff_assignment_completed  from field_staff fs
where fs.field_staff_zipcode = ${req.zipCode}  and 
NOT EXISTS
(select field_staff_assigned_fk  from assignment a
where
a.field_staff_assigned_fk = fs.field_staff_empId and
a.assignment_date = '${req.assignmentDate}' and 
a.assignment_time_slot = '${req.assignmentTimeSlot}')`
  );
};

const increaseAssignmentNumber = (fsID, fieldName) => {
  return route.query(`UPDATE field_staff fs 
SET fs.${fieldName} = fs.${fieldName} + 1
where fs.field_staff_empId = '${fsID}'`)
}

const reduceAssignmentNumber = (fsID, fieldName) => {
  return route.query(`UPDATE field_staff fs
  SET fs.${fieldName} = fs.${fieldName} - 1
  where fs.field_staff_empId = '${fsID}'`)
}

const insertRating = (fsId) => {
  return route.query(`update field_staff set field_staff_avg_rating = 
  '${(Math.random() * (5.0 - 3.8) + 3.8).toFixed(2)}' 
  where field_staff_empId = '${fsId}'`)
}

const insertCustomerDetails = (req) => {
  return route.query(`INSERT INTO home_inspection.customer (customer_firstname, 
    customer_lastname,customer_email,customer_phone,customer_password) 
    VALUES( '${req.firstName}','${req.lastName}','${req.email}','${req.phone}',
    '${req.password}')`);
};


const updateCustomerRes = (custId, lastInsertedId) => {
  return route.query(`UPDATE home_inspection.customer SET 
    customer_identifier='${custId}' WHERE customer_id=${lastInsertedId}`);
};

const checkAuthenticatedCustomer = (req) => {
  return route.query(`select customer_id,customer_identifier,customer_firstname,customer_lastname,
  customer_email,customer_phone from home_inspection.customer where 
  customer_phone = '${req.phone}' and customer_password = '${req.password}'`);
};

const updateFSPassword = (req) => {
  return route.query(`update home_inspection.field_staff SET 
  field_staff_password = '${req.password}' where field_staff_empId = '${req.fieldStaffId}'
  and field_staff_email_id_official = '${req.fieldStaffEmail}'`);
};

const checkAuthenticatedFS = (req) => {
  return route.query(`select * from home_inspection.field_staff where 
  field_staff_empId = '${req.fieldStaffId}' and field_staff_password = '${req.password}'`);
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
module.exports.fetchFSDetailsByID = fetchFSDetailsByID;
module.exports.fetchAvailableFS = fetchAvailableFS;
module.exports.insertRating = insertRating;
module.exports.increaseAssignmentNumber = increaseAssignmentNumber;
module.exports.reduceAssignmentNumber = reduceAssignmentNumber;
module.exports.insertCustomerDetails = insertCustomerDetails;
module.exports.updateCustomerRes = updateCustomerRes;
module.exports.checkAuthenticatedCustomer = checkAuthenticatedCustomer;
module.exports.updateFSPassword = updateFSPassword;
module.exports.checkAuthenticatedFS = checkAuthenticatedFS;