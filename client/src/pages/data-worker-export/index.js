import React from 'react'
import { Box, Container, Button } from '../../../node_modules/@mui/material/index'
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Layout from "../../pwa-layout"

function index() {
    return (
        <>
            <Layout />
            <Box sx={{ textAlign: "center" }}>
                <Container maxWidth="sm">
                    <Box sx={{ pb: "40px" }}>
                        <Box component="h2">Export data to worker</Box>
                    </Box>
                    <Box sx={{ pb: "20px" }}>
                        <Button sx={{ p: "15px" }} variant="contained" component="label" startIcon={<AddIcon />}>
                            Upload from device
                            <input hidden accept="image/*" multiple type="file" />
                        </Button>
                    </Box>
                    <Box>
                        <Button sx={{ p: "15px" }} variant="outlined" component="label" startIcon={<FileUploadIcon />}>
                            Upload from archive
                            <input hidden accept="image/*" multiple type="file" />
                        </Button>
                    </Box>

                </Container>
            </Box></>
    )
}

export default index