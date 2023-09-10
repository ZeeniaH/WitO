import React, { useState } from "react";
import { Box, Container, Grid, Button } from "@mui/material";
import DataWorkerExport from "../../userComponents/DataWorkerExport/DataWorkerExport";
import CompanyExportData from "../../userComponents/CompanyExportData/CompanyExportData";
import Header from "../../userComponents/Header";
import WorkerAsideBar from "../../userComponents/Worker/WorkerAsideBar";
import { useParams } from "react-router-dom";
import useGoBack from '../../hooks/useGoBack';
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const WorkerUser = () => {
    const [showDataWorkerExport, setShowDataWorkerExport] = useState(true);
    const params = useParams();
    console.log(params)
    const { t } = useTranslation();
    const handleSwitchButton = () => {
        setShowDataWorkerExport(!showDataWorkerExport);
    };

    return (
        <>
            <Header />
            <Grid position="relative" container spacing={2}>
                <Grid
                    item
                    xs={"auto"}
                    sx={{
                        position: {
                            md: "static",
                            xs: "absolute",
                        },
                        left: "0",
                        top: "0",
                        zIndex: "2",
                        height: {
                            xs: "100%",
                            md: "unset",
                        },
                    }}
                >
                    <WorkerAsideBar companyId={params.companyId} />
                </Grid>
                <Grid item xs>
                    <Box sx={{ mt: "20px" }}>

                        <Container
                            sx={{
                                paddingLeft: {
                                    xs: "80px",
                                    md: "16px",
                                },
                            }}
                            maxWidth={false}
                        >
                            <Box>
                                <Button
                                    sx={{ fontSize: "12px", mb: "10px" }}
                                    variant="outlined"
                                    onClick={useGoBack}
                                    startIcon={<ArrowBackIcon />}
                                >
                                    {t('Back')}
                                </Button>
                            </Box>
                            <Button onClick={handleSwitchButton} variant="contained" color="primary">
                                {showDataWorkerExport ? "Switch to Company Export" : "Switch to Data Worker Export"}
                            </Button>
                            <Box sx={{ mt: 3 }}>
                                {showDataWorkerExport ? <DataWorkerExport /> : <CompanyExportData />}
                            </Box>
                        </Container>

                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default WorkerUser;
