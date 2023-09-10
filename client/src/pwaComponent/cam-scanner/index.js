import React from 'react'
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Box } from '../../../node_modules/@mui/material/index';
import Layout from "../../pwa-layout"


function index() {
    return (
        <>
            <Layout />
            <Box sx={{ display: "flex", justifyContent: "center", p: "80px" }}>
                <Camera />
            </Box>
        </>
    )
}

export default index