import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Button,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Stack,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent, InputAdornment, IconButton
} from "@mui/material";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { Formik } from "formik";
import AnimateButton from "components/@extended/AnimateButton";
import { strengthColor, strengthIndicator } from "utils/password-strength";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import useGoBack from '../../../hooks/useGoBack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';



const AuthResetPassword = () => {
    const formRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");
    const { t } = useTranslation();

    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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

    const handleClose = () => {
        setOpen(false);
        navigate("/");
    };

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
                            innerRef={formRef}
                            initialValues={{
                                password: "",
                                confirmPassword: "",
                                submit: null,
                            }}
                            validationSchema={Yup.object().shape({
                                password: Yup.string()
                                    .max(50, "maximum 50 characters")
                                    .required("Password is required"),
                                confirmPassword: Yup.string().oneOf(
                                    [Yup.ref("password"), null],
                                    "Passwords must match"
                                ),
                            })}
                            onSubmit={async (
                                values,
                                { setErrors, setStatus, setSubmitting }
                            ) => {
                                setSubmitting(true);
                                try {
                                    dispatch(setLoading(true));
                                    const { password } = values;
                                    const response = await fetch(
                                        `${BASE_URL}/auth/reset-password?token=${token}`,
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                password,
                                            }),
                                        }
                                    );
                                    if (response.status === 204) {
                                        setStatus({ success: true });
                                        setSubmitting(false);
                                        setOpen(true);
                                        formRef.current.resetForm();
                                    } else {
                                        const json = await response.json();
                                        console.error(json);
                                        setStatus({ success: false });
                                        setErrors({ submit: json.message });
                                        setSubmitting(false);
                                    }
                                    dispatch(setLoading(false));
                                } catch (err) {
                                    console.error(err);
                                    setStatus({ success: false });
                                    setErrors({ submit: err.message });
                                    setSubmitting(false);
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
                                                <InputLabel htmlFor="password-signup">
                                                    {t('Update Password')}
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
                                                        {errors.password}
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
                                                        {errors.confirmPassword}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            {errors.submit && (
                                                <Grid item xs={12}>
                                                    <FormHelperText error>
                                                        {errors.submit}
                                                    </FormHelperText>
                                                </Grid>
                                            )}
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                sx={{ mt: "20px" }}
                                                variant="contained"
                                            >
                                                {t('Update')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </Box>
                </Box>


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
                                <Box sx={{ fontWeight: "bold", m: "20px auto 10px", fontSize: "32px" }} >Password updated Successfully</Box>
                            </Box>
                        </DialogContent>
                    </Box>
                </Dialog>
            </Box>

        </>
    );
};

export default AuthResetPassword;
