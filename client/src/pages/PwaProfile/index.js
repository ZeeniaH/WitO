import React, { useEffect, useState } from "react";
import { Box, Container, Grid } from '@mui/material'
import Layout from "../../pwa-layout"
import styles from "./profile.module.scss";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import CakeIcon from '@mui/icons-material/Cake';
import HouseIcon from '@mui/icons-material/House';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BASE_URL } from "config";

export default function index() {
    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user"))
    const [trackTime, setTrackTime] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchTrackTime();
    }, [])


    function convertTimestampToHHMMSS(timestamp) {
        // Create a new Date object with the given timestamp
        let date = new Date(timestamp);

        // Get the components of the time
        let totalSeconds = Math.floor(date.getTime() / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        // Format the time
        let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return formattedTime;
    }

    const fetchTrackTime = async () => {
        dispatch(setLoading(true));
        const response = await fetch(`${BASE_URL}/trackTime/${user.user.id}/company/${user.user.companyId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.tokens.access.token}`,
            },
        });
        let json = await response.json();
        if (response.ok) {
            const updatedJson = json.map(item => ({
                ...item,
                timeTracked: convertTimestampToHHMMSS(item.timeTracked)
            }));
            setTrackTime(updatedJson);
        }
        dispatch(setLoading(false));
    };

    const calculateTotalTimeForLast30Days = () => {
        if (!trackTime.length) {
            return "00:00:00";
        }
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const totalTime = trackTime.reduce((total, item) => {
            const itemDate = new Date(item.startTime);
            if (itemDate >= thirtyDaysAgo && itemDate <= today) {
                const timeInSeconds = item.timeTracked.split(':')
                    .reduce((acc, timePart, index) => acc + parseInt(timePart) * Math.pow(60, 2 - index), 0);
                return total + timeInSeconds;
            }
            return total;
        }, 0);
        return convertTimestampToHHMMSS(totalTime * 1000);
    };
    // const calculateTotalTimeForLast7Days = () => {
    //     if (!trackTime.length) {
    //         return "00:00:00";
    //     }
    //     const today = new Date();
    //     const sevenDaysAgo = new Date();
    //     sevenDaysAgo.setDate(today.getDate() - 7);
    //     const totalTime = trackTime.reduce((total, item) => {
    //         const itemDate = new Date(item.startTime);
    //         if (itemDate >= sevenDaysAgo && itemDate <= today) {
    //             const timeInSeconds = item.timeTracked.split(':')
    //                 .reduce((acc, timePart, index) => acc + parseInt(timePart) * Math.pow(60, 2 - index), 0);
    //             return total + timeInSeconds;
    //         }
    //         return total;
    //     }, 0);
    //     return convertTimestampToHHMMSS(totalTime * 1000);
    // };

    return (
        <>
            <Layout />
            <Container className={styles.userProfile}>
                <Box sx={{ p: "0 20px" }}>
                    <Box >
                        <Box sx={{ display: "flex", alignItem: "center" }} >
                            <Box sx={{ width: "27%" }}>
                                <a>
                                    <img style={{ borderRadius: "50px" }}
                                        src={user?.user.staffPicture}
                                        alt="Staff Picture"
                                        width={"80px"}
                                        height={"80px"}
                                    ></img>
                                </a>
                            </Box>
                            <Box sx={{ width: "73%", my: "10px", color: "#fff", }}>
                                <Box component={"h4"}>{user?.user.firstName} {user?.user.lastName}</Box>
                                <Box sx={{ display: "flex", color: "#E0E9FF" }}>
                                    <Box sx={{ display: "flex", }}>
                                        <Box><EmailOutlinedIcon style={{ fontSize: 'medium', color: "#B0CBDC" }} /></Box>
                                        <Box sx={{ fontSize: "12px", ml: "3px", alignSelf: "center" }} >{user.user.email}</Box>
                                    </Box>
                                    <Box sx={{ display: "flex", ml: "5px" }}>
                                        <Box><CallOutlinedIcon style={{ fontSize: 'medium', color: "#B0CBDC" }} /></Box>
                                        <Box sx={{ fontSize: "12px", ml: "3px", alignSelf: "center" }} >{user?.user.phoneNumber}</Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box className={styles.informationSection} >
                    <Box sx={{ pb: "25px" }} component={"h2"}>
                        {t('Worker Information')}
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box className={styles.infoContent} >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box component={"h6"} className={styles.infoTitle}>Last 30 Days Tracked Time</Box>
                                    <Box className={styles.iconCircle} ><AccessTimeIcon style={{ fontSize: 'medium', color: "#0C0636" }} /></Box>
                                </Box>
                                <Box className={styles.infoText}>{calculateTotalTimeForLast30Days()}</Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box className={styles.infoContent} >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box component={"h6"} className={styles.infoTitle}>{t('Company Name')}</Box>
                                    <Box className={styles.iconCircle} ><ApartmentOutlinedIcon style={{ fontSize: 'medium', color: "blueviolet" }} /></Box>
                                </Box>
                                <Box className={styles.infoText}>{user?.user.selectCompany}</Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box className={styles.infoContent} >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box component={"h6"} className={styles.infoTitle}>{t('Name of Bank')}</Box>
                                    <Box className={styles.iconCircle} ><AccountBalanceOutlinedIcon style={{ fontSize: 'medium', color: "rgb(3,133,243)" }} /></Box>
                                </Box>
                                <Box className={styles.infoText}>{user?.user.nameOfBank}</Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} >
                            <Box className={styles.infoContent} >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box component={"h6"} className={styles.infoTitle}>{t('Tax ID')}</Box>
                                    <Box className={styles.iconCircle} ><HealthAndSafetyOutlinedIcon style={{ fontSize: 'medium', color: "rgb(255,161,106)" }} /></Box>
                                </Box>
                                <Box className={styles.infoText}>{user?.user.taxId}</Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box className={styles.infoContent} >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box component={"h6"} className={styles.infoTitle}>{t('Place of Birth')}</Box>
                                    <Box className={styles.iconCircle} ><CakeIcon style={{ fontSize: 'medium', color: "#DD8D19" }} /></Box>
                                </Box>
                                <Box className={styles.infoText}>{user?.user.placeOfBirth}</Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box className={styles.infoContent} >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box component={"h6"} className={styles.infoTitle}>{t('IBAN')}</Box>
                                    <Box className={styles.iconCircle} ><AccountBalanceWalletIcon style={{ fontSize: 'medium', color: "#0C0636" }} /></Box>
                                </Box>
                                <Box className={styles.infoText}>{user?.user.iban}</Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box className={styles.infoContent} >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box component={"h6"} className={styles.infoTitle}>{t('BIC')}</Box>
                                    <Box className={styles.iconCircle} ><ConfirmationNumberIcon style={{ fontSize: 'medium', color: "#0C0636" }} /></Box>
                                </Box>
                                <Box className={styles.infoText}>{user?.user.bic}</Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    )
}
