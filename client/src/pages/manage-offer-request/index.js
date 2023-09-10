import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { OfferRequestListResults } from "../../userComponents/manage-offer-requests/OfferRequest-list-results";
import Header from "../../userComponents/Header";
import { useParams } from "react-router-dom";
import { OfferRequestListToolbar } from "../../userComponents/manage-offer-requests/OfferRequest-list-toolbar";


const OfferRequest = () => {
    const [offerRequestQuery, setOfferRequestQuery] = useState();
    const params = useParams();
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
                            maxWidth={false}
                        >
                            <OfferRequestListToolbar offerRequestQuery={offerRequestQuery} companyId={params.id} />
                            <Box sx={{ mt: 3 }}>
                                <OfferRequestListResults offerRequestQuery={offerRequestQuery} companyId={params.id} />
                            </Box>
                        </Container>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default OfferRequest;
