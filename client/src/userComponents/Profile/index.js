import React, { useEffect, useState } from 'react'
import { Box, Container, Grid, LinearProgress, Typography, Button, Avatar } from '../../../node_modules/@mui/material/index'
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import ProfileSideBar from "../../userComponents/Profile/ProfileSideBar";
import Header from "../Header"
import { useTranslation } from 'react-i18next';
import { BASE_URL } from 'config';


function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}
LinearProgressWithLabel.propTypes = {

    value: PropTypes.number.isRequired,
};


function index({ }) {
    const [subscription, setSubscription] = useState()
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user)
    const [progress, setProgress] = React.useState(10);
    const { t } = useTranslation();

    useEffect(() => {
        getSubscriptionDetails();
    }, [])

    const getSubscriptionDetails = async () => {
        let subscriptionId = user.user.subscriptionId;
        if (subscriptionId) {
            await fetch(`${BASE_URL}/stripe/subscription/${subscriptionId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.tokens.access.token}`,
                },
            })
                .then((res) => res.json())
                .then(async (subscription) => {
                    setSubscription(subscription);
                });
        }
    }

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
                        '& .css-14eao2k-MuiDrawer-docked': {
                            boxShadow: "none",
                        }
                    }}
                >
                    <ProfileSideBar />
                </Grid>
                <Grid item xs>
                    <Box>
                        <Grid container sx={{
                            padding: {
                                xs: "20px 20px 20px 83px",
                                md: "20px 20px 20px 16px"

                            }
                        }} spacing={2}>
                            <Grid item xs={12}>

                                <Box >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: "5px", pr: "8px" }}>
                                        <Box >
                                            <Link to="/" >
                                                <Button sx={{ border: "none", color: "#000", pb: "10px" }} variant="outlined" startIcon={<ArrowBackIcon />}>
                                                    {t('Back')}
                                                </Button>
                                            </Link></Box>
                                        {/* <Box>
                                            <Link to={`/home/edit-profile/${user.user.id}`} style={{ textDecoration: 'none' }}>
                                                <Button sx={{ border: "none", pb: "10px", }} variant="contained" startIcon={<EditTwoToneIcon />}>
                                                    Edit Profile
                                                </Button>
                                            </Link>
                                        </Box> */}
                                    </Box>


                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6} >
                                            <Box sx={{ backgroundColor: "#fff", p: "20px", borderRadius: "20px", m: "auto", boxShadow: "0px 0px 12px 0px #d7d7d7;" }}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: {
                                                            xs: "column",
                                                            sm: "row"
                                                        }}}>
                                                            <Avatar alt="profile user" src={user?.user?.avatar} sx={{ width: 120, height: 120, mr: {
                                                                xs: 0,
                                                                sm: 3
                                                            } }} />
                                                            <Box sx={{
                                                                textAlign: {
                                                                    xs: "center",
                                                                    sm: "left"
                                                                }
                                                            }}>
                                                                <Box sx={{ color: "#5F357D", fontWeight: "bold" }} component={"h3"}>{user?.user?.name}</Box>
                                                                <Box sx={{ color: "#C2C2C2", lineHeight: "1", }} component={"p"}>{user?.user?.role}</Box>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item sm={6} md={6}>
                                                        <Box>
                                                            <Box sx={{ mt: "30px" }}>
                                                                <Box sx={{ color: "#C2C2C2", }} component={"p"}> {t('Contact Email')}</Box>
                                                                <Box sx={{wordBreak: "break-word"}}>{user.user.email}</Box>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item sm={6} md={3}>
                                                        <Box>
                                                            <Box sx={{ mt: "30px" }}>
                                                                <Box sx={{ color: "#C2C2C2", }} component={"p"}> {t('Phone Number')}</Box>
                                                                <Box>{user.user.phoneNumber}</Box>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        {
                                            user.user.role == "CompanyOwner" && (
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ backgroundColor: "#fff", p: "20px", borderRadius: "20px", m: "auto", boxShadow: "0px 0px 12px 0px #d7d7d7", height: "100%" }}>
                                                        <Grid container spacing={3}>
                                                            <Grid item sm={12}>
                                                                <Box>
                                                                    <Box sx={{ mt: "30px" }}>
                                                                        <Box sx={{ color: "#C2C2C2", }} component={"p"}>Price plan</Box>
                                                                        <Box>{subscription?.items.data[0].plan.product.name}</Box>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item sm={12}>
                                                                <Box>
                                                                    <Box sx={{ mt: "30px" }}>
                                                                        <Box sx={{ color: "#C2C2C2", }} component={"p"}>Features</Box>
                                                                        <Box>{subscription?.items.data[0].plan.product.metadata.features}</Box>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                            )
                                        }
                                    </Grid>

                                </Box>
                            </Grid>
                        </Grid>

                    </Box >
                </Grid >
            </Grid >
        </>
    )
}

export default index