import React from 'react';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import { Input, Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const InvoiceType = ({ type, setType }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <p style={{ marginBottom: '-10px', paddingTop: '10px', color: 'gray' }}>{t("Select Type")}</p>
      <Button style={{ lineSpacing: 1, fontSize: 35, fontWeight: 700 }} onClick={handleClickOpen}>{type ? type : 'Invoice'}</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
        {/* <DialogTitle>Fill the form</DialogTitle> */}
        <DialogContent>
          <div className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label">{t("Select Type")}
              </InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={type}
                onChange={handleChange}
                input={<Input />}
              >
                <MenuItem value="">
                  <em>{t("Select Type")}
                  </em>
                </MenuItem>
                <MenuItem value="Invoice">{t("Invoice")}
                </MenuItem>
                <MenuItem value="Offer">{t("Offer")}</MenuItem>
                <MenuItem value="Receipt">{t("Receipt")}</MenuItem>
                <MenuItem value="Estimate">{t("Estimate")}</MenuItem>
                <MenuItem value="Bill">{t("Bill")}</MenuItem>
                <MenuItem value="Quotation">{t("Quotation")}</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t("Cancel")}
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InvoiceType