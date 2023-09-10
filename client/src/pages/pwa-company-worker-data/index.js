import React, { useState } from "react";
import { Box, Container, Grid, Button } from "@mui/material";
import DataWorkerExport from "../../pwaComponent/UserCompanyOwnerData/UserCompanyOwnerData";
import CompanyExportData from "../../pwaComponent/CompanyExportData/CompanyExportData";
import Layout from "../../pwa-layout";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const WorkerUser = () => {
    const [showDataWorkerExport, setShowDataWorkerExport] = useState(true);
    const params = useParams();

    const handleSwitchButton = () => {
        setShowDataWorkerExport(!showDataWorkerExport);
    };
    const { t } = useTranslation();

    return (
        <>
            <Layout />


            <Box sx={{ mt: "20px" }}>
                <Container>
                    <Box sx={{ display: "flex", justifyContent: "center" }} >
                        <Button onClick={handleSwitchButton} variant="contained" color="primary">
                            {showDataWorkerExport ? t("Switch to Company Export") : t("Switch to Worker Export")}
                        </Button></Box>
                    <Box sx={{ mt: 3 }}>
                        {showDataWorkerExport ? < DataWorkerExport /> : < CompanyExportData />}
                    </Box>
                </Container>
            </Box >

        </>
    );
};

export default WorkerUser;
