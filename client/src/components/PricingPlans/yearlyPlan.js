import React, { useState } from 'react';
import styles from "./pricePlans.module.scss";
import { Box, Button, Typography, ListItem, Card, CardActions, CardContent, CardHeader, CssBaseline, Grid, GlobalStyles, Container, ListItemIcon } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const tiers = [
    {
        title: "Free",
        price: "49",
        description: ["Cras sodales lobortis erat", "Vitae pellentesque diam", "Consequat eted tempus"],
        buttonText: "sign up today",
        buttonVariant: "outlined",
    },
    {
        title: "Small Business",
        price: "99",
        description: ["Aliquet diam gravida", "Phasellus eu condimentum", "Metus non venenatis turpis"],
        buttonText: "sign up today",
        buttonVariant: "outlined",
    },
    // {
    //     title: "Professional",
    //     price: "219",
    //     description: ["Donec enim nulla malesuada", "Sed venenatis vel, blandit vel", "Duis ultricies scelerisque"],
    //     buttonText: "sign up today",
    //     buttonVariant: "outlined",
    // },
    {
        title: "Enterprise",
        price: "419",
        description: ["usto id molestie", "Nullam sodales justo fringilla", "Donec molestie neque urna"],
        buttonText: "sign up today",
        buttonVariant: "outlined",
    },
];
function monthlyPlan() {
    return (
        <>
            <React.Fragment>
                <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }} />
                <CssBaseline />
                {/* End hero unit */}
                <Container className={styles.pricePlanSection} sx={{
                    backgroundImage: 'url("/images/Group 1.png")'
                }} maxWidth="md" component="main">
                    <Grid sx={{ alignItems: "stretch" }} container spacing={0} alignItems="flex-end">
                        {tiers.map((tier) => (
                            // Enterprise card is full width at sm breakpoint
                            <Grid
                                sx={{
                                    marginBottom: {
                                        xs: "30px",
                                        md: "unset"
                                    },
                                }}
                                item
                                key={tier.title}
                                xs={12}
                                sm={6}
                                md={4}
                            >
                                <Card className={styles.cardMain} sx={{
                                    py: "50px",
                                    marginBottom: {
                                        xs: "30px",
                                        md: "unset"
                                    },
                                }}>
                                    <CardHeader
                                        // subheader={tier.title === "Professional" ? <Box sx={{ background: "orange", p: "5px", color: "#fff" }}>{tier.subheader}</Box> : null}
                                        title={tier.title}
                                        titleTypographyProps={{ align: "center", fontSize: "18px" }}
                                        subheaderTypographyProps={{
                                            align: "center",
                                        }}

                                    />
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "baseline",
                                                mb: 2,
                                            }}
                                        >
                                            <Typography variant="h4" color="text.secondary">
                                                $
                                            </Typography>
                                            <Typography
                                                component="h1"
                                                variant="h1"
                                                color="text.primary"
                                            >
                                                {tier.price}
                                            </Typography>
                                            <Typography variant="h6" color="text.secondary">
                                                /year
                                            </Typography>
                                        </Box>
                                        <ul style={{ padding: "0", }}>
                                            {tier.description.map((line) => (
                                                <ListItem key={line}>
                                                    <ListItemIcon sx={{ mr: "5px" }}>
                                                        <CheckCircleOutlineIcon style={{ color: '#1976D2' }} />
                                                    </ListItemIcon>
                                                    <Typography component="span" variant="subtitle1" align="center">
                                                        {line}
                                                    </Typography>
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardActions sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}>
                                        <Button className={styles.cardButton} variant={tier.buttonVariant}>
                                            {tier.buttonText}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </React.Fragment ></>
    )
}

export default monthlyPlan