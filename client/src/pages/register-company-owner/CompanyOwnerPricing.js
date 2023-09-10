import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// material-ui
import {
    Box,
    Button,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    useTheme, useMediaQuery, InputAdornment, IconButton, Select, MenuItem, Container
} from "@mui/material";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import enTranslation from "../../en.json";
import deTranslation from "../../de.json";



// third party
import * as Yup from "yup";
import { Formik, resetForm } from "formik";
import firebase from "API/firebase";

// project import
import AnimateButton from "components/@extended/AnimateButton";
import { strengthColor, strengthIndicator } from "utils/password-strength";

// assets
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { React_Price_TableId } from 'config';
import { Publishable_Key } from 'config';
import { useLogout } from "hooks/useLogout";

// ============================|| FIREBASE - REGISTER ||============================ //
const resources = {
    en: {
        translation: enTranslation
    },
    de: {
        translation: deTranslation
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });
const CompanyOwnerPricing = () => {
    const formRef = useRef();
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const { logout } = useLogout();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        changePassword("");
    }, []);


    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
        navigate('/');
    };
    const [downloadURL, setDownloadURL] = useState("");

    const handleImageUpload = async (event) => {
        dispatch(setLoading(true));
        const file = event.target.files[0];
        const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
        const blockedExtensions = [".jfif"];
        const maxSize = 2000 * 1024; // 2000KB
        const extension = file.name.substr(file.name.lastIndexOf("."));

        if (!allowedTypes.includes(file.type) || blockedExtensions.includes(extension)) {
            alert(`File ${file.name} is not a JPG, JPEG, or PNG image`);
            dispatch(setLoading(false));
            return;
        }
        if (file.size > maxSize) {
            alert("File size must not exceed 2MB");
            dispatch(setLoading(false));
            return;
        }
        const storageRef = firebase.storage().ref();
        const imagesRef = storageRef.child("images");
        const fileRef = imagesRef.child(file.name);
        const snapshot = await fileRef.put(file);
        await snapshot.ref.getDownloadURL().then(function (url) {
            console.log("File available at", url);
            setDownloadURL(url);
        });
        dispatch(setLoading(false));
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <>
            <Grid container >

                <Grid item xs={12} md={12}>

                    <Box sx={{
                        backgroundColor: "#fff", p: "30px 20px"
                    }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleLogout}>
                                {t('Log Out')}
                            </Button>
                            {/* <Box sx={{ display: "flex", justifyContent: "end", }}>
                                <Select
                                    sx={{ color: "#000", borderColor: "unset" }}
                                    value={i18n.language}
                                    onChange={(event) => changeLanguage(event.target.value)}
                                    inputProps={{
                                        'aria-label': 'language-select',
                                    }}
                                >
                                    <MenuItem value="de">
                                        <img
                                            src="/images/germany.png"
                                            alt="Germany"
                                            style={{ width: "20px", height: "auto", marginRight: "5px" }}
                                        />
                                        de
                                    </MenuItem>
                                    <MenuItem value="en">
                                        <img
                                            src="/images/england.png"
                                            alt="England"
                                            style={{ width: "20px", height: "auto", marginRight: "5px" }}
                                        />
                                        en
                                    </MenuItem>
                                </Select>
                            </Box> */}

                        </Box>
                        <Box sx={{ p: "40px 0", }}>
                            <Formik
                                innerRef={formRef}
                                initialValues={{
                                    name: "",
                                    email: "",
                                    avatar: "",
                                    phoneNumber: "",
                                    password: "",
                                    confirmPassword: "",
                                    submit: null,
                                }}
                                validationSchema={Yup.object().shape({
                                    name: Yup.string().max(50, "maximum 50 characters").required("Name is required"),
                                    email: Yup.string()
                                        .email("Must be a valid email")
                                        .max(50, "maximum 50 characters")
                                        .required("Email is required"),
                                    phoneNumber: Yup.number().required("Phone Number is required"),
                                    password: Yup.string().max(50, "maximum 50 characters").required("Password is required"),
                                    confirmPassword: Yup.string().oneOf(
                                        [Yup.ref("password"), null],
                                        "Passwords must match"
                                    ),
                                })}
                                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                    // setSubmitting(true);
                                    // try {
                                    //     dispatch(setLoading(true));
                                    //     const { name, email, password, phoneNumber } = values;
                                    //     const response = await fetch(`${BASE_URL}/companyowner/register`, {
                                    //         method: "POST",
                                    //         headers: {
                                    //             "Content-Type": "application/json",
                                    //         },
                                    //         body: JSON.stringify({
                                    //             name,
                                    //             email,
                                    //             password,
                                    //             phoneNumber,
                                    //             avatar: downloadURL,
                                    //             role: "BookKeeper"
                                    //         }),
                                    //     });
                                    //     const json = await response.json();
                                    //     if (!response.ok) {
                                    //         console.error(json);
                                    //         setStatus({ success: false });
                                    //         setErrors({ submit: json.message });
                                    //         setSubmitting(false);
                                    //         setOpen(false);
                                    //     }
                                    //     if (response.ok) {
                                    //         setStatus({ success: true });
                                    //         setSubmitting(false);
                                    //         setOpen(true);
                                    //         formRef.current.resetForm();
                                    //     }
                                    //     dispatch(setLoading(false));
                                    // } catch (err) {
                                    //     console.error(err);
                                    //     setStatus({ success: false });
                                    //     setErrors({ submit: err.message });
                                    //     setSubmitting(false);
                                    //     setOpen(false);
                                    // }
                                }}
                            >
                                {({
                                    errors,
                                    handleBlur,
                                    handleChange,
                                    handleSubmit,
                                    isSubmitting,
                                    touched,
                                    values,
                                }) => (
                                    <form noValidate onSubmit={handleSubmit}>
                                        <Container maxWidth="md">
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={12}>
                                                    <stripe-pricing-table pricing-table-id={React_Price_TableId}
                                                        publishable-key={Publishable_Key}>
                                                    </stripe-pricing-table>
                                                </Grid>
                                            </Grid>
                                        </Container>
                                    </form>
                                )}
                            </Formik>

                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <Box sx={{
                                    backgroundColor: "rgb(58,186,111)", width: {
                                        sm: "600px",
                                        xs: "300px"
                                    }
                                }}>
                                    <DialogTitle sx={{ display: "flex", justifyContent: "end" }} id="responsive-dialog-title">
                                        <Box onClick={handleClose} sx={{ textAlign: "right", color: "#fff", width: "25px", cursor: "pointer" }}><CloseIcon /></Box>
                                    </DialogTitle>
                                    <DialogContent >
                                        <Box sx={{ color: "#fff", textAlign: "center" }}>
                                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "50px", height: "50px", color: "rgb(58,186,111)", backgroundColor: "#fff", borderRadius: "8px", m: "auto" }} > <DoneIcon sx={{ fontSize: 40 }} /></Box>
                                            <Box sx={{ fontWeight: "bold", m: "20px auto 10px", fontSize: "32px" }} >{t('Your application has been submitted')}</Box>
                                            <Box sx={{ fontSize: "18px", pb: "10px" }}>{t('We will contact you soon.')}</Box>
                                        </Box>
                                    </DialogContent>
                                </Box>
                            </Dialog>
                        </Box >
                    </Box>
                </Grid >

            </Grid >

        </>
    );
};

export default CompanyOwnerPricing;