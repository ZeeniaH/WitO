const socketIo = require('socket.io');
// const cors = require('cors');

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('newAppointment', (appointmentData) => {
      const newAppointmentNotification = {
        message: 'New appointment created',
        companyName: appointmentData.selectCompany,
        modifiedBy: appointmentData.modifiedBy,
        timestamp: new Date().toISOString(),
        companyId: appointmentData.companyId,
      };
      // console.log('New appointment created:', newAppointmentNotification);
      io.emit('newAppointmentNotification', newAppointmentNotification);
    });

    socket.on('editAppointment', (appointmentData) => {
      const updatedAppointmentNotification = {
        message: 'Appointment Status is updated',
        companyName: appointmentData.selectCompany,
        modifiedBy: appointmentData.modifiedBy,
        timestamp: new Date().toISOString(),
        companyId: appointmentData.companyId,
      };
      // console.log('Updated Appointment:', updatedAppointmentNotification),
      io.emit('updatedAppointmentNotification', updatedAppointmentNotification);
    });

    socket.on('workerFileUpload', (fileEventData) => {
      const newFileNotification = {
        message: `New file uploaded by worker`,
        fileName: fileEventData.fileName,
        companyName: fileEventData.companyName,
        uploadedBy: fileEventData.uploadedBy,
        timestamp: new Date().toISOString(),
        companyId: fileEventData.companyId,
      };
      // console.log('New file uploaded by Worker:', newFileNotification);
      io.emit('newFileUploadedNotification', newFileNotification);
    });

    socket.on('companyShareFile', (fileEventData) => {
      const newFileNotification = {
        message: 'File share by company',
        uploadedBy: fileEventData.uploadBy,
        fileName: fileEventData.fileName,
        timestamp: new Date().toISOString(),
        companyId: fileEventData.companyId,
      };
      // console.log('File Share by company:', newFileNotification);
      io.emit('fileShareNotification', newFileNotification);
    });

    socket.on('workerTrackTimeEdited', (notificationData) => {
      const newFileNotification = {
        message: 'update track time',
        modifiedBy: notificationData.modifiedBy,
        timestamp: new Date().toISOString(),
        companyId: notificationData.companyId,
      };
      // console.log('track time modified:', newFileNotification);
      io.emit('trackTimeNotification', newFileNotification);
    });

    socket.on('newDocumentUploaded', (fileEventData) => {
      const newDocumentNotification = {
        message: 'New document uploaded to archive',
        uploadedBy: fileEventData.uploadedBy,
        fileName: fileEventData.fileName,
        timestamp: new Date().toISOString(),
        companyId: fileEventData.companyId,
      };
      // console.log('New document uploaded:', newDocumentNotification);
      io.emit('newDocumentUploadedNotification', newDocumentNotification);
    });

    socket.on('documentScanned', (fileEventData) => {
      const scannedDocumentNotification = {
        message: 'New document scanned and uploaded to archive',
        fileName: fileEventData.fileName,
        scannedBy: fileEventData.scannedBy,
        timestamp: new Date().toISOString(),
        companyId: fileEventData.companyId,
      };
      // console.log('New document scanned:', scannedDocumentNotification);
      io.emit('documentScannedNotification', scannedDocumentNotification);
    });

    socket.on('newFolderCreated', (fileEventData) => {
      const folderCreatedNotification = {
        message: 'New folder created',
        folderName: fileEventData.folderName,
        createdBy: fileEventData.createdBy,
        timestamp: new Date().toISOString(),
        companyId: fileEventData.companyId,
      };
      // console.log('New Folder created:', folderCreatedNotification);
      io.emit('folderCreatedNotification', folderCreatedNotification);
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIo,
};
