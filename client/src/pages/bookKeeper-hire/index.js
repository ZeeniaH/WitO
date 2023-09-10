import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { BookKeeperListResults } from "../../userComponents/BookKeeper/BookKeeper-list-results";
import { BookKeeperListToolbar } from "../../userComponents/BookKeeper/BookKeeper-list-toolbar";
import Header from "../../userComponents/Header";
import { useParams } from "react-router-dom";

const HireBookKeeper = () => {
    const [bookKeeperQuery, setBookKeeperQuery] = useState();
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
                            <BookKeeperListToolbar setBookKeeperQuery={setBookKeeperQuery} companyId={params.id}  />
                            <Box sx={{ mt: 3 }}>
                                <BookKeeperListResults bookKeeperQuery={bookKeeperQuery} companyId={params.id} />
                            </Box>
                        </Container>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default HireBookKeeper;
