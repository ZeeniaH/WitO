import React from 'react'
import { Box, Container, Grid } from '../../../node_modules/@mui/material/index'

function index() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <>

            <Box sx={{ p: "40px", height: "100vh", }}>
                <Container>
                    <Box >
                        <Box sx={{ backgroundColor: "#fff", textAlign: "center", p: "20px", borderRadius: "20px", maxWidth: "450px", m: "auto" }}>
                            <Box >
                                <a>
                                    <img style={{ borderRadius: "50px" }}
                                        src={user?.user?.avatar}
                                        alt="images"
                                        width={"100px"}
                                        height={"100px"}
                                    ></img>
                                </a>
                            </Box>

                            <Box sx={{ m: "10px auto" }} component={"h4"}>{user?.user?.name} ({user?.user?.role})</Box>

                            <Box sx={{ mb: "10px" }} component={"p"}>{user?.user?.email}</Box>

                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export default index