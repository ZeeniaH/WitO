import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { initialState } from '../../initialState'
import { toCommas } from '../../utils/utils'
import styles from './InvoiceDetails.module.css'
import moment from 'moment'
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { Container, Grid, Box, Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import Spinner from '../Spinner/Spinner'
import Header from "../Header"
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Doc from "./DocService";
import { useTranslation } from 'react-i18next';
import Modal from '../Payments/Modal'
import PaymentHistory from './PaymentHistory'
import { BASE_URL } from 'config'

const InvoiceDetails = () => {
  const location = useLocation()
  const [invoiceData, setInvoiceData] = useState(initialState)
  const [rates, setRates] = useState(0)
  const [vat, setVat] = useState(0)
  const [currency, setCurrency] = useState('')
  const [subTotal, setSubTotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [client, setClient] = useState([])
  const [type, setType] = React.useState('')
  const [status, setStatus] = useState('')
  const [company, setCompany] = useState({})
  const { id } = useParams()
  const [invoice, setInvoice] = useState();
  const dispatch = useDispatch()
  const [downloadStatus, setDownloadStatus] = useState(null)
  // eslint-disable-next-line
  const user = JSON.parse(localStorage.getItem('user'))
  const { t } = useTranslation();

  const ref = useRef();
  const createPdf = (ref) => {
    console.log(ref);
    console.log(ref.current);
    Doc.createPdf(ref.current, invoiceData.invoiceNumber);
  };

  const generateFooter = () => {
    return (
      <div style={{ fontSize: '10px', marginTop: '20px' }}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "500px",
          margin: "auto",
        }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="caption">Tax Number: {company?.taxNumber}</Typography>
            <Typography sx={{ display: "flex", alignItems: "center", m: "5px 0" }} variant="caption">Email: {company?.email}</Typography>
            <Typography sx={{ display: "flex", alignItems: "center" }} variant="caption">Contact Number: {company?.contactNo}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="caption">Name of Bank: {company?.nameOfBank}</Typography>
            <Typography sx={{ m: "5px 0" }} variant="caption">IBAN: {company?.iban}</Typography>
            <Typography variant="caption">BIC: {company?.bic}</Typography>
          </Box>
        </Box>
      </div>
    );
  };

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
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(1),
      backgroundColor: '#f2f2f2',
      borderRadius: '10px 10px 0px 0px'
    }
  }));

  const classes = useStyles()

  useEffect(() => {
    fetchInvoice(id);
  }, [])

  const fetchInvoice = async (id) => {
    const response = await fetch(`${BASE_URL}/invoices/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (response.ok) {
      setInvoice(json);
    }
  };

  useEffect(() => {
  }, [id, dispatch, location]);

  useEffect(() => {
    if (invoice) {
      setInvoiceData(invoice)
      setRates(invoice.rates)
      setClient(invoice.client)
      setType(invoice.type)
      setStatus(invoice.status)
      setSelectedDate(invoice.dueDate)
      setVat(invoice.vat)
      setCurrency(invoice.currency)
      setSubTotal(invoice.subTotal)
      setTotal(invoice.total)
      setCompany(invoice.company)
    }
  }, [invoice])

  //Get the total amount paid
  let totalAmountReceived = 0
  for (var i = 0; i < invoice?.paymentRecords?.length; i++) {
    totalAmountReceived += Number(invoice?.paymentRecords[i]?.amountPaid)
  }

  const [open, setOpen] = useState(false)
  if (!invoice || downloadStatus == 'loading') {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <Header />
      <div style={{ position: "relative" }} className={styles.PageLayout}>
        {invoice?.creator?.includes(user?.user?.id || user?.result?.googleId) && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "30px" }}>
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
              {t("Download")}
            </Button>
          </Box>
        )}
        {invoice?.paymentRecords.length !== 0 && (
          <PaymentHistory paymentRecords={invoiceData?.paymentRecords} />
        )}
        <Modal open={open} setOpen={setOpen} invoice={invoice} />
        <div className={styles.invoiceLayout}>
          <Box ref={ref} sx={{width: "842px", paddingBottom: "40px"}}>
            <Container className={classes.headerContainer}>
              <Grid container justifyContent="space-between" style={{ padding: '30px 0px' }}>
                <img src={company?.logo} alt="Logo" className={styles.logo} />
                <Grid item style={{ marginRight: 40, textAlign: 'right' }}>
                  <Typography style={{ lineSpacing: 1, fontSize: 45, fontWeight: 700, color: 'gray' }} >{Number(total - totalAmountReceived) <= 0 ? 'Receipt' : type}</Typography>
                  <Typography variant="overline" style={{ color: 'gray' }} >{t("No")}: </Typography>
                  <Typography variant="body2">INV-{invoiceData?.invoiceNumber}</Typography>
                </Grid>
              </Grid >
            </Container>
            <Divider />
            <Container>
              <Grid container justifyContent="space-between" style={{ marginTop: '40px' }} >
                <Grid item>
                  {invoice?.creator?.includes(user?.user.id) && (
                    <Container style={{ marginBottom: '20px' }}>
                      <Typography variant="overline" style={{ color: 'gray' }} >{t("From")}</Typography>
                      <Typography variant="body2">
                        {/* <BusinessIcon fontSize="small" sx={{ marginRight: "5px" }} /> */}
                        {company?.name}
                      </Typography>
                      <Typography variant="body2">
                        {/* <SignpostIcon fontSize="small" sx={{ marginRight: "5px" }} /> */}
                        {company?.street}</Typography>
                      <Typography variant="body2">
                        {/* <LocationOnIcon fontSize="small" sx={{ marginRight: "5px" }} /> */}
                        {company?.zip},  {company?.city} </Typography>
                    </Container>
                  )}
                  <Container>
                    <Typography variant="overline" style={{ color: 'gray', paddingRight: '3px' }} >{t("Bill to")}</Typography>
                    <Typography variant="subtitle2">
                      {/* <PersonIcon fontSize="small" sx={{ marginRight: "5px" }} /> */}
                      {client?.name}
                    </Typography>
                    <Typography variant="body2" >
                      {/* <SignpostIcon fontSize="small" sx={{ marginRight: "5px" }} /> */}
                      {client?.street}
                    </Typography>
                    <Typography variant="body2" >
                      {/* <LocationOnIcon fontSize="small" sx={{ marginRight: "5px" }} /> */}
                      {client?.zip}, {client?.city}
                    </Typography>
                    <Typography variant="body2" >
                      {/* <EmailIcon fontSize="small" sx={{ marginRight: "5px" }} /> */}
                      {client?.email}
                    </Typography>
                    <Typography variant="body2" >
                      {/* <PhoneIcon fontSize="small" sx={{ marginRight: "5px" }} /> */}
                      {client?.phone}
                    </Typography>
                  </Container>
                </Grid>
                <Grid item style={{ marginRight: 20, textAlign: 'right' }}>
                  <Typography variant="overline" style={{ color: 'gray' }} >{t("Date")}</Typography>
                  <Typography variant="body2" >{moment().format("MMM Do YYYY")}</Typography>
                  <Typography variant="overline" style={{ color: 'gray' }} >{t("Due Date")}</Typography>
                  <Typography variant="body2" >{selectedDate ? moment(selectedDate).format("MMM Do YYYY") : '27th Sep 2021'}</Typography>
                  <Typography variant="overline" >{t("Amount")}</Typography>
                  <Typography variant="h6" >{currency} {toCommas(total)}</Typography>
                </Grid>
              </Grid>
            </Container>
            <form>
              <div>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("Item")}</TableCell>
                        <TableCell >{t("Qty")}</TableCell>
                        <TableCell>{t("Price")}</TableCell>
                        <TableCell >{t("Disc")}(%)</TableCell>
                        <TableCell >{t("Amount")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoiceData?.items?.map((itemField, index) => (
                        <TableRow key={index}>
                          <TableCell scope="row" style={{ width: '40%' }}> <InputBase style={{ width: '100%' }} outline="none" sx={{ ml: 1, flex: 1 }} type="text" name="itemName" value={itemField.itemName} placeholder="Item name or description" readOnly /> </TableCell>
                          <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="quantity" value={itemField?.quantity} placeholder="0" readOnly /> </TableCell>
                          <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="unitPrice" value={itemField?.unitPrice} placeholder="0" readOnly /> </TableCell>
                          <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="discount" value={itemField?.discount} readOnly /> </TableCell>
                          <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="amount" value={(itemField?.quantity * itemField.unitPrice) - (itemField.quantity * itemField.unitPrice) * itemField.discount / 100} readOnly /> </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className={styles.addButton}>
                </div>
              </div>
              <div className={styles.invoiceSummary}>
                <div className={styles.summary}>{t("Invoice Summary")}</div>
                <div className={styles.summaryItem}>
                  <p>{t("Subtotal")}:</p>
                  <h4>{subTotal}</h4>
                </div>
                <div className={styles.summaryItem}>
                  <p>{`VAT(${rates}%):`}</p>
                  <h4>{vat}</h4>
                </div>
                <div className={styles.summaryItem}>
                  <p>{t("Total")}</p>
                  <h4>{currency} {toCommas(total)}</h4>
                </div>
                <div className={styles.summaryItem}>
                  <p>{t("Paid")}</p>
                  <h4>{currency} {toCommas(totalAmountReceived)}</h4>
                </div>
                <div className={styles.summaryItem}>
                  <p>{t("Balance")}</p>
                  <h4 style={{ color: "black", fontSize: "18px", lineHeight: "8px" }}>{currency} {toCommas(total - totalAmountReceived)}</h4>
                </div>
              </div>
              <div className={styles.note}>
                {invoiceData.notes && (
                  <>
                    <h4 style={{ marginLeft: '-10px' }}>Note/Payment Info</h4>
                    <p style={{ fontSize: '14px' }}>{invoiceData.notes}</p>
                  </>
                )}
              </div>
            </form>
            {generateFooter()}
          </Box>
        </div>
      </div >
    </>
  )
}

export default InvoiceDetails
