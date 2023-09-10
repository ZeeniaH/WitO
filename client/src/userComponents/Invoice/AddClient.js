import React, { useEffect, useState } from 'react';
import { styled } from '@mui/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next'

import { useDispatch } from 'react-redux';
import { createClient } from '../../redux/actions/clientActions';
import { useLocation, useParams } from 'react-router-dom';

import { useSnackbar } from 'react-simple-snackbar';
import { BASE_URL } from 'config';

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

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  ...styles(theme).root,
}));

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const CustomDialogActions = styled(DialogActions)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1),
}));

const AddClient = ({ setOpen, open, getClientsByUser }) => {
  const location = useLocation();
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    zip: '',
    city: '',
    companyId: [],
  });
  const user = JSON.parse(localStorage.getItem('user'));
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const { t } = useTranslation();

  const params = useParams();
  const currentCompanyId = params.id;

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    zip: '',
    city: '',
  });

  useEffect(() => {
    setClientData({ ...clientData, companyId: [currentCompanyId] });
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!clientData.name.trim()) {
      errors.name = t('Name is required');
    }

    if (!clientData.email.trim()) {
      errors.email = t('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(clientData.email)) {
      errors.email = t('Email is required');

    }

    if (!clientData.phone.trim()) {
      errors.phone = t('Phone Number is required');
    } else if (!/^\d{11}$/.test(clientData.phone)) {
      errors.phone = t('11 digits required');
    }

    if (!clientData.street.trim()) {
      errors.street = t('Street is required');
    }

    if (!clientData.zip.trim()) {
      errors.zip = t('Zip Code is required');
    }

    if (!clientData.city.trim()) {
      errors.city = t('City is required');
    }

    setFormErrors(errors); // Set the errors object in state

    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleSubmitClient = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('new client data', data);
        openSnackbar('Customer added successfully');
        getClientsByUser();
        clear();
        handleClose();
      } else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const clear = () => {
    setClientData((prevData) => ({
      name: '',
      email: '',
      phone: '',
      street: '',
      zip: '',
      city: '',
      companyId: prevData.companyId,
    }));
    setFormErrors({
      name: '',
      email: '',
      phone: '',
      street: '',
      zip: '',
      city: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const inputStyle = {
    display: 'block',
    padding: '1.4rem 0.75rem',
    width: '100%',
    fontSize: '0.8rem',
    lineHeight: 1.25,
    color: '#55595c',
    backgroundColor: '#fff',
    backgroundImage: 'none',
    backgroundClip: 'padding-box',
    borderTop: '0',
    borderRight: '0',
    borderBottom: '1px solid #eee',
    borderLeft: '0',
    borderRadius: '3px',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 1, 1)',
  };

  return (
    <div>
      <div>
        <Dialog onClose={handleClose} open={open} fullWidth>
          <CustomDialogTitle id="customized-dialog-title" onClose={handleClose} style={{ paddingLeft: '20px', color: 'white' }}>
            {t("New Customer")}
          </CustomDialogTitle>
          <CustomDialogContent dividers>
            <div className="customInputs">
              <input
                placeholder={t("Name")}
                style={inputStyle}
                name="name"
                type="text"
                onChange={(e) => {
                  setClientData({ ...clientData, name: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, name: '' })); // Remove the error message
                }}
                value={clientData.name}
              />
              {formErrors.name && <span style={{ color: 'red' }}>{t(formErrors.name)}</span>}
              <input
                placeholder={t("Email")}
                style={inputStyle}
                name="email"
                type="text"
                onChange={(e) => {
                  setClientData({ ...clientData, email: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, email: '' })); // Remove the error message
                }}
                value={clientData.email}
              />
              {formErrors.email && <span style={{ color: 'red' }}>{t(formErrors.email)}</span>}
              <input
                placeholder={t("Phone Number")}
                style={inputStyle}
                name="phone"
                type="phone"
                onChange={(e) => {
                  setClientData({ ...clientData, phone: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, phone: '' })); // Remove the error message
                }}
                value={clientData.phone}
              />
              {formErrors.phone && <span style={{ color: 'red' }}>{t(formErrors.phone)}</span>}
              <input
                placeholder={t("Street / Street No")}
                style={inputStyle}
                name="street"
                type="text"
                onChange={(e) => {
                  setClientData({ ...clientData, street: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, street: '' })); // Remove the error message
                }}
                value={clientData.street}
              />
              {formErrors.street && <span style={{ color: 'red' }}>{t(formErrors.street)}</span>}
              <input
                placeholder={t("ZIP Code")}
                style={inputStyle}
                name="zip"
                type="text"
                onChange={(e) => {
                  setClientData({ ...clientData, zip: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, zip: '' })); // Remove the error message
                }}
                value={clientData.zip}
              />
              {formErrors.zip && <span style={{ color: 'red' }}>{t(formErrors.zip)}</span>}
              <input
                placeholder={t("City")}
                style={inputStyle}
                name="city"
                type="text"
                onChange={(e) => {
                  setClientData({ ...clientData, city: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, city: '' })); // Remove the error message
                }}
                value={clientData.city}
              />
              {formErrors.city && <span style={{ color: 'red' }}>{t(formErrors.city)}</span>}
            </div>
          </CustomDialogContent>
          <CustomDialogActions>
            <Button autoFocus onClick={handleSubmitClient} variant="contained" style={{ marginRight: '25px' }}>
              {t("Save Customer")}
            </Button>
          </CustomDialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default AddClient;
