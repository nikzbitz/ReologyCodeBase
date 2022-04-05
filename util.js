const modifyResponse = (arr) => { 


const keysMap = {
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
  property_type: "propertyType",
  rating_provided: "ratingProvided",
};


renameKeys = (keysMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
    }),
    {}
  );

return arr.map((element) => {
    element.assignment_time = new Date(`${element.assignment_time}`).getTime();
  return renameKeys(keysMap, element);
});

}


module.exports.modifyResponse = modifyResponse;

// { firstName: 'Bobo', passion: 'Front-End Master' }
