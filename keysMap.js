const assignmentKeys = {
    assignment_id: "assignmentId",
    assignment_identifier: "assignmentIdentifier",
    assignment_status: "assignmentStatus",
    status_code: "statusCode",
    field_staff_assigned_fk: "fieldStaffAssigned",
    assignment_date: "assignmentDate",
    assignment_time_slot: "assignmentTimeSlot",
    assignment_time: "assignmentTime",
    name: "name",
    phone: "phone",
    property_address: "propertyAddress",
    city: "city",
    state: "state",
    code: "code",
    property_location: "propertyLocation",
    property_ownership: "propertyOwnership",
    contact_address_location: "contactAddressLocation",
    "service_id_fk": "serviceID",
    "property_id_fk": "propertyID",
    rating_provided: "ratingProvided",
    "date_added": "dateAdded",
    assignment_date_MS: "assignmentDateMS",
};


const fieldStaffKeys = {
    "field_staff_id": "FSId",
    "field_staff_empId": "FSEmpId",
    "field_staff_salutation": "FSSalutation",
    "field_staff_firstname": "FSFirstName",
    "field_staff_middlename": "FSMiddleName",
    "field_staff_lastname": "FSLastName",
    "field_staff_ssn": "FSSSN",
    "field_staff_address_line1": "FSAddressLine1",
    "field_staff_address_line2": "FSAddressLine2",
    "field_staff_address_line3": "FSAddressLine3",
    "field_staff_zipcode": "FSZipCode",
    "field_staff_county": "FSCounty",
    "field_staff_city": "FSCity",
    "field_staff_state": "FSState",
    "field_staff_phone_primary": "FSPhonePrimary",
    "field_staff_phone_alternate": "FSPhoneAlternate",
    "field_staff_email_id_personal": "FSEmailIdPersonal",
    "field_staff_email_id_official": "FSEmailIdOfficial",
    "field_staff_office_address": "FSOfficeAddress",
    "field_staff_time_slot": "FSTimeSlot",
    "field_staff_location": "FSLocation",
    "field_staff_avg_rating": "FSAvgRating",
    "field_staff_assignment_inprogress": "FSAssignmentInProgress",
    "field_staff_assignment_declined": "FSAssignmentDeclined",
    "field_staff_assignment_pending": "FSAssignmentPending",
    "field_staff_assignment_completed": "FSAssignmentCompleted"
}

const propertyKeys = {
    "property_id": "propertyId",
    "property_identifier": "propertyIdentifier",
    "property_type": "propertyType",
    "property_status": "propertyStatus",
    "date_added": "dateAdded"
}


const serviceKeys = {
    "service_id": "serviceId",
    "service_identifier": "serviceIdentifier",
    "service_name": "serviceName",
    "service_description": "serviceDescription",
    "service_spaces": "serviceSpaces",
    "service_components": "serviceComponents",
    "service_cost": "serviceCost",
    "service_status": "serviceStatus",
    "date_added": "dateAdded"
}

module.exports.assignmentKeys = assignmentKeys;
module.exports.fieldStaffKeys = fieldStaffKeys;
module.exports.propertyKeys = propertyKeys;
module.exports.serviceKeys = serviceKeys;