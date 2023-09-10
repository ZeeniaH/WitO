import React, { useState } from "react";
import {
    Box,
    Button,
    FormHelperText,
    Grid,
    OutlinedInput,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import AnimateButton from "components/@extended/AnimateButton";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import useGoBack from '../../../hooks/useGoBack';
import { useTranslation } from 'react-i18next';



const AuthForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
        navigate('/')
    };
    const { t } = useTranslation();

    return (
        <>
            <Box sx={{ p: "24px", mt: "60px" }}>

                <Box sx={{ maxWidth: "500px", margin: "0 auto" }}>
                    <Box sx={{ mb: "30px" }}>
                        <Button
                            sx={{ fontSize: "12px", mb: "10px" }}
                            variant="outlined"
                            onClick={useGoBack}
                            startIcon={<ArrowBackIcon />}
                        >
                            {t('Back')}
                        </Button>
                    </Box>
                    <Box>
                        <Formik
                            initialValues={{
                                email: "",
                                submit: null,
                            }}
                            validationSchema={Yup.object().shape({
                                email: Yup.string()
                                    .email("Must be a valid email")
                                    .max(50, "maximum 50 characters")
                                    .required("Email is required"),
                            })}
                            onSubmit={async (
                                values,
                                { setErrors, setStatus, setSubmitting }
                            ) => {
                                setSubmitting(true);
                                try {
                                    dispatch(setLoading(true));
                                    const { email } = values;
                                    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ email }),
                                    });

                                    if (response.status === 204) {
                                        setOpen(true);
                                        setStatus({ success: true });

                                    } else {
                                        const json = await response.json();
                                        if (!response.ok) {
                                            setErrors({ submit: json.message });
                                        }
                                        setStatus({ success: false });
                                    }
                                    setSubmitting(false);
                                    dispatch(setLoading(false));
                                } catch (err) {
                                    console.error(err);
                                    setStatus({ success: false });
                                    setErrors({ submit: err.message });
                                    setSubmitting(false);
                                    dispatch(setLoading(false));
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
                            }) => (
                                <form noValidate onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.email && errors.email)}
                                                    id="email-login"
                                                    type="email"
                                                    value={values.email}
                                                    name="email"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Enter your email address"
                                                    inputProps={{}}
                                                />
                                                {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email-signup">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        {errors.submit && (
                                            <Grid item xs={12}>
                                                <FormHelperText error>{errors.submit}</FormHelperText>
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
                                                >
                                                    Reset Password
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
                                    <Box onClick={handleClose} sx={{ textAlign: "right", color: "#fff", width: "25px" }}><CloseIcon /></Box>
                                </DialogTitle>
                                <DialogContent >
                                    <Box sx={{ color: "#fff", textAlign: "center" }}>
                                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "50px", height: "50px", color: "rgb(58,186,111)", backgroundColor: "#fff", borderRadius: "8px", m: "auto" }} > <DoneIcon sx={{ fontSize: 40 }} /></Box>
                                        <Box sx={{ fontWeight: "bold", m: "20px auto 10px", fontSize: "32px" }} >Check out your E-mail</Box>
                                    </Box>
                                </DialogContent>
                            </Box>
                        </Dialog>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default AuthForgotPassword;
