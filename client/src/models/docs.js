const docModel = (uid, companyId, name, path, parent) => {
  const model = {
    createdAt: new Date(),
    createdBy: uid,
    lastAccessed: new Date(),
    name: name,
    updatedAt: new Date(),
    path: path,
    parent: parent,
    companyId: companyId, // Add companyId property
  };
  return model;
};

export default docModel;