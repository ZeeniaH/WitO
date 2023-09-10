import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { HiredBookKeeperListResults } from "../../userComponents/manage-hired-bookkeepers/Manage-BookKeeper-list-results";
import { ManageBookKeeperListToolbar } from "../../userComponents/manage-hired-bookkeepers/Manage-BookKeeper-list-toolbar";
import Header from "../../userComponents/Header";
import { useParams } from "react-router-dom";

const HiredBookKeepers = () => {
    const [hiredBookKeeperQuery, setHiredBookKeeperQuery] = useState();
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
                            <ManageBookKeeperListToolbar setBookKeeperQuery={setHiredBookKeeperQuery} companyId={params.id} />
                            <Box sx={{ mt: 3 }}>
                                <HiredBookKeeperListResults hiredBookKeeperQuery={hiredBookKeeperQuery} companyId={params.id} />
                            </Box>
                        </Container>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default HiredBookKeepers;
