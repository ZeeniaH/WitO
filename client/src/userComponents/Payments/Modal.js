import React, { useState, useEffect } from 'react';
import { withStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import DatePicker from './DatePicker';
import Autocomplete from '@mui/material/Autocomplete';

import { useDispatch } from 'react-redux';
import { updateInvoice } from '../../redux/actions/invoiceActions';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: '#1976D2',
    marginLeft: 0,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: 'white',
  },
});

const CustomDialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
});

const CustomDialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}))(DialogContent);

const CustomDialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(DialogActions);

const Modal = ({ setOpen, open, invoice }) => {
  const dispatch = useDispatch();
  const [payment, setPayment] = useState({
    amountPaid: 0,
    datePaid: new Date(),
    paymentMethod: '',
    note: '',
    paidBy: '',
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [method, setMethod] = useState({});
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [updatedInvoice, setUpdatedInvoice] = useState({});

  useEffect(() => {
    setPayment({ ...payment, paymentMethod: method?.title });
  }, [method]);

  useEffect(() => {
    setPayment({ ...payment, datePaid: selectedDate });
  }, [selectedDate]);

  useEffect(() => {
    if (invoice) {
      setPayment({
        ...payment,
        amountPaid: Number(invoice.total) - Number(invoice.totalAmountReceived),
        paidBy: invoice?.client?.name,
      });
    }
  }, [invoice]);

  useEffect(() => {
    if (invoice?.paymentRecords) {
      setPaymentRecords(invoice?.paymentRecords);
    }
  }, [invoice]);

  useEffect(() => {
    let totalReceived = 0;
    for (let i = 0; i < invoice?.paymentRecords?.length; i++) {
      totalReceived += Number(invoice?.paymentRecords[i]?.amountPaid);
      setTotalAmountReceived(totalReceived);
    }
  }, [invoice, payment]);

  useEffect(() => {
    setUpdatedInvoice({
      ...invoice,
      status:
        Number(totalAmountReceived) + Number(payment.amountPaid) >= invoice?.total ? 'Paid' : 'Partial',
      paymentRecords: [...paymentRecords, payment],
      totalAmountReceived: Number(totalAmountReceived) + Number(payment.amountPaid),
    });
  }, [payment, paymentRecords, totalAmountReceived, invoice]);

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    dispatch(updateInvoice(invoice._id, updatedInvoice)).then(() => {
      handleClose();
      window.location.reload();
    });
  };

  const clear = () => { };

  const handleClose = () => {
    setOpen(false);
  };

  const paymentMethods = [
    { title: 'Bank Transfer' },
    { title: 'Cash' },
    { title: 'Credit Card' },
    { title: 'PayPal' },
    { title: 'Others' },
  ];

  return (
    <div>
      <form>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth>
          <CustomDialogTitle id="customized-dialog-title" onClose={handleClose} style={{ paddingLeft: '20px', color: 'white' }}>
            Record Payment
          </CustomDialogTitle>
          <CustomDialogContent dividers>
            <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            <TextField
              type="number"
              name="amountPaid"
              label="Amount Paid"
              fullWidth
              style={{ padding: 10 }}
              variant="outlined"
              onChange={(e) => setPayment({ ...payment, amountPaid: e.target.value })}
              value={payment.amountPaid}
            />

            <Grid item fullWidth>
              <Autocomplete
                id="combo-box-demo"
                options={paymentMethods}
                getOptionLabel={(option) => option.title || ''}
                style={{ width: '96%', marginLeft: '10px' }}
                renderInput={(params) => <TextField {...params} label="Payment Method" variant="outlined" />}
                value={method}
                onChange={(event, value) => setMethod(value)}
              />
            </Grid>

            <TextField
              type="text"
              name="note"
              label="Note"
              fullWidth
              style={{ padding: 10 }}
              variant="outlined"
              onChange={(e) => setPayment({ ...payment, note: e.target.value })}
              value={payment.note}
            />
          </CustomDialogContent>
          <CustomDialogActions>
            <Button autoFocus onClick={handleSubmitPayment} variant="contained" style={{ marginRight: '25px' }}>
              Save Record
            </Button>
          </CustomDialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default Modal;
