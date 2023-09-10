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
    useTheme, useMediaQuery, InputAdornment, IconButton, Select, MenuItem
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
import useGoBack from '../../hooks/useGoBack';
import useNumberOnly from "hooks/useNumberOnly";

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
        lng: localStorage.getItem('selectedLanguage') || "en", // Get the stored language or default to 'en'
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

const BookKeeperRegister = () => {
    const formRef = useRef();
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('selectedLanguage', lng); // Store the selected language in local storage
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

    return (
        <>
            <Grid container >
                <Grid sx={{ background: "#F5F7F9", }} item xs={12} md={5}>
                    <Box sx={{
                        display: "flex", flexDirection: "column",
                        maxWidth: {
                            xs: "530px",
                            md: "unset"
                        }, m: {
                            md: "auto 40px auto 100px;",
                            xs: "auto"
                        }, p: "30px 15px"
                    }}>
                        <Box sx={{ p: "70px 0" }}>
                            <Box sx={{ position: "relative", }}>
                                <Box >
                                    <img
                                        src="/images/percent.png"
                                        alt="percent"
                                        width={200}
                                    />
                                </Box>
                                <Box sx={{ ml: "25px" }}>
                                    <img
                                        src="/images/transaction.png"
                                        alt="transaction"
                                        width={150}

                                    />
                                </Box>
                                <Box sx={{ position: "absolute", top: "65px", left: "110px" }} >
                                    <img
                                        src="/images/hired.png"
                                        alt="hired"
                                        width={170}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{ color: "rgb(14,15,19)" }} component={"h1"}>
                                Welcome back!
                            </Box>
                            <Box sx={{ color: "#9EA3AF" }} component={"p"}>
                                Start managing your finance faster and better<br />
                            </Box>
                        </Box>
                    </Box>

                </Grid>

                <Grid item xs={12} md={7}>

                    <Box sx={{
                        backgroundColor: "#fff", p: "30px 20px"
                    }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <Button
                                sx={{ fontSize: "12px", mb: "10px" }}
                                variant="outlined"
                                onClick={useGoBack}
                                startIcon={<ArrowBackIcon />}
                            >
                                {t('Back')}
                            </Button>
                            <Box sx={{ display: "flex", justifyContent: "end", }}>
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
                            </Box>

                        </Box>
                        <Box sx={{ maxWidth: "500px", margin: "0 auto", p: "40px 0", }}>
                            <Formik
                                innerRef={formRef}
                                initialValues={{
                                    name: "",
                                    email: "",
                                    avatar: "",
                                    phoneNumber: "",
                                    description: "",
                                    password: "",
                                    confirmPassword: "",
                                    submit: null,
                                }}
                                validationSchema={Yup.object().shape({
                                    name: Yup.string().max(50, t("maximum 50 characters"))
                                        .required(t("Name is required")),
                                    email: Yup.string()
                                        .email(t("Must be a valid email"))
                                        .max(50, t("maximum 50 characters"))
                                        .required(t("Email is required")),
                                    phoneNumber: Yup.number()
                                        .required(t("Phone Number is required")),
                                    description: Yup.string()
                                        .max(100, t("maximum 100 characters"))
                                        .required(t("Description is required")),
                                    password: Yup.string()
                                        .max(50, t("maximum 50 characters"))
                                        .required(t("Password is required")),
                                    confirmPassword: Yup.string().oneOf(
                                        [Yup.ref("password"), null],
                                        t("Passwords must match")
                                    ),
                                })}
                                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                    setSubmitting(true);
                                    try {
                                        dispatch(setLoading(true));
                                        const { name, email, password, phoneNumber, description } = values;
                                        const response = await fetch(`${BASE_URL}/bookkeeper/register`, {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                name,
                                                email,
                                                password,
                                                phoneNumber,
                                                description,
                                                avatar: downloadURL,
                                                role: "BookKeeper"
                                            }),
                                        });
                                        const json = await response.json();
                                        if (!response.ok) {
                                            console.error(json);
                                            setStatus({ success: false });
                                            setErrors({ submit: json.message });
                                            setSubmitting(false);
                                            setOpen(false);
                                        }
                                        if (response.ok) {
                                            setStatus({ success: true });
                                            setSubmitting(false);
                                            setOpen(true);
                                        }
                                        dispatch(setLoading(false));
                                    } catch (err) {
                                        console.error(err);
                                        setStatus({ success: false });
                                        setErrors({ submit: err.message });
                                        setSubmitting(false);
                                        setOpen(false);
                                    }
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
                                    setFieldValue,
                                }) => (
                                    <form noValidate onSubmit={handleSubmit}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="name-signup">{t('Name')}</InputLabel>
                                                    <OutlinedInput
                                                        id="name-login"
                                                        type="name"
                                                        value={values.name}
                                                        name="name"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        fullWidth
                                                        error={Boolean(touched.name && errors.name)}
                                                    />
                                                    {touched.name && errors.name && (
                                                        <FormHelperText error id="helper-text-name-signup">
                                                            {t(errors.name)}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="email-signup">
                                                        {t('Email Address')}
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        error={Boolean(touched.email && errors.email)}
                                                        id="email-login"
                                                        type="email"
                                                        value={values.email}
                                                        name="email"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        inputProps={{}}
                                                    />
                                                    {touched.email && errors.email && (
                                                        <FormHelperText error id="helper-text-email-signup">
                                                            {t(errors.email)}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="email-signup">
                                                        {t('Profile Picture')}
                                                    </InputLabel>
                                                    <Button sx={{ width: "100%", p: "0", border: "1px solid #bbb5b5", }} variant="outlined" component="label" >
                                                        <Box sx={{ display: "block", color: "#34495e", cursor: "pointer", height: "50px", lineHeight: "40px", textAlign: "left", background: "#ffffff", overflow: "hidden", position: "relative", width: "100%" }} >
                                                            <Box sx={{ background: "#dce4ec", padding: "0 10px", display: "inline-block", height: "100 %", lineHeight: "50px;" }} > {t('Upload Picture')} </Box>
                                                            <Box sx={{ lineHeight: "40px", display: "inline-block", padding: "0 10px", }} ></Box>
                                                        </Box>
                                                        <input onChange={handleImageUpload} type="file" />
                                                    </Button>
                                                    <img src={downloadURL} alt="" width="100" />
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="phoneNumber-signup">
                                                        {t('Phone Number')}
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                                        id="phoneNumber-login"
                                                        type="phoneNumber"
                                                        value={values.phoneNumber}
                                                        name="phoneNumber"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            useNumberOnly(
                                                                setFieldValue,
                                                                "phoneNumber",
                                                                e
                                                            );
                                                        }}
                                                        placeholder=""
                                                        inputProps={{}}
                                                    />
                                                    {touched.phoneNumber && errors.phoneNumber && (
                                                        <FormHelperText error id="helper-text-phoneNumber-signup">
                                                            {t(errors.phoneNumber)}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="password-signup">
                                                        {t('Password')}
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        error={Boolean(touched.password && errors.password)}
                                                        id="password-signup"
                                                        type={showPassword ? "text" : "password"}
                                                        value={values.password}
                                                        name="password"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            changePassword(e.target.value);
                                                        }}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={handleClickShowPassword}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                    edge="end"
                                                                    size="large"
                                                                >
                                                                    {showPassword ? (
                                                                        <EyeOutlined />
                                                                    ) : (
                                                                        <EyeInvisibleOutlined />
                                                                    )}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        placeholder=""

                                                    />
                                                    {touched.password && errors.password && (
                                                        <FormHelperText error id="helper-text-password-signup">
                                                            {t(errors.password)}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="confirm-password-signup">
                                                        {t('Confirm Password')}
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        error={Boolean(
                                                            touched.confirmPassword && errors.confirmPassword
                                                        )}
                                                        id="confirmPassword-signup"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={values.confirmPassword}
                                                        name="confirmPassword"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                        }}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={handleClickShowConfirmPassword}
                                                                    onMouseDown={handleMouseDownConfirmPassword}
                                                                    edge="end"
                                                                    size="large"
                                                                >
                                                                    {showConfirmPassword ? (
                                                                        <EyeOutlined />
                                                                    ) : (
                                                                        <EyeInvisibleOutlined />
                                                                    )}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        placeholder=""

                                                    />
                                                    {touched.confirmPassword && errors.confirmPassword && (
                                                        <FormHelperText error id="helper-text-confirm-password-signup">
                                                            {t(errors.confirmPassword)}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="description-signup">
                                                        {t('Description')}
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        error={Boolean(touched.description && errors.description)}
                                                        id="description-login"
                                                        type="description"
                                                        value={values.description}
                                                        name="description"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        inputProps={{}}
                                                    />
                                                    {touched.description && errors.description && (
                                                        <FormHelperText error id="helper-text-description-signup">
                                                            {t(errors.description)}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                            </Grid>
                                            {errors.submit && (
                                                <Grid item xs={12}>
                                                    <FormHelperText error>{t(errors.submit)}</FormHelperText>
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <AnimateButton>
                                                    <Button
                                                        disableElevation
                                                        disabled={isSubmitting}
                                                        fullWidth
                                                        size="large"
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={handleClickOpen}
                                                    >
                                                        {t('Create Account')}
                                                    </Button>
                                                </AnimateButton>
                                            </Grid>
                                        </Grid>
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

export default BookKeeperRegister;