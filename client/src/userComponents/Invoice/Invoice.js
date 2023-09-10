import React, { useState, useEffect } from 'react'
import styles from './Invoice.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { toCommas } from '../../utils/utils'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { makeStyles } from '@mui/styles';
import { Button, Chip, Container, TextField, FormHelperText, Grid, Box, Table, TableBody, TableHead, Divider, Avatar, InputBase, Paper, TableRow, TableContainer, TableCell, FormControl, InputLabel, Select, MenuItem, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/lab/Autocomplete';
import SaveIcon from '@mui/icons-material/Save';
import { initialState } from '../../initialState'
import currencies from '../../currencies.json'
import { createInvoice, getInvoice, updateInvoice } from '../../redux/actions/invoiceActions';
import { getClientsByUser } from '../../redux/actions/clientActions'
import AddClient from './AddClient';
import InvoiceType from './InvoiceType';
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { BASE_URL } from 'config'
import { setLoading } from 'redux/actionCreators/loadingActionCreators'
import ReactSelectMui from "utils/ReactSelectMui";
import Header from "../Header"
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from "react-toastify";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    large: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },
    table: {
        minWidth: 650,
    },

    headerContainer: {
        // display: 'flex'
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(1),
    },
    inputRoot: {
        padding: '3px !important', // Add padding to the parent element
    },
}));

const Invoice = () => {
    const [error, setError] = useState(false);
    const [companyClients, setCompanyClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState();
    const [selectedDropdownClient, setSelectedDropdownClient] = useState()
    const location = useLocation()
    const [invoiceData, setInvoiceData] = useState(initialState)
    const [rates, setRates] = useState(0)
    const [vat, setVat] = useState(0)
    const [currency, setCurrency] = useState(currencies[0].value)
    const [subTotal, setSubTotal] = useState(0)
    const [total, setTotal] = useState(0)
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const [client, setClient] = useState(null)
    const [type, setType] = useState('Invoice')
    const [status, setStatus] = useState('')
    const { id } = useParams()
    const clients = useSelector((state) => state.clients.clients)
    const { invoice } = useSelector((state) => state.invoices);
    const dispatch = useDispatch()
    const history = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const { t } = useTranslation();

    const [company, setCompany] = useState();
    const params = useParams();

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

    useEffect(() => {
        getTotalCount()
        // eslint-disable-next-line
    }, [location])

    const getTotalCount = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/invoices/count?searchQuery=${user?.user.id}`);
            //Get total count of invoice from the server and increment by one to serialized numbering of invoice
            setInvoiceData({ ...invoiceData, invoiceNumber: ((response.data) + 1).toString().padStart(3, '0') })
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        dispatch(getInvoice(id));
        // eslint-disable-next-line
    }, [id]);

    useEffect(() => {
        if (params.id) {
            getClientsByUser();
        }
    }, [params.id]);

    const getClientsByUser = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/clients/company-clients?searchQuery=${params.id}`
            );
            const json = await response.json();
            const data = json.data;
            setCompanyClients(
                data?.map((client) => ({
                    label: client.name,
                    value: client._id,
                }))
            );
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleSelectClientsDropdown = (selectedOption) => {
        setSelectedDropdownClient(selectedOption);
        setError(false);
    };

    useEffect(() => {
        if (selectedDropdownClient) {
            fetchClient(selectedDropdownClient.value);
        }
    }, [selectedDropdownClient])

    const fetchClient = async (clientId) => {
        dispatch(setLoading(true));
        const response = await fetch(`${BASE_URL}/clients/user?searchQuery=${clientId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await response.json();
        if (response.ok) {
            setSelectedClient(json.data);
        }
        dispatch(setLoading(false));
    };

    useEffect(() => {
        if (type === 'Receipt') {
            setStatus('Paid')
        } else {
            setStatus('Unpaid')
        }
    }, [type])

    const defaultProps = {
        options: currencies,
        getOptionLabel: (option) => option.label
    };

    const clientsProps = {
        options: clients,
        getOptionLabel: (option) => option.name
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleRates = (e) => {
        setRates(e.target.value)
        setInvoiceData((prevState) => ({ ...prevState, tax: e.target.value }))
    }

    const handleChange = (index, e) => {
        const values = [...invoiceData.items]
        values[index][e.target.name] = e.target.value
        setInvoiceData({ ...invoiceData, items: values })
    }

    useEffect(() => {
        //Get the subtotal
        const subTotal = () => {
            var arr = document.getElementsByName("amount");
            var subtotal = 0;
            if (arr && arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].value) {
                        subtotal += +arr[i].value;
                    }
                    setSubTotal(subtotal)
                }
            }
        }
        subTotal()
    }, [invoiceData])

    useEffect(() => {
        const total = () => {
            //Tax rate is calculated as (input / 100 ) * subtotal + subtotal 
            const overallSum = rates / 100 * subTotal + subTotal
            //VAT is calculated as tax rates /100 * subtotal
            setVat(rates / 100 * subTotal)
            setTotal(overallSum)
        }
        total()
    }, [invoiceData, rates, subTotal])


    const handleAddField = (e) => {
        e.preventDefault()
        if (invoiceData && invoiceData.items && invoiceData.items.length > 0) {
            setInvoiceData((prevState) => ({ ...prevState, items: [...prevState.items, { itemName: '', unitPrice: '', quantity: '', discount: '', amount: '' }] }))
        } else {
            setInvoiceData((prevState) => ({ ...prevState, items: [{ itemName: '', unitPrice: '', quantity: '', discount: '', amount: '' }] }))
        }
    }

    const handleRemoveField = (index) => {
        const values = invoiceData.items
        values.splice(index, 1)
        setInvoiceData((prevState) => ({ ...prevState, values }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClient) {
            toast.error("Select a client.");
            setError(true);
            return;
        }
        const requestBody = {
            ...invoiceData,
            subTotal: subTotal,
            total: total,
            vat: vat,
            rates: rates,
            currency: currency,
            dueDate: selectedDate,
            invoiceNumber: `${invoiceData.invoiceNumber < 100
                ? String(invoiceData.invoiceNumber).toString().padStart(3, '0')
                : String(invoiceData.invoiceNumber)
                }`,
            client: {
                name: selectedClient?.name,
                email: selectedClient?.email,
                phone: selectedClient?.phone,
                street: selectedClient?.street,
                zip: selectedClient?.zip,
                city: selectedClient?.city,
            },
            type: type,
            status: status,
            paymentRecords: [],
            creator: [user?.user.id],
            company: {
                name: company.companyName,
                logo: company.companyLogo,
                email: company.email,
                businessRegistration: company.businessRegistration,
                street: company.street,
                zip: company.zip,
                city: company.city,
                contactNo: company.contactNo,
                nameOfBank: company.nameOfBank,
                bic: company.bic,
                iban: company.iban,
                taxNumber: company.taxNumber,
            }
        };
        try {
            const response = await fetch(`${BASE_URL}/invoices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                const createdInvoice = await response.json();
                console.log("createdInvoice", createdInvoice);
                history(`/home/invoice-details/${createdInvoice._id}`);
            } else {
                console.error('Invoice creation failed.');
            }
        } catch (error) {
            console.error('An error occurred while creating the invoice:', error);
        }
    };

    const classes = useStyles()
    const [open, setOpen] = useState(false);
    const CustomPaper = (props) => {
        return <Paper elevation={3} {...props} />;
    };

    return (
        <>
            <Header />
            <ToastContainer autoClose={8000} />
            <div className={styles.invoiceLayout}>
                <form onSubmit={handleSubmit} className="mu-form">
                    <AddClient setOpen={setOpen} open={open} getClientsByUser={getClientsByUser} />
                    <Container className={classes.headerContainer}>
                        <Grid container justifyContent="space-between" >
                            <Grid sx={{ pl: "10px" }} item>
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
                                <Box className={styles.invoiceLeftSide} variant="body1" >
                                    {/* <Box ><AppRegistrationIcon fontSize="small" /></Box> */}
                                    <Box className={styles.invoiceLeftSideValue}>{company?.companyRegistrationNumber}</Box>
                                </Box>
                                <Box className={styles.invoiceLeftSide} variant="body1" >
                                    {/* <Box component={"h5"} className={styles.invoiceLeftTitle}><SignpostIcon fontSize="small" /></Box> */}
                                    <Box className={styles.invoiceLeftSideValue}>{company?.street}</Box>
                                </Box>
                                <Box className={styles.invoiceLeftSide} variant="body1" >
                                    {/* <Box component={"h5"} className={styles.invoiceLeftTitle}><LocationOnIcon fontSize="small" /></Box> */}
                                    <Box className={styles.invoiceLeftSideValue}>{company?.zip}, {company?.city}</Box>
                                </Box>
                                <Box>
                                    <Box sx={{ mb: "5px" }} className={styles.invoiceLeftSide} variant="body1" >
                                        {/* <Box > <EmailIcon fontSize="small" /></Box> */}
                                        <Box className={styles.invoiceLeftSideValue}>{company?.email}</Box>
                                    </Box>
                                    <Box className={styles.invoiceLeftSide} variant="body1" >
                                        {/* <Box><LocalPhoneIcon fontSize="small" /></Box> */}
                                        <Box className={styles.invoiceLeftSideValue}>{company?.contactNo}</Box>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item>
                                <InvoiceType type={type} setType={setType} />
                                {t("Invoice")} # :
                                {/* <div style={{
                                    marginTop: '15px',
                                    width: '100px',
                                    padding: '8px',
                                    display: 'inline-block',
                                    backgroundColor: '#f4f4f4',
                                    outline: '0px solid transparent'
                                }}
                                    onInput={e => {
                                        setInvoiceData({
                                            ...invoiceData, invoiceNumber: e.currentTarget.textContent
                                        })
                                    }}
                                >
                                    {invoiceData.invoiceNumber}
                                </div> */}
                                <input
                                    type="text"
                                    style={{
                                        marginTop: '15px',
                                        width: '100px',
                                        padding: '8px',
                                        display: 'inline-block',
                                        backgroundColor: '#f4f4f4',
                                        outline: '0px solid transparent',
                                        border: '1px none #ccc',
                                        marginLeft: '10px',
                                    }}
                                    value={invoiceData.invoiceNumber} // Bind the input value to the invoice number
                                    onChange={e => {
                                        setInvoiceData({
                                            ...invoiceData, invoiceNumber: e.target.value
                                        })
                                    }}
                                />
                            </Grid>
                        </Grid >
                    </Container>
                    <Divider />
                    <Container>
                        <Grid container justifyContent="space-between" style={{ marginTop: '20px', marginBottom: '15px' }} >
                            <Grid item style={{ width: '50%' }}>
                                <Container>
                                    <Typography variant="overline" style={{ color: 'gray', paddingRight: '3px', paddingBottom: "5px" }} >{t("Bill to")}</Typography>
                                    {client && (
                                        <>
                                            <Typography variant="subtitle2" >{client.name}</Typography>
                                            <Typography variant="body2" >{client.email}</Typography>
                                            <Typography variant="body2" >{client.phone}</Typography>
                                            <Typography variant="body2">{client.street}</Typography>
                                            <Typography variant="body2">{client.zip}</Typography>
                                            <Typography variant="body2">{client.city}</Typography>
                                            <Button color="primary" size="small" style={{ textTransform: 'none' }} onClick={() => setClient(null)}>Change</Button>
                                        </>
                                    )}
                                    <Box sx={{ my: "10px" }} style={client ? { display: 'none' } : { display: 'block' }}>
                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <ReactSelectMui
                                                    label="Select Client"
                                                    options={companyClients}
                                                    handleSelectDropdown={
                                                        handleSelectClientsDropdown
                                                    }
                                                    selectedDropdown={
                                                        selectedDropdownClient
                                                    }
                                                />
                                                {error && <p style={{ color: 'red' }}>{t("Select a client")}</p>}
                                            </Stack>
                                        </Grid>
                                    </Box>
                                    {!client &&
                                        <>
                                            <Grid item style={{ paddingBottom: '10px' }}>
                                                <Chip
                                                    avatar={<Avatar>+</Avatar>}
                                                    label={t("New Customer")}
                                                    onClick={() => setOpen(true)}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </>
                                    }
                                </Container>
                            </Grid>
                            <Grid item style={{ marginRight: 20, textAlign: 'right' }}>
                                <Typography variant="overline" style={{ color: 'gray' }} >{t("Date")}</Typography>
                                <Typography variant="body2" >{moment().format("MMM Do YYYY")}</Typography>
                                <Typography variant="overline" style={{ color: 'gray' }} >{t("Due Date")}</Typography>
                                <Typography variant="body2" >{selectedDate ? moment(selectedDate).format("MMM Do YYYY") : 'Sep 27th 2021'}</Typography>
                                <Typography variant="overline" >{t("Amount")}</Typography>
                                <Typography variant="h6" >{currency} {toCommas(total)}</Typography>
                            </Grid>
                        </Grid>
                    </Container>
                    <div>
                        <TableContainer component={Paper} className="tb-container">
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t("Item")}</TableCell>
                                        <TableCell>{t("Qty")}</TableCell>
                                        <TableCell>{t("Price")}</TableCell>
                                        <TableCell>{t("Disc")} (%)</TableCell>
                                        <TableCell>{t("Amount")}</TableCell>
                                        <TableCell>{t("Actions")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoiceData?.items?.map((itemField, index) => (
                                        <TableRow key={index}>
                                            <TableCell scope="row" style={{ width: '40%' }}> <InputBase style={{ width: '100%' }} outline="none" sx={{ ml: 1, flex: 1 }} type="text" name="itemName" onChange={e => handleChange(index, e)} value={itemField.itemName} placeholder={t("Item name or description")} /> </TableCell>
                                            <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="quantity" onChange={e => handleChange(index, e)} value={itemField.quantity} placeholder="0" /> </TableCell>
                                            <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="unitPrice" onChange={e => handleChange(index, e)} value={itemField.unitPrice} placeholder="0" /> </TableCell>
                                            <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="discount" onChange={e => handleChange(index, e)} value={itemField.discount} placeholder="0" /> </TableCell>
                                            <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="amount" onChange={e => handleChange(index, e)} value={(itemField.quantity * itemField.unitPrice) - (itemField.quantity * itemField.unitPrice) * itemField.discount / 100} disabled /> </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => handleRemoveField(index)}>
                                                    <DeleteOutlineRoundedIcon style={{ width: '20px', height: '20px' }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className={styles.addButton}>
                            <button onClick={handleAddField}>+</button>
                        </div>
                    </div>
                    <div className={styles.invoiceSummary}>
                        <div className={styles.summary}>{t("Invoice Summary")}</div>
                        <div className={styles.summaryItem}>
                            <p>{t("Sub total")}:</p>
                            <h4>{subTotal}</h4>
                        </div>
                        <div className={styles.summaryItem}>
                            <p>{t("VAT")}(%):</p>
                            <h4>{vat}</h4>
                        </div>
                        <div className={styles.summaryItem}>
                            <p>{t("Total")}</p>
                            <h4 style={{ color: "black", fontSize: "18px", lineHeight: "8px" }}>{currency} {toCommas(total)}</h4>
                        </div>
                    </div>
                    <div className={styles.toolBar}>
                        <Container >
                            <Grid sx={{ display: "flex", alignItems: "baseline" }} container >
                                <Grid item style={{ marginTop: '16px', marginRight: 10 }}>
                                    <TextField
                                        type="number"
                                        step="any"
                                        name="rates"
                                        id="rates"
                                        value={rates}
                                        onChange={handleRates}
                                        placeholder="e.g 10"
                                        label={t("Tax Rates(%)")}
                                    />
                                </Grid>
                                <Grid item style={{ marginRight: 10 }} >
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <DatePicker
                                            margin="normal"
                                            label={t("Due Date")}
                                            openTo="year"
                                            format="MM-DD-YYYY"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            renderInput={(params) => (
                                                <TextField {...params} />
                                            )}
                                            inputFormat="MM-DD-YYYY"
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item style={{ width: 240, marginRight: 10 }}>
                                    <Autocomplete
                                        {...defaultProps}
                                        id="debug"
                                        debug="true"
                                        renderInput={(params) => <TextField sx={{ margin: "0", }} {...params}
                                            label={t("Select currency")}
                                            margin="normal"
                                            InputProps={{
                                                ...params.InputProps,
                                                classes: {
                                                    root: classes.inputRoot,
                                                },
                                            }}
                                        />}
                                        value={currency.value}
                                        onChange={(event, value) => setCurrency(value.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Container>
                    </div>
                    <div className={styles.note}>
                        <h4>{t("Note/Payment Info")}</h4>
                        <textarea
                            style={{ border: 'solid 1px #d6d6d6', padding: '10px' }}
                            placeholder={t("Provide additional details or terms of service")}
                            onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                            value={invoiceData.notes}
                        />
                    </div>
                    <Grid container justifyContent="center">
                        <Button
                            variant="contained"
                            style={{ justifyContentContent: 'center' }}
                            type="submit"
                            color="primary"
                            size="large"
                            className={classes.button}
                            startIcon={<SaveIcon />}
                        >
                            {t("Save and Continue")}
                        </Button>
                    </Grid>
                </form>
            </div >
        </>
    )
}

export default Invoice