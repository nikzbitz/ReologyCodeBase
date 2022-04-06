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


const AssignStatusUpdateSuccessRes = {
  status: 200,
  message: "Assignment status has been udpated successfully",
}

module.exports.modifyKeys = modifyKeys;
module.exports.AssignStatusUpdateSuccessRes = AssignStatusUpdateSuccessRes;

