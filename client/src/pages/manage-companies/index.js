import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { ManageCompanyListResults } from "../../userComponents/manage-companies/manage-companies-list-results";
import Header from "../../userComponents/Header";
import { ManageCompaniesListToolbar } from "../../userComponents/manage-companies/manage-companies-list-toolbar";


const ManageCompanies = () => {
    const [offerRequestQuery, setOfferRequestQuery] = useState();
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
                            <ManageCompaniesListToolbar />
                            <Box sx={{ mt: 3 }}>
                                <ManageCompanyListResults offerRequestQuery={offerRequestQuery} />
                            </Box>
                        </Container>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default ManageCompanies;
