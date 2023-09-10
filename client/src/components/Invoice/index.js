import { Box, Grid } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import {
    Divider,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextareaAutosize,
    TextField,
    Container,
    Typography,
    Input,
    Avatar,
    Stack,
    IconButton
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import AddIcon from "@mui/icons-material/Add";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Header from "../Header"
import { Button } from "../../../node_modules/@mui/material/index";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Doc from "./DocService";
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { Link } from "react-router-dom";
import styles from "./invoice.module.scss";
import ReactSelectMui from "utils/ReactSelectMui";



// third party
import { useDispatch } from "react-redux";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { BASE_URL } from "config";





const ariaLabel = { 'aria-label': 'description' };
function Index() {

    const date = new Date();

    const options = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    };

    const formattedDate = date.toLocaleDateString(undefined, options);

    const [company, setCompany] = useState();
    const params = useParams();


    const user = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [workers, setWorkers] = useState([]);
    const [selectedDropdownWorker, setSelectedDropdownWorker] = useState(null);
    const [workerDropdownError, setWorkerDropdownError] = useState(false);

    useEffect(() => {
        fetch(`${BASE_URL}/worker/workers/${params.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.tokens.access.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setWorkers(
                    data.map((worker) => ({
                        label: worker.name,
                        value: worker.id,
                    }))
                );
            });
    }, []);
    console.log(workers)

    const handleSelectWorkerDropdown = (selectedOption) => {
        setSelectedDropdownWorker(selectedOption);
        setWorkerDropdownError(false);
    };

    useEffect(() => {
        const fetchCompany = async () => {
            dispatch(setLoading(true));
            const response = await fetch(`${BASE_URL}/company/${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.tokens.access.token}`,
                },
            });
            const json = await response.json();
            if (response.ok) {
                setCompany(json);
            }
            dispatch(setLoading(false));
        };
        fetchCompany();
    }, []);

    const [value, setValue] = React.useState(dayjs("2014-08-18T21:11:54"));

    const handleChange = (newValue) => {
        setValue(newValue);
    };
    const [dueValue, setDueValue] = React.useState(
        dayjs("2014-08-18T21:11:54")
    );

    const handleDueChange = (newDueValue) => {
        setDueValue(newDueValue);
    };
    // const [role, setRole] = React.useState("");
    // const handleRoleChange = (event) => {
    //     setRole(event.target.value);
    // };
    const ref = useRef();

    const createPdf = (ref) => {
        console.log(ref);
        console.log(ref.current);
        Doc.createPdf(ref.current);
    };
    const price = '0.00 \u00A3';
    const [items, setItems] = useState([]);

    const handleAddItem = () => {
        setItems(prevItems => [...prevItems, {}]);
    };

    const handleItemChange = (event, index) => {
        const { value } = event.target;
        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index].Item = value;
            return updatedItems;
        });
    };
    const handleDescriptionChange = (event, index) => {
        const { value } = event.target;
        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index].description = value;
            return updatedItems;
        });
    };

    const handlePriceChange = (event, index) => {
        const { value } = event.target;
        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index].price = value;
            return updatedItems;
        });
    };

    const handleQuantityChange = (event, index) => {
        const { value } = event.target;
        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index].quantity = value;
            return updatedItems;
        });
    };
    return (
        <>
            <Header />

            <Box className={styles.invoiceSection} px={2} sx={{ overflowX: "auto" }} ref={ref}>
                <Box
                    sx={{
                        width: "796.8px",
                        margin: "auto",

                    }}
                >
                    <Box sx={{ p: "5px 30px 60px" }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                textAlign: "end",
                            }}
                        >
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", p: "20px 0" }}>
                            <Box>
                                <Box sx={{ display: "flex", mb: "15px" }}>
                                    <Box className={styles.companyImage}>
                                        <Avatar

                                            className={styles.companyAvatar}
                                            alt="Company"
                                            src={company?.companyLogo}
                                            variant="square"
                                        />
                                    </Box>
                                    <Box sx={{ ml: "10px", mt: "4px" }} className={styles.companyTitle}>
                                        <Box component={"h3"}>{company?.companyName}</Box>
                                    </Box>
                                </Box>
                                <Box className={styles.invoiceLeftSide} >
                                    <Box className={styles.invoiceLeftTitle}> TO : </Box>
                                    <Box className={styles.invoiceLeftSideValue}><Input placeholder="John" inputProps={ariaLabel} /></Box>
                                </Box>
                                <Box className={styles.invoiceLeftSide} >
                                    <Box className={styles.invoiceLeftTitle}> Contract : </Box>
                                    <Box className={styles.invoiceLeftSideValue}>{company?.contract}</Box>
                                </Box>
                                <Box className={styles.invoiceLeftSide} >
                                    <Box className={styles.invoiceLeftTitle}> Address : </Box>
                                    <Box className={styles.invoiceLeftSideValue}>{company?.address}</Box>
                                </Box>

                                <Box className={styles.invoiceLeftSide} variant="body1" gutterBottom>
                                    <Box className={styles.invoiceLeftTitle}> <EmailIcon fontSize="small" /></Box>
                                    <Box className={styles.invoiceLeftSideValue}>{company?.email}</Box>
                                </Box>
                                <Box className={styles.invoiceLeftSide} variant="body1" gutterBottom>
                                    <Box className={styles.invoiceLeftTitle}><LocalPhoneIcon fontSize="small" /></Box>
                                    <Box className={styles.invoiceLeftSideValue}>{company?.contactNo}</Box>
                                </Box>
                            </Box>
                            <Box sx={{ mt: "48px" }}>
                                <Box sx={{ pb: "8px", fontSize: "18px", fontWeight: "bold" }} component={"p"}> Invoice</Box>
                                <Box className={styles.invoiceRight} >
                                    <Box className={styles.invoiceRightTitle} >Invoice # :</Box>
                                    <Box className={styles.invoiceLeftSideValue}><Input id="idNumber" type="tel" placeholder="INV-3694" inputProps={ariaLabel} /></Box>
                                </Box>
                                <Box className={styles.invoiceRight}>
                                    <Box className={styles.invoiceRightTitle} >Date :</Box>
                                    <Box className={styles.invoiceLeftSideValue}>{formattedDate.replace(/\//g, '-')}</Box>
                                </Box>
                                <Box className={styles.invoiceRight} >
                                    <Box className={styles.invoiceRightTitle} >Status:</Box>
                                    <Box className={styles.invoiceLeftSideValue}><Input id="status" type="text" placeholder="Status" inputProps={ariaLabel} /></Box>
                                </Box>
                            </Box>
                        </Box>
                        <Divider />
                        <Box sx={{ p: "30px 0", maxWidth: "100ch" }}>
                            <FormControl fullWidth>
                                <Stack spacing={1}>
                                    <ReactSelectMui
                                        label="Select Worker"
                                        options={workers}
                                        handleSelectDropdown={
                                            handleSelectWorkerDropdown
                                        }
                                        selectedDropdown={
                                            selectedDropdownWorker
                                        }
                                    />
                                    {workerDropdownError && (
                                        <FormHelperText
                                            error
                                            id="standard-weight-helper-text-selectWorker"
                                        >
                                            Please select a Worker
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </FormControl>
                        </Box>
                        <Divider />
                        <Box sx={{ mb: "30px", maxWidth: "100ch" }}>
                            <FormControl fullWidth>
                                <TextField
                                    id="outlined-input"
                                    label="Invoice Title"
                                    type="text"
                                />
                            </FormControl>
                        </Box>
                        <Box className={styles.tableSection}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead sx={{ backgroundColor: "#dbeefd", textAlign: "center" }}>
                                        <TableRow>
                                            <TableCell>Product or Service</TableCell>
                                            <TableCell align="center">
                                                Description
                                            </TableCell>
                                            <TableCell align="center">Price</TableCell>
                                            <TableCell align="center">
                                                Quantity
                                            </TableCell>
                                            <TableCell align="center">
                                                Line Total
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody sx={{ backgroundColor: "#f5fafe" }}>

                                        <TableRow >
                                            <TableCell >1</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>Services</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>$200</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>4</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>$800</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell >2</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>Polishing</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>$10</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>1</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>$10</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell >3</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>Oil Change</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>$300</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>1</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>$300</TableCell>
                                        </TableRow>


                                        {items.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    "&:last-child td, &:last-child th": {
                                                        border: 0,
                                                    },
                                                }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Box
                                                        sx={{
                                                            p: "5px 0",
                                                            maxWidth: "50ch",
                                                        }}
                                                    >
                                                        <FormControl fullWidth>

                                                            <FormControl>
                                                                <TextField
                                                                    id={`outlined-input-Item-${index}`}
                                                                    label="Add an Item"
                                                                    type="text"
                                                                    value={item.Item || ''}
                                                                    onChange={(event) => handleItemChange(event, index)}
                                                                />
                                                            </FormControl>
                                                        </FormControl>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <FormControl>
                                                        <TextField
                                                            id={`outlined-input-description-${index}`}
                                                            label="Description"
                                                            type="text"
                                                            value={item.description || ''}
                                                            onChange={(event) => handleDescriptionChange(event, index)}
                                                        />
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <FormControl>
                                                        <TextField
                                                            id={`outlined-input-price-${index}`}
                                                            label="Price"
                                                            type="number"
                                                            value={item.price || ''}
                                                            onChange={(event) => handlePriceChange(event, index)}
                                                        />
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <FormControl>
                                                        <TextField
                                                            id={`outlined-input-quantity-${index}`}
                                                            label="Quantity"
                                                            type="number"
                                                            value={item.quantity || ''}
                                                            onChange={(event) => handleQuantityChange(event, index)}
                                                        />
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align="center">{item.price || 0}</TableCell>
                                            </TableRow>
                                        ))}

                                        <TableRow >
                                            <TableCell colSpan={5} align="center">
                                                <IconButton onClick={handleAddItem}>
                                                    <AddIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={9}>
                                <Box sx={{ mt: "30px" }}>Add additional notes and payment information</Box>
                            </Grid>
                            <Grid item xs={3}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "30px" }}>
                                    <Box component={"h6"}>Sub Total</Box>
                                    <Box>
                                        $1110
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "30px" }}>
                                    <Box component={"h6"}>Tax(15%)</Box>
                                    <Box>
                                        $111
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "30px" }}>
                                    <Box component={"h6"}>Total</Box>
                                    <Box component={"h5"}>
                                        $1221
                                    </Box>
                                </Box>

                            </Grid>

                        </Grid>




                        <Box className="App">

                            <Box sx={{ display: "flex", justifyContent: "flex-start", pt: "30px", pb: "8px" }}>Terms <InfoOutlinedIcon sx={{ ml: "5px", fontSize: "20px", color: "cornflowerblue" }} /></Box>
                            <CKEditor
                                editor={ClassicEditor}
                                data="<p> Enter Specific terms for your customers, e.g. Payment is due within 21 days of issue.</p>"
                                onReady={editor => {

                                    //    console.log( 'Editor is ready to use!', editor );
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    //    console.log( { event, editor, data } );
                                }}
                                onBlur={(event, editor) => {
                                    //    console.log( 'Blur.', editor );
                                }}
                                onFocus={(event, editor) => {
                                    // console.log( 'Focus.', editor );
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box >
            <Container maxWidth="sm" >
                <Box sx={{ display: "flex", justifyContent: "end", mb: "30px" }}>
                    <Button
                        onClick={() => createPdf(ref)}
                        sx={{
                            backgroundColor: "#003462",
                            transition: "all 0.7s ease",
                            "&:hover": {
                                backgroundColor: "#3f856d",
                            },
                            color: "#ffff",
                        }}
                        className="selectTempTopButtons"
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                    >
                        Download
                    </Button>
                </Box>
            </Container>
        </>
    );
}

export default Index;
