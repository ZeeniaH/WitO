import React, { useState, useEffect } from 'react';
import styles from "./UserCompanyOwnerData.module.scss";
import { Box, Grid, InputAdornment, TextField, SvgIcon } from '../../../node_modules/@mui/material/index';
import { database, storage } from 'API/firebase';
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import { setLoading } from 'redux/actionCreators/loadingActionCreators';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import IconButton from "@mui/material/IconButton";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from "@mui/icons-material/Delete";
import { Search as SearchIcon } from "../../icons/search";
import { useTranslation } from 'react-i18next'

function UserCompanyOwnerData() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user"));
    const companyId = user?.user.companyId;
    const workerId = user?.user.id;

    const [documents, setDocuments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchWorkerDocuments();
    }, []);

    const fetchWorkerDocuments = async () => {
        try {
            const snapshot = await database.workerFiles
                .where("data", "==", "byCompany")
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
            <Box sx={{ padding: "10px 30px", textAlign: "center" }}>
                <Box >
                    <Box component="h2">{t('Share Data By Company')}</Box>
                </Box>
            </Box>
            <Box sx={{ maxWidth: 250, m: "auto", }}>
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
                        md={6}
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
                            document.name.split(".")[document.name.split(".").length - 1].includes("mpeg") ? (
                            <VideoLibraryIcon style={{ fontSize: "48px", color: "#F47D02" }} />
                        ) : (
                            <PictureAsPdfIcon style={{ fontSize: "48px", color: "#F47D02" }} />
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
                                mb: "0"
                            }}
                        >
                            <Box sx={{ cursor: 'pointer', color: 'blue', textDecoration: "none", color: "#000" }}
                                onClick={() => openFile(document.url)}
                            >
                                {document.name}
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }} >
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
                    </Grid>
                ))}
            </Grid>

        </>
    );
}

export default UserCompanyOwnerData;
