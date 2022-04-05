const route = require("../routes/index");

const insertFSDetails = (req) => {
  return route.query(`INSERT INTO home_inspection.field_staff
( field_staff_salutation, field_staff_firstname, field_staff_middlename, field_staff_lastname, field_staff_ssn, field_staff_address_line1, field_staff_address_line2, field_staff_address_line3, field_staff_zipcode, field_staff_county, field_staff_city, field_staff_state, field_staff_phone_primary, field_staff_phone_alternate, field_staff_email_id_personal, field_staff_email_id_official, field_staff_office_address)
VALUES('${req.field_staff_salutation}', '${req.field_staff_firstname}', '${req.field_staff_middlename}', 
  '${req.field_staff_lastname}', '${req.field_staff_ssn}', '${req.field_staff_address_line1}', 
  '${req.field_staff_address_line2}', '${req.field_staff_address_line3}', 
  '${req.field_staff_zipcode}', '${req.field_staff_county}', '${req.field_staff_city}', 
  '${req.field_staff_state}', '${req.field_staff_phone_primary}', 
  '${req.field_staff_phone_alternate}', '${req.field_staff_email_id_personal}', 
  '${req.field_staff_email_id_official}', '${req.field_staff_office_address}')`);
};

const selectLatestID = () => {
  return route.query(`select last_insert_id() as lastInsertedId`);
};

const updateFSRes = (empId, field_staff_email_id_official, lastInsertedId) => {
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
    '${req.field_staff_empId}'`
  );
};


const insertPropertyDetails = (req) => {
  return route.query(`insert into property (property_type)
  values ('${req.property_type}')`)
}

const updatePropRes = (propId, lastInsertedId) => {
  return route.query(`UPDATE home_inspection.property SET 
    property_identifier='${propId}' WHERE property_id=${lastInsertedId}`);
};

const deletePropertyDetails = (req) => {
  return route.query(`UPDATE home_inspection.property SET 
    property_status='Deleted' WHERE property_identifier='${req.property_identifier}'`);
};

const fetchAllProperties = () => {
  return route.query(`select * from home_inspection.property where property_status = 'Active'`);
};


const insertService = (req) => {
  return route.query(`insert into service_categories (service_name) values ('${req.service_name}')`)
}

const updateServiceRes = (serviceId, lastInsertedId) => {
  return route.query(`UPDATE home_inspection.service_categories SET 
    service_identifier='${serviceId}' WHERE service_id=${lastInsertedId}`);
};


const fetchAllServices = () => {
  return route.query(`select * from home_inspection.service_categories 
  where service_status = 'Active' order by date_added`);
};


const deleteService = (req) => {
  return route.query(`UPDATE home_inspection.service_categories SET 
    service_status='Deleted' WHERE service_identifier='${req.service_identifier}'`);
};


const fetchServiceDetailsByID = (req) => {
  return route.query(
    `select * from home_inspection.service_categories where service_identifier='${req.service_identifier}'`
  );
};

const insertServiceDetails = (req) => {
  return route.query(
    `UPDATE home_inspection.service_categories SET 
    service_description='${req.description}', service_spaces = '${req.spaces}',
    service_components= '${req.components}' 
    WHERE service_identifier='${req.service_identifier}'`
  );
};


const insertServiceCost = (req) => {
  return route.query(
    `UPDATE home_inspection.service_categories SET 
    service_cost='${req.cost}'
    WHERE service_identifier='${req.service_identifier}'`
  );
};


const fetchServiceCostByID = (req) => {
  return route.query(
    `select * from home_inspection.service_categories where service_identifier='${req.service_identifier}'`
  );
};



module.exports.insertFSDetails = insertFSDetails;
module.exports.selectLatestID = selectLatestID;
module.exports.updateFSRes = updateFSRes;
module.exports.fetchAllFSDetails = fetchAllFSDetails;
module.exports.fetchFSDetailsByID = fetchFSDetailsByID;
module.exports.insertPropertyDetails = insertPropertyDetails;
module.exports.updatePropRes = updatePropRes;
module.exports.deletePropertyDetails = deletePropertyDetails;
module.exports.fetchAllProperties = fetchAllProperties;
module.exports.updateServiceRes = updateServiceRes;
module.exports.insertService = insertService;
module.exports.fetchAllServices = fetchAllServices;
module.exports.deleteService = deleteService;
module.exports.fetchServiceDetailsByID = fetchServiceDetailsByID;
module.exports.insertServiceDetails = insertServiceDetails;
module.exports.insertServiceCost = insertServiceCost;
module.exports.fetchServiceCostByID = fetchServiceCostByID;