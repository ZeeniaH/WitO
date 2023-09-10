import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, styled, tableCellClasses, Button, Menu, MenuItem } from "@mui/material";
import { BASE_URL } from "config";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';




const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1890ff",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(name, email, phoneNumber, accountStatus, manage) {
    return { name, email, phoneNumber, accountStatus, manage };
}
const options = [
    { label: 'View', icon: <VisibilityIcon /> },
    { label: 'Hire', icon: <PersonAddIcon /> },
];
const HireBookKeeper = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/bookkeeper`, {
                    method: "GET",

                });
                const data = await response.json();
                console.log(data); // log the data
                const transformedData = data.results.map((row) =>
                    createData(row.name, row.email, row.phoneNumber, row.accountStatus, row.manage)
                );
                setRows(transformedData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);
    const user = JSON.parse(localStorage.getItem("user"));

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOptionClick = (option) => {
        console.log(option.label);
        handleClose();
    };
    return (
        <>
            <Grid position="relative" container spacing={2}>
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
                            <Box sx={{ display: "flex", justifyContent: "space-between", pb: "30px" }}>
                                <Box sx={{ fontWeight: "600", }} component={"h4"}>BookKeeper</Box>
                                <Box>  <Link to="/" >
                                    <Button variant="contained" startIcon={<ArrowBackIcon />}>
                                        Back
                                    </Button>
                                </Link></Box>
                            </Box>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>BookKeeper Name</StyledTableCell>
                                            <StyledTableCell >Email</StyledTableCell>
                                            <StyledTableCell >Phone Number</StyledTableCell>
                                            <StyledTableCell >Account Status</StyledTableCell>
                                            <StyledTableCell sx={{ textAlign: "end" }} >Manage</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.name}
                                                </StyledTableCell>
                                                <StyledTableCell >{row.email}</StyledTableCell>
                                                <StyledTableCell >{row.phoneNumber}</StyledTableCell>
                                                <StyledTableCell >{row.accountStatus}</StyledTableCell>
                                                <StyledTableCell >
                                                    <Box sx={{ display: "flex", justifyContent: "end", }} >
                                                        <Button aria-controls="dropdown-menu" aria-haspopup="true" onClick={handleClick}>
                                                            <MoreVertIcon sx={{ color: " rgba(0, 0, 0, 0.54)" }} />
                                                        </Button>
                                                        <Menu
                                                            id="dropdown-menu"
                                                            anchorEl={anchorEl}
                                                            keepMounted
                                                            open={Boolean(anchorEl)}
                                                            onClose={handleClose}
                                                        >
                                                            {options.map((option) => (
                                                                <MenuItem key={option.label} onClick={() => handleOptionClick(option)}>
                                                                    <Box sx={{
                                                                        minWidth: "36px",
                                                                        "& svg": {
                                                                            fontSize: "20px",
                                                                            color: "rgba(0, 0, 0, 0.54)"
                                                                        }
                                                                    }}>
                                                                        {option.icon}
                                                                    </Box>
                                                                    {option.label}

                                                                </MenuItem>
                                                            ))}
                                                        </Menu>
                                                    </Box>
                                                </StyledTableCell>

                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Container>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default HireBookKeeper;
