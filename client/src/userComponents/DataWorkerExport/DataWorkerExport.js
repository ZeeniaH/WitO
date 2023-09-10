import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, InputAdornment, TextField, SvgIcon } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from "react-router-dom";
import { database, storage } from 'API/firebase';
import { setLoading } from 'redux/actionCreators/loadingActionCreators';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import workerFileModel from 'models/workerFiles';
import IconButton from "@mui/material/IconButton";
import { Search as SearchIcon } from "../../icons/search";
import { useTranslation } from 'react-i18next'
import { BASE_URL } from 'config';
import socketIOClient from 'socket.io-client';

toast.configure();

function DataWorkerExport() {
    const { t } = useTranslation();
    const [documents, setDocuments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const params = useParams();
    const workerId = params.workerId;
    const companyId = params.companyId;

    useEffect(() => {
        fetchWorkerDocuments();
    }, []);

    const fetchWorkerDocuments = async () => {
        try {
            const snapshot = await database.workerFiles
                .where("data", "==", "byWorker")
                .where("workerId", "==", workerId)
                .where("companyId", "==", companyId)
                .get();
            const documentsData = snapshot.docs.map((doc) => {
                const documentId = doc.id;
                const documentData = doc.data();
                return { documentId, ...documentData };
            });
            setDocuments(documentsData);
        } catch (error) {
            console.error('Error fetching worker documents:', error);
        }
    };

    const openFile = (url) => {
        window.open(url, '_blank');
    };

    const dispatch = useDispatch();
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
            try {
                const storageRef = storage.ref();
                const fileRef = storageRef.child(file.name);
                const snapshot = await fileRef.put(file);
                const downloadURL = await snapshot.ref.getDownloadURL();

                const user = JSON.parse(localStorage.getItem('user'));
                const fileData = workerFileModel(
                    '9aHFbrXa0qTzytjnLfGnWcdyP313',
                    workerId,
                    companyId,
                    '',
                    'byCompany',
                    file.name,
                    downloadURL,
                    []
                );

                await database.workerFiles.add(fileData);
                console.log('File uploaded and data added to workerFiles collection');
                dispatch(setLoading(false));
                toast.success('File uploaded successfully!');

                // Call the createNotify API after successful file upload
                const notifyResponse = await fetch(`${BASE_URL}/notify/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.tokens.access.token}`,
                    },
                    body: JSON.stringify({
                        isRead: false,
                        message: "File shared by Company",
                        heading: "File Share",
                        icon: "file",
                        companyId: companyId,
                        workerId,
                    }),
                });
                const notifyJson = await notifyResponse.json();

                if (!notifyResponse.ok) {
                    console.error('Failed to create notification:', notifyJson.message);
                }

                // // Emit the companyShareFile event to Socket.io 
                // const fileEventData = {
                //     uploadBy: user.user.name,
                //     fileName: fileData.name,
                //     companyId
                // };
                // const socket = socketIOClient(`${BASE_URL}`);
                // socket.emit('companyShareFile', fileEventData);
            } catch (error) {
                console.error('Error uploading file or creating notification:', error);
                dispatch(setLoading(false));
                toast.error('Error uploading file or creating notification!');
            }
        }
    };

    const handleDelete = (documentId) => {
        dispatch(setLoading(true));
        database.workerFiles
            .doc(documentId)
            .delete()
            .then(() => {
                dispatch(setLoading(false));
                toast.success('Document deleted successfully!');
                // Remove the deleted document from the local state
                setDocuments((prevDocuments) =>
                    prevDocuments.filter((document) => document.documentId !== documentId)
                );
            })
            .catch((error) => {
                dispatch(setLoading(false));
                toast.error('Error deleting document!');
            });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredDocuments = documents.filter((document) =>
        document.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0px 10px 0px", flexDirection: {
                xs: "column",
                sm: "row"
            } }}>
                <Box>
                    <Box component="h2">{t('Share Data By Worker')}</Box>
                </Box>
                <Box >
                    <Button sx={{ p: "15px" }} variant="contained" component="label" startIcon={<FileUploadIcon />}>
                        {t('Send document to worker')}
                        <input hidden accept="image/*" multiple type="file" onChange={handleFileSelect} />
                    </Button>
                </Box>
            </Box>
            <Box sx={{ maxWidth: 300 }}>
                <TextField
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SvgIcon fontSize="small" color="action">
                                    <SearchIcon />
                                </SvgIcon>
                            </InputAdornment>
                        ),
                    }}
                    placeholder={t('Search')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </Box>
            <Grid container spacing={2} sx={{ p: "25px", justifyContent: "center" }}>
                {filteredDocuments.map((document) => (
                    <Grid
                        item
                        xs={6}
                        md={2}
                        onDoubleClick={() => openFile(document.url)}
                        onClick={(e) => {
                            if (e.currentTarget.classList.contains("text-white")) {
                                e.currentTarget.style.background = "#fff";
                                e.currentTarget.classList.remove("text-white");
                                e.currentTarget.classList.remove("shadow-sm");
                            } else {
                                e.currentTarget.style.background = "#017bf562";
                                e.currentTarget.classList.add("text-white");
                                e.currentTarget.classList.add("shadow-sm");
                            }
                        }}
                        sx={{
                            textAlign: "center",
                            p: "10px",
                            border: "1px solid #dee2e6",
                            maxWidth: "150px",
                            m: "25px 5px",
                            position: "relative",
                        }}
                        key={document.documentId}
                    >
                        {document.name.split(".")[document.name.split(".").length - 1].includes("png") ||
                            document.name.split(".")[document.name.split(".").length - 1].includes("jpg") ||
                            document.name.split(".")[document.name.split(".").length - 1].includes("jpeg") ||
                            document.name.split(".")[document.name.split(".").length - 1].includes("svg") ||
                            document.name.split(".")[document.name.split(".").length - 1].includes("gif") ? (
                            <PhotoSizeSelectActualIcon style={{ fontSize: "48px", color: "#5BA3B2" }} />
                        ) : document.name.split(".")[document.name.split(".").length - 1].includes("mp4") ||
                            document.name.split(".")[document.name.split(".").length - 1].includes("flv") ||
                            document.name.split(".")[document.name.split(".").length - 1].includes("avi") ||
                            document.name.split(".")[document.name.split(".").length - 1].includes("mov") ||
                            document.name.split(".")[document.name.split(".").length - 1].includes("wmv") ||
                            document.name.split(".")[document.name.split(".").length - 1].includes("3gp") ? (
                            <PhotoSizeSelectActualIcon style={{ fontSize: "48px", color: "#EE6C4D" }} />
                        ) : (
                            <PhotoSizeSelectActualIcon style={{ fontSize: "48px", color: "#3E96D6" }} />
                        )}

                        <Box
                            component={"p"}
                            sx={{
                                textAlign: "center",
                                mt: "10px",
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <IconButton
                                aria-label="delete"
                                onClick={() => handleDelete(document.documentId)}
                                sx={{
                                    color: "error.light",
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    mt: "4px"
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                        <Box
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                left: "0",
                                width: "100%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "12px",
                            }}
                        >
                            {document.name}
                        </Box>

                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default DataWorkerExport;
