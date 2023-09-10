import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './dataExport.module.scss';
import Layout from '../../pwa-layout';
import { storage, database } from 'API/firebase';
import workerFileModel from 'models/workerFiles';
import { setLoading } from 'redux/actionCreators/loadingActionCreators';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from 'config';
import socketIOClient from 'socket.io-client';

toast.configure();

function Index() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileSelect = (event) => {
        const files = event.target.files;
        const updatedFiles = [...selectedFiles, ...files];
        if (updatedFiles.length > 10) {
            alert('Only 10 files can be uploaded at once.');
            return;
        }
        setSelectedFiles(updatedFiles);
        for (const file of files) {
            uploadFile(file);
        }
    };

    const uploadFile = async (file) => {
        if (file) {
            dispatch(setLoading(true));
            const storageRef = storage.ref();
            const fileRef = storageRef.child(file.name);
            try {
                const snapshot = await fileRef.put(file);
                const url = await snapshot.ref.getDownloadURL();

                const user = JSON.parse(localStorage.getItem('user'));
                const workerId = user?.user.id;
                const companyId = user?.user.companyId;

                const fileData = workerFileModel(
                    '9aHFbrXa0qTzytjnLfGnWcdyP313',
                    workerId,
                    companyId,
                    '',
                    'byWorker',
                    file.name,
                    url,
                    []
                );

                await database.workerFiles.add(fileData);

                // Create a notification after successful file upload
                const notifyResponse = await fetch(`${BASE_URL}/notify/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.tokens.access.token}`,
                    },
                    body: JSON.stringify({
                        isRead: false,
                        message: `By ${user.user.firstName}`,
                        heading: 'File Share',
                        icon: 'file-upload',
                        companyId,
                    }),
                });
                const notifyJson = await notifyResponse.json();

                if (!notifyResponse.ok) {
                    console.error('Failed to create notification:', notifyJson.message);
                }

                dispatch(setLoading(false));
                toast.success('File uploaded successfully!');
            } catch (error) {
                console.error('Error uploading file:', error);
                dispatch(setLoading(false));
                toast.error('Error uploading file!');
            }
        }
    };

    return (
        <>
            <Layout />
            <Box sx={{ pb: '40px' }}>
                <Box sx={{ maxWidth: '200px', m: 'auto', textAlign: 'center' }}>
                    <Box component={'h2'}>{t('Export data to company owner')}</Box>
                </Box>

                <Box className={styles.dataExportContent}>
                    <Box className={styles.dataExportButton}>
                        <Button
                            sx={{
                                width: '100%',
                                p: '0',
                                border: '1px solid #bbb5b5',
                                borderRadius: '25px',
                            }}
                            variant="outlined"
                            component="label"
                        >
                            <Box className={styles.fileSelect}>
                                <Box className={styles.fileSelectButton}>{t('Sick Certificate')}</Box>
                                <Box className={styles.fileSelectName}></Box>
                            </Box>
                            <input hidden accept="image/*" multiple type="file" onChange={handleFileSelect} />
                        </Button>
                    </Box>
                    <Box className={styles.dataExportButton}>
                        <Button
                            sx={{
                                width: '100%',
                                p: '0',
                                border: '1px solid #bbb5b5',
                                borderRadius: '25px',
                            }}
                            variant="outlined"
                            component="label"
                        >
                            <Box className={styles.fileSelect}>
                                <Box className={styles.fileSelectButton}>{t('Invoices')}</Box>
                                <Box className={styles.fileSelectName}></Box>
                            </Box>
                            <input hidden accept="image/*" multiple type="file" onChange={handleFileSelect} />
                        </Button>
                    </Box>
                    <Box className={styles.dataExportButton}>
                        <Button
                            sx={{
                                width: '100%',
                                p: '0',
                                border: '1px solid #bbb5b5',
                                borderRadius: '25px',
                            }}
                            variant="outlined"
                            component="label"
                        >
                            <Box className={styles.fileSelect}>
                                <Box className={styles.fileSelectButton}>{t('Documents')}</Box>
                                <Box className={styles.fileSelectName}></Box>
                            </Box>
                            <input hidden accept="image/*" multiple type="file" onChange={handleFileSelect} />
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Index;