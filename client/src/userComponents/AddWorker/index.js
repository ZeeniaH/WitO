import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// material-ui
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    Select,
    MenuItem,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project import
import AnimateButton from "components/@extended/AnimateButton";
import { strengthColor, strengthIndicator } from "utils/password-strength";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useRegister } from "hooks/useRegister";
import { BASE_URL } from "config";
import { useAuthContext } from "hooks/useAuthContext";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, isLoading, error } = useRegister();
    // const { user } = useAuthContext();
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    return (
        <>
            <Box sx={{ maxWidth: "500px", margin: "0 auto" }}>
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
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
                        phoneNumber: Yup.number().required("phone Number is required"),
                        password: Yup.string().max(50, "maximum 50 characters").required("Password is required"),
                        confirmPassword: Yup.string().oneOf(
                            [Yup.ref("password"), null],
                            "Passwords must match"
                        ),
                        role: Yup.string().max(50, "maximum 50 characters").required("Role is required"),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        setSubmitting(true);
                        try {
                            dispatch(setLoading(true));
                            const { name, email, password, phoneNumber, } = values;
                            const response = await fetch(`${BASE_URL}/user`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${user.tokens.access.token}`,
                                },
                                body: JSON.stringify({ name, email, password, phoneNumber, role: "Worker" }),
                            });
                            const json = await response.json();
                            if (!response.ok) {

                                setStatus({ success: false });
                                setErrors({ submit: json.message });
                                setSubmitting(false);
                            }
                            if (response.ok) {
                                // update loading state
                                setStatus({ success: true });
                                setSubmitting(false);
                                navigate("/dashboard/users");
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
                                        <InputLabel htmlFor="name-signup">Name*</InputLabel>
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
                                                {errors.name}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="email-signup">
                                            Email Address*
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
                                                {errors.email}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="phoneNumber-signup">
                                            Phone Number*
                                        </InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                            id="phoneNumber-login"
                                            type="phoneNumber"
                                            value={values.phoneNumber}
                                            name="phoneNumber"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder=""
                                            inputProps={{}}
                                        />
                                        {touched.phoneNumber && errors.phoneNumber && (
                                            <FormHelperText error id="helper-text-phoneNumber-signup">
                                                {errors.phoneNumber}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="password-signup">Password</InputLabel>
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

                                        />
                                        {touched.password && errors.password && (
                                            <FormHelperText error id="helper-text-password-signup">
                                                {errors.password}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item>
                                                <Box
                                                    sx={{
                                                        backgroundColor: level?.color,
                                                        width: 85,
                                                        height: 8,
                                                        borderRadius: "7px",
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle1" fontSize="0.75rem">
                                                    {level?.label}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="confirmPassword-signup">
                                            Confirm Password
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

                                        />
                                        {touched.confirmPassword && errors.confirmPassword && (
                                            <FormHelperText
                                                error
                                                id="helper-text-confirmPassword-signup"
                                            >
                                                {errors.confirmPassword}
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
                                            Create Account
                                        </Button>
                                    </AnimateButton>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Box>
        </>
    );
};

export default AuthRegister;
