const workerFileModel = (uid, workerId, companyId, parent, data, name, url, path) => {
    const model = {
        createdAt: new Date(),
        createdBy: uid,
        data: data,
        workerId: workerId,
        companyId: companyId,
        name: name,
        parent: parent,
        updatedAt: new Date(),
        url: url,
        path: path,
    };
    return model;
};

export default workerFileModel;