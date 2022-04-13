const modifyKeys = (keysMap, obj) => {

  renameKeys = (keysMap, obj) =>
    Object.keys(obj).reduce(
      (acc, key) => ({
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] },
      }),
      {}
    );

  return renameKeys(keysMap, obj);

}

const formatDate = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}


const AssignStatusUpdateSuccessRes = {
  status: 200,
  message: "Assignment status has been udpated successfully",
}

module.exports.modifyKeys = modifyKeys;
module.exports.formatDate = formatDate;
module.exports.AssignStatusUpdateSuccessRes = AssignStatusUpdateSuccessRes;

